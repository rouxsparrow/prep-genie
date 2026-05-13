import Link from "next/link";

import { format } from "date-fns";

import PortionsClient from "./portions-client";

import { listPeople } from "@/lib/db/people";
import { listRecipes } from "@/lib/db/recipes";
import { getOrCreateWeeklyPlan, listPlanMeals, publishWeeklyPlan, replacePlanPortions } from "@/lib/db/plans";
import { toWeekStartDateISO, weekDatesFromStart } from "@/lib/date/week";
import { macrosForRecipe, solveSlot, getSlotRatios, type ManualOverrides } from "@/lib/solver/solver";

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
  const dates = weekDatesFromStart(weekStart);

  async function publish(formData: FormData) {
    "use server";

    const week = String(formData.get("week_start") ?? "");
    const weekStartDate = toWeekStartDateISO(new Date(`${week}T00:00:00Z`));

    const overridesJson = String(formData.get("overrides_json") ?? "");
    const overrides = overridesJson ? (JSON.parse(overridesJson) as Record<string, ManualOverrides>) : {};

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

      const activeSlots = (Object.keys(ratios) as (keyof typeof ratios)[]).filter((s) => ratios[s] > 0);

      for (const date of dateRows) {
        for (const slot of activeSlots) {
          const meal = mealRows.find((m) => m.person_id === person.id && m.date === date && m.meal_slot === slot);
          const overrideKey = `${person.id}|${date}|${slot}`;

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
            manualOverrides: overrides[overrideKey],
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
            Week (Mon–Sun): {weekStart} ·{" "}
            <Link className="underline" href={`/app/planner?week=${weekStart}`}>
              Back to planner
            </Link>
          </p>
        </div>
      </div>

      <PortionsClient
        weekStart={weekStart}
        planStatus={plan.status}
        people={people}
        recipes={recipes}
        meals={meals}
        dates={dates}
        publishAction={publish}
      />
    </div>
  );
}

