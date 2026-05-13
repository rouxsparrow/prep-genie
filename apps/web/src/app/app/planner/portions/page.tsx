import Link from "next/link";

import { format } from "date-fns";

import { listPeople } from "@/lib/db/people";
import { listRecipes } from "@/lib/db/recipes";
import { getOrCreateWeeklyPlan, listPlanMeals, publishWeeklyPlan, replacePlanPortions, type MealSlot } from "@/lib/db/plans";
import { toWeekStartDateISO, weekDatesFromStart } from "@/lib/date/week";
import { macrosForRecipe, solveSlot, withinTolerance, getSlotRatios } from "@/lib/solver/solver";

function labelMealSlot(slot: MealSlot) {
  if (slot === "breakfast") return "Breakfast";
  if (slot === "lunch") return "Lunch";
  return "Dinner";
}

export default async function PortionsPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const params = await searchParams;
  const rawWeek =
    params.week && /^\d{4}-\d{2}-\d{2}$/.test(params.week) ? params.week : format(new Date(), "yyyy-MM-dd");
  const weekStart = toWeekStartDateISO(new Date(`${rawWeek}T00:00:00Z`));

  const plan = await getOrCreateWeeklyPlan(weekStart);
  const [people, recipes, meals] = await Promise.all([listPeople(), listRecipes(), listPlanMeals(plan.id)]);
  const recipesById = new Map(recipes.map((r) => [r.id, r]));

  const dates = weekDatesFromStart(weekStart);

  async function publish(formData: FormData) {
    "use server";

    const week = String(formData.get("week_start") ?? "");
    const weekStartDate = toWeekStartDateISO(new Date(`${week}T00:00:00Z`));

    const planRow = await getOrCreateWeeklyPlan(weekStartDate);
    if (planRow.status === "published") return;

    const [peopleRows, recipeRows, mealRows] = await Promise.all([
      listPeople(),
      listRecipes(),
      listPlanMeals(planRow.id),
    ]);
    const recipeMap = new Map(recipeRows.map((r) => [r.id, r]));
    const dateRows = weekDatesFromStart(weekStartDate);

    const portionRows: Parameters<typeof replacePlanPortions>[1] = [];

    for (const person of peopleRows) {
      const ratios = getSlotRatios(person.meals_per_day);
      const dailyTargets = {
        kcal: person.daily_kcal,
        protein_g: person.daily_protein_g,
        carbs_g: person.daily_carbs_g,
        fat_g: person.daily_fat_g,
      };

      const activeSlots = (Object.keys(ratios) as MealSlot[]).filter((s) => ratios[s] > 0);

      for (const date of dateRows) {
        for (const slot of activeSlots) {
          const meal = mealRows.find((m) => m.person_id === person.id && m.date === date && m.meal_slot === slot);
          const selection = {
            protein: meal?.protein_recipe_id ? (recipeMap.get(meal.protein_recipe_id) ?? null) : null,
            carb: meal?.carb_recipe_id ? (recipeMap.get(meal.carb_recipe_id) ?? null) : null,
            veg: meal?.veg_recipe_id ? (recipeMap.get(meal.veg_recipe_id) ?? null) : null,
            extra: meal?.extra_recipe_id ? (recipeMap.get(meal.extra_recipe_id) ?? null) : null,
          };

          const result = solveSlot({
            slotRatio: ratios[slot],
            dailyTargets,
            clamps: person.clamps,
            selection,
          });

          for (const cat of ["protein", "carb", "veg", "extra"] as const) {
            const grams = result.portions[cat].grams_cooked;
            const recipe = selection[cat];
            const macros =
              recipe && grams > 0
                ? macrosForRecipe(recipe, grams)
                : { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 };

            portionRows.push({
              plan_id: planRow.id,
              person_id: person.id,
              date,
              meal_slot: slot,
              category: cat,
              grams_cooked: grams,
              is_manual: result.portions[cat].is_manual,
              clamp_applied: result.portions[cat].clamp_applied,
              kcal: macros.kcal,
              protein_g: macros.protein_g,
              carbs_g: macros.carbs_g,
              fat_g: macros.fat_g,
            });
          }
        }
      }
    }

    await replacePlanPortions(planRow.id, portionRows);
    await publishWeeklyPlan(planRow.id);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Portions</h1>
          <p className="text-sm text-zinc-600">
            Week (Mon–Sun): {weekStart} · <Link className="underline" href={`/app/planner?week=${weekStart}`}>Back to planner</Link>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {plan.status === "published" ? (
            <div className="rounded-md border bg-white px-3 py-2 text-sm font-medium">Published</div>
          ) : (
            <form action={publish}>
              <input type="hidden" name="week_start" value={weekStart} />
              <button className="h-10 rounded-md bg-zinc-900 px-3 text-sm font-medium text-white" type="submit">
                Publish snapshot
              </button>
            </form>
          )}
        </div>
      </div>

      {people.length === 0 ? (
        <div className="rounded-lg border bg-white p-6 text-sm text-zinc-700">No people yet.</div>
      ) : null}

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
                  Targets: {dailyTargets.kcal} kcal · P {dailyTargets.protein_g}g · C {dailyTargets.carbs_g}g · F {dailyTargets.fat_g}g (coverage 80%)
                </div>
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

                        const result = solveSlot({
                          slotRatio: ratios[slot],
                          dailyTargets,
                          clamps: person.clamps,
                          selection,
                        });

                        const okKcal = withinTolerance({ value: result.macros.kcal, target: result.target.kcal, plusMinusPct: 0.1 });
                        const okProtein = withinTolerance({ value: result.macros.protein_g, target: result.target.protein_g, plusMinusPct: 0.15 });
                        const okCarb = withinTolerance({ value: result.macros.carbs_g, target: result.target.carbs_g, plusMinusPct: 0.2 });
                        const okFat = withinTolerance({ value: result.macros.fat_g, target: result.target.fat_g, plusMinusPct: 0.2 });
                        const allOk = okKcal && okProtein && okCarb && okFat && !result.incomplete;

                        return (
                          <div
                            key={slot}
                            className={[
                              "rounded-md border p-3",
                              allOk ? "border-emerald-200 bg-emerald-50/40" : result.incomplete ? "border-amber-200 bg-amber-50/50" : "bg-white",
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

                            <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                              {(["protein", "carb", "veg", "extra"] as const).map((cat) => (
                                <div key={cat} className="flex items-center justify-between rounded border bg-white px-3 py-2">
                                  <div className="capitalize">{cat}</div>
                                  <div className="font-mono">{result.portions[cat].grams_cooked}g</div>
                                </div>
                              ))}
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
