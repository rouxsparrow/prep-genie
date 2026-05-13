import Link from "next/link";
import { redirect } from "next/navigation";

import { format } from "date-fns";

import { listPeople } from "@/lib/db/people";
import { listRecipes } from "@/lib/db/recipes";
import { getOrCreateWeeklyPlan, listPlanMeals, upsertPlanMeal, type MealSlot } from "@/lib/db/plans";
import { toWeekStartDateISO, weekDatesFromStart } from "@/lib/date/week";

const mealSlotsByCount: Record<2 | 3, MealSlot[]> = {
  2: ["breakfast", "lunch"],
  3: ["breakfast", "lunch", "dinner"],
};

function labelMealSlot(slot: MealSlot) {
  if (slot === "breakfast") return "Breakfast";
  if (slot === "lunch") return "Lunch";
  return "Dinner";
}

export default async function PlannerPage({
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

  const recipesByCategory = {
    protein: recipes.filter((r) => r.category === "protein"),
    carb: recipes.filter((r) => r.category === "carb"),
    veg: recipes.filter((r) => r.category === "veg"),
    extra: recipes.filter((r) => r.category === "extra"),
  };

  const dates = weekDatesFromStart(weekStart);

  async function setMeal(formData: FormData) {
    "use server";
    const planId = String(formData.get("plan_id") ?? "");
    const personId = String(formData.get("person_id") ?? "");
    const date = String(formData.get("date") ?? "");
    const mealSlot = String(formData.get("meal_slot") ?? "") as MealSlot;

    const protein = String(formData.get("protein_recipe_id") ?? "") || null;
    const carb = String(formData.get("carb_recipe_id") ?? "") || null;
    const veg = String(formData.get("veg_recipe_id") ?? "") || null;
    const extra = String(formData.get("extra_recipe_id") ?? "") || null;

    await upsertPlanMeal({
      plan_id: planId,
      person_id: personId,
      date,
      meal_slot: mealSlot,
      protein_recipe_id: protein,
      carb_recipe_id: carb,
      veg_recipe_id: veg,
      extra_recipe_id: extra,
    });

    redirect(`/app/planner?week=${weekStart}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Planner</h1>
          <p className="text-sm text-zinc-600">
            Week (Mon–Sun): {weekStart} ·{" "}
            <Link className="underline" href={`/app/planner/portions?week=${weekStart}`}>
              View portions
            </Link>
          </p>
        </div>
        <form
          action={async (formData) => {
            "use server";
            const week = String(formData.get("week") ?? "");
            const weekStartDate = toWeekStartDateISO(new Date(`${week}T00:00:00Z`));
            redirect(`/app/planner?week=${weekStartDate}`);
          }}
          className="flex items-end gap-2"
        >
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs text-zinc-600">Pick any date in week</span>
            <input
              type="date"
              name="week"
              defaultValue={rawWeek}
              className="h-10 rounded-md border px-3"
            />
          </label>
          <button className="h-10 rounded-md border bg-white px-3 text-sm font-medium" type="submit">
            Go
          </button>
        </form>
      </div>

      {people.length === 0 ? (
        <div className="rounded-lg border bg-white p-6 text-sm text-zinc-700">
          No people yet. Create a person first:{" "}
          <Link className="underline" href="/app/people/new">
            New person
          </Link>
          .
        </div>
      ) : null}

      <div className="space-y-6">
        {people.map((person) => {
          const slots = mealSlotsByCount[person.meals_per_day];
          const personMeals = meals.filter((m) => m.person_id === person.id);
          const incompleteCount = personMeals.filter(
            (m) => !m.protein_recipe_id || !m.carb_recipe_id || !m.veg_recipe_id,
          ).length;

          return (
            <section key={person.id} className="rounded-lg border bg-white p-4">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium">{person.name}</div>
                  <div className="text-sm text-zinc-600">{person.meals_per_day} meals/day</div>
                </div>
                {incompleteCount > 0 ? (
                  <div className="text-sm font-medium text-amber-800">
                    {incompleteCount} incomplete slot{incompleteCount === 1 ? "" : "s"}
                  </div>
                ) : (
                  <div className="text-sm font-medium text-emerald-700">All complete</div>
                )}
              </div>

              <div className="grid gap-4">
                {dates.map((date) => (
                  <div key={date} className="rounded-md border p-3">
                    <div className="text-sm font-medium">
                      {format(new Date(`${date}T00:00:00Z`), "EEE")} · {date}
                    </div>

                    <div className="mt-3 grid gap-3">
                      {slots.map((mealSlot) => {
                        const existing = meals.find(
                          (m) => m.person_id === person.id && m.date === date && m.meal_slot === mealSlot,
                        );

                        const isIncomplete =
                          !existing?.protein_recipe_id || !existing?.carb_recipe_id || !existing?.veg_recipe_id;

                        return (
                          <form
                            key={mealSlot}
                            action={setMeal}
                            className={[
                              "grid gap-2 rounded-md border p-3",
                              isIncomplete ? "border-amber-200 bg-amber-50/50" : "bg-white",
                            ].join(" ")}
                          >
                            <input type="hidden" name="plan_id" value={plan.id} />
                            <input type="hidden" name="person_id" value={person.id} />
                            <input type="hidden" name="date" value={date} />
                            <input type="hidden" name="meal_slot" value={mealSlot} />

                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium">{labelMealSlot(mealSlot)}</div>
                              {isIncomplete ? (
                                <div className="text-xs font-medium text-amber-800">Incomplete</div>
                              ) : null}
                            </div>

                            <div className="grid gap-2 sm:grid-cols-2">
                              <label className="flex flex-col gap-1 text-xs">
                                Protein
                                <select
                                  className="h-10 rounded-md border px-2 text-sm"
                                  name="protein_recipe_id"
                                  defaultValue={existing?.protein_recipe_id ?? ""}
                                >
                                  <option value="">—</option>
                                  {recipesByCategory.protein.map((r) => (
                                    <option key={r.id} value={r.id}>
                                      {r.name}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              <label className="flex flex-col gap-1 text-xs">
                                Carb
                                <select
                                  className="h-10 rounded-md border px-2 text-sm"
                                  name="carb_recipe_id"
                                  defaultValue={existing?.carb_recipe_id ?? ""}
                                >
                                  <option value="">—</option>
                                  {recipesByCategory.carb.map((r) => (
                                    <option key={r.id} value={r.id}>
                                      {r.name}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              <label className="flex flex-col gap-1 text-xs">
                                Veg
                                <select
                                  className="h-10 rounded-md border px-2 text-sm"
                                  name="veg_recipe_id"
                                  defaultValue={existing?.veg_recipe_id ?? ""}
                                >
                                  <option value="">—</option>
                                  {recipesByCategory.veg.map((r) => (
                                    <option key={r.id} value={r.id}>
                                      {r.name}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              <label className="flex flex-col gap-1 text-xs">
                                Extra (optional)
                                <select
                                  className="h-10 rounded-md border px-2 text-sm"
                                  name="extra_recipe_id"
                                  defaultValue={existing?.extra_recipe_id ?? ""}
                                >
                                  <option value="">—</option>
                                  {recipesByCategory.extra.map((r) => (
                                    <option key={r.id} value={r.id}>
                                      {r.name}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            </div>

                            <div className="flex justify-end">
                              <button
                                className="h-9 rounded-md border bg-white px-3 text-sm font-medium hover:bg-zinc-50"
                                type="submit"
                              >
                                Save
                              </button>
                            </div>
                          </form>
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
