"use client";

import { useMemo, useState } from "react";

import { format } from "date-fns";

import type { PersonRow, RecipeRow } from "@/lib/db/types";
import type { MealSlot, PlanMealRow, WeeklyPlanStatus } from "@/lib/db/plans";
import { getSlotRatios, solveSlot, withinTolerance, type ManualOverrides } from "@/lib/solver/solver";

function labelMealSlot(slot: MealSlot) {
  if (slot === "breakfast") return "Breakfast";
  if (slot === "lunch") return "Lunch";
  return "Dinner";
}

function toNumber(value: string) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

type OverrideKey = string; // `${personId}|${date}|${slot}`

export default function PortionsClient({
  weekStart,
  planStatus,
  people,
  recipes,
  meals,
  dates,
  publishAction,
}: {
  weekStart: string;
  planStatus: WeeklyPlanStatus;
  people: PersonRow[];
  recipes: RecipeRow[];
  meals: PlanMealRow[];
  dates: string[];
  publishAction: (formData: FormData) => Promise<void>;
}) {
  const recipesById = useMemo(() => new Map(recipes.map((r) => [r.id, r])), [recipes]);

  const [overrides, setOverrides] = useState<Record<OverrideKey, ManualOverrides>>({});

  const overridesJson = useMemo(() => JSON.stringify(overrides), [overrides]);

  const isPublished = planStatus === "published";

  return (
    <div className="space-y-6">
      {people.length === 0 ? (
        <div className="rounded-lg border bg-white p-6 text-sm text-zinc-700">No people yet.</div>
      ) : null}

      <div className="flex items-center justify-end gap-2">
        {isPublished ? (
          <div className="rounded-md border bg-white px-3 py-2 text-sm font-medium">Published</div>
        ) : (
          <form action={publishAction}>
            <input type="hidden" name="week_start" value={weekStart} />
            <input type="hidden" name="overrides_json" value={overridesJson} />
            <button className="h-10 rounded-md bg-zinc-900 px-3 text-sm font-medium text-white" type="submit">
              Publish snapshot
            </button>
          </form>
        )}
      </div>

      <div className="space-y-6">
        {people.map((person) => {
          const ratios = getSlotRatios(person.meals_per_day);
          const dailyTargets = {
            kcal: person.daily_kcal,
            protein_g: person.daily_protein_g,
            carbs_g: person.daily_carbs_g,
            fat_g: person.daily_fat_g,
          };

          const activeSlots = (Object.keys(ratios) as MealSlot[]).filter((s) => ratios[s] > 0);

          return (
            <section key={person.id} className="rounded-lg border bg-white p-4">
              <div className="mb-4">
                <div className="font-medium">{person.name}</div>
                <div className="text-sm text-zinc-600">
                  Targets: {dailyTargets.kcal} kcal · P {dailyTargets.protein_g}g · C {dailyTargets.carbs_g}g · F{" "}
                  {dailyTargets.fat_g}g (coverage 80%)
                </div>
                {!isPublished ? (
                  <div className="text-xs text-zinc-600">Manual adjust: edit grams. System rebalances carb + veg.</div>
                ) : null}
              </div>

              <div className="grid gap-4">
                {dates.map((date) => (
                  <div key={date} className="rounded-md border p-3">
                    <div className="text-sm font-medium">
                      {format(new Date(`${date}T00:00:00Z`), "EEE")} · {date}
                    </div>

                    <div className="mt-3 grid gap-3">
                      {activeSlots.map((slot) => {
                        const meal = meals.find(
                          (m) => m.person_id === person.id && m.date === date && m.meal_slot === slot,
                        );

                        const selection = {
                          protein: meal?.protein_recipe_id ? (recipesById.get(meal.protein_recipe_id) ?? null) : null,
                          carb: meal?.carb_recipe_id ? (recipesById.get(meal.carb_recipe_id) ?? null) : null,
                          veg: meal?.veg_recipe_id ? (recipesById.get(meal.veg_recipe_id) ?? null) : null,
                          extra: meal?.extra_recipe_id ? (recipesById.get(meal.extra_recipe_id) ?? null) : null,
                        };

                        const key = `${person.id}|${date}|${slot}`;
                        const result = solveSlot({
                          slotRatio: ratios[slot],
                          dailyTargets,
                          clamps: person.clamps,
                          selection,
                          manualOverrides: overrides[key],
                        });

                        const okKcal = withinTolerance({
                          value: result.macros.kcal,
                          target: result.target.kcal,
                          plusMinusPct: 0.1,
                        });
                        const okProtein = withinTolerance({
                          value: result.macros.protein_g,
                          target: result.target.protein_g,
                          plusMinusPct: 0.15,
                        });
                        const okCarb = withinTolerance({
                          value: result.macros.carbs_g,
                          target: result.target.carbs_g,
                          plusMinusPct: 0.2,
                        });
                        const okFat = withinTolerance({
                          value: result.macros.fat_g,
                          target: result.target.fat_g,
                          plusMinusPct: 0.2,
                        });
                        const allOk = okKcal && okProtein && okCarb && okFat && !result.incomplete;

                        function setOverride(cat: "protein" | "carb" | "veg", grams: number) {
                          setOverrides((prev) => ({
                            ...prev,
                            [key]: { ...(prev[key] ?? {}), [cat]: grams },
                          }));
                        }

                        function clearOverride(cat: "protein" | "carb" | "veg") {
                          setOverrides((prev) => {
                            const next = { ...(prev[key] ?? {}) };
                            delete next[cat];
                            const out = { ...prev };
                            if (Object.keys(next).length === 0) {
                              delete out[key];
                            } else {
                              out[key] = next;
                            }
                            return out;
                          });
                        }

                        return (
                          <div
                            key={slot}
                            className={[
                              "rounded-md border p-3",
                              allOk
                                ? "border-emerald-200 bg-emerald-50/40"
                                : result.incomplete
                                  ? "border-amber-200 bg-amber-50/50"
                                  : "bg-white",
                            ].join(" ")}
                          >
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium">{labelMealSlot(slot)}</div>
                              {result.incomplete ? (
                                <div className="text-xs font-medium text-amber-800">Incomplete recipes</div>
                              ) : allOk ? (
                                <div className="text-xs font-medium text-emerald-700">OK</div>
                              ) : (
                                <div className="text-xs font-medium text-zinc-700">Deviation</div>
                              )}
                            </div>

                            <div className="mt-2 grid gap-2 sm:grid-cols-2">
                              {(["protein", "carb", "veg", "extra"] as const).map((cat) => {
                                const isEditable = !isPublished && (cat === "protein" || cat === "carb" || cat === "veg");
                                return (
                                  <div
                                    key={cat}
                                    className={[
                                      "flex items-center justify-between gap-2 rounded border bg-white px-3 py-2",
                                      result.portions[cat].clamp_applied ? "border-amber-200" : "",
                                    ].join(" ")}
                                  >
                                    <div className="capitalize text-sm">{cat}</div>
                                    {isEditable ? (
                                      <div className="flex items-center gap-2">
                                        <input
                                          className="h-9 w-24 rounded-md border px-2 text-sm font-mono"
                                          type="number"
                                          min={0}
                                          step={5}
                                          value={result.portions[cat].grams_cooked}
                                          onChange={(e) => setOverride(cat, toNumber(e.target.value))}
                                        />
                                        <button
                                          type="button"
                                          className="rounded-md border bg-white px-2 py-1 text-xs"
                                          onClick={() => clearOverride(cat)}
                                        >
                                          Auto
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="font-mono text-sm">{result.portions[cat].grams_cooked}g</div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            <div className="mt-2 grid gap-2 text-xs text-zinc-700 sm:grid-cols-4">
                              <div className={okKcal ? "" : "text-amber-800"}>
                                kcal {Math.round(result.macros.kcal)}/{Math.round(result.target.kcal)}
                              </div>
                              <div className={okProtein ? "" : "text-amber-800"}>
                                P {Math.round(result.macros.protein_g)}/{Math.round(result.target.protein_g)}
                              </div>
                              <div className={okCarb ? "" : "text-amber-800"}>
                                C {Math.round(result.macros.carbs_g)}/{Math.round(result.target.carbs_g)}
                              </div>
                              <div className={okFat ? "" : "text-amber-800"}>
                                F {Math.round(result.macros.fat_g)}/{Math.round(result.target.fat_g)}
                              </div>
                            </div>

                            {Object.values(result.portions).some((p) => p.clamp_applied) ? (
                              <div className="mt-2 text-xs font-medium text-amber-800">
                                Clamp applied (highlighted). Deviation expected.
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
