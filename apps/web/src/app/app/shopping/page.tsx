import Link from "next/link";
import { redirect } from "next/navigation";

import { format } from "date-fns";

import { listPeople } from "@/lib/db/people";
import { listRecipes } from "@/lib/db/recipes";
import { getOrCreateWeeklyPlan, listPlanMeals, listPlanPortions, type MealSlot } from "@/lib/db/plans";
import { toWeekStartDateISO, weekDatesFromStart } from "@/lib/date/week";
import { buildShoppingList } from "@/lib/shopping/shopping";
import { getSlotRatios, solveSlot } from "@/lib/solver/solver";

export default async function ShoppingPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string; source?: string; group?: string }>;
}) {
  const params = await searchParams;
  const rawWeek =
    params.week && /^\d{4}-\d{2}-\d{2}$/.test(params.week) ? params.week : format(new Date(), "yyyy-MM-dd");
  const weekStart = toWeekStartDateISO(new Date(`${rawWeek}T00:00:00Z`));

  const requestedSource = params.source === "published" ? "published" : "draft";
  const group = params.group === "store" ? "store" : "ingredient";

  const plan = await getOrCreateWeeklyPlan(weekStart);
  const [people, recipes, meals] = await Promise.all([listPeople(), listRecipes(), listPlanMeals(plan.id)]);
  const source =
    requestedSource === "published" && plan.status === "published" ? "published" : "draft";
  const portions = source === "published" ? await listPlanPortions(plan.id) : [];

  const recipeById = new Map(recipes.map((r) => [r.id, r]));
  const dates = weekDatesFromStart(weekStart);

  const recipeCookedGrams: Array<{ recipeId: string; cookedGrams: number }> = [];

  for (const person of people) {
    const ratios = getSlotRatios(person.meals_per_day);
    const dailyTargets = {
      kcal: person.daily_kcal,
      protein_g: person.daily_protein_g,
      carbs_g: person.daily_carbs_g,
      fat_g: person.daily_fat_g,
    };
    const activeSlots = (Object.keys(ratios) as MealSlot[]).filter((s) => ratios[s] > 0);

    for (const date of dates) {
      for (const slot of activeSlots) {
        const meal = meals.find((m) => m.person_id === person.id && m.date === date && m.meal_slot === slot);
        if (!meal) continue;

        const selection = {
          protein: meal.protein_recipe_id ? (recipeById.get(meal.protein_recipe_id) ?? null) : null,
          carb: meal.carb_recipe_id ? (recipeById.get(meal.carb_recipe_id) ?? null) : null,
          veg: meal.veg_recipe_id ? (recipeById.get(meal.veg_recipe_id) ?? null) : null,
          extra: meal.extra_recipe_id ? (recipeById.get(meal.extra_recipe_id) ?? null) : null,
        };

        const gramsByCat =
          source === "published"
            ? {
                protein: {
                  grams_cooked:
                    portions.find(
                      (p) =>
                        p.person_id === person.id &&
                        p.date === date &&
                        p.meal_slot === slot &&
                        p.category === "protein",
                    )?.grams_cooked ?? 0,
                },
                carb: {
                  grams_cooked:
                    portions.find(
                      (p) =>
                        p.person_id === person.id &&
                        p.date === date &&
                        p.meal_slot === slot &&
                        p.category === "carb",
                    )?.grams_cooked ?? 0,
                },
                veg: {
                  grams_cooked:
                    portions.find(
                      (p) =>
                        p.person_id === person.id &&
                        p.date === date &&
                        p.meal_slot === slot &&
                        p.category === "veg",
                    )?.grams_cooked ?? 0,
                },
                extra: {
                  grams_cooked:
                    portions.find(
                      (p) =>
                        p.person_id === person.id &&
                        p.date === date &&
                        p.meal_slot === slot &&
                        p.category === "extra",
                    )?.grams_cooked ?? 0,
                },
              }
            : solveSlot({
                slotRatio: ratios[slot],
                dailyTargets,
                clamps: person.clamps,
                selection,
              }).portions;

        if (meal.protein_recipe_id && gramsByCat.protein.grams_cooked > 0) {
          recipeCookedGrams.push({ recipeId: meal.protein_recipe_id, cookedGrams: gramsByCat.protein.grams_cooked });
        }
        if (meal.carb_recipe_id && gramsByCat.carb.grams_cooked > 0) {
          recipeCookedGrams.push({ recipeId: meal.carb_recipe_id, cookedGrams: gramsByCat.carb.grams_cooked });
        }
        if (meal.veg_recipe_id && gramsByCat.veg.grams_cooked > 0) {
          recipeCookedGrams.push({ recipeId: meal.veg_recipe_id, cookedGrams: gramsByCat.veg.grams_cooked });
        }
        if (meal.extra_recipe_id && gramsByCat.extra.grams_cooked > 0) {
          recipeCookedGrams.push({ recipeId: meal.extra_recipe_id, cookedGrams: gramsByCat.extra.grams_cooked });
        }
      }
    }
  }

  const lines = buildShoppingList({ recipeById, recipeCookedGrams });
  const groups =
    group === "ingredient"
      ? [{ title: "Ingredients", lines }]
      : Array.from(
          lines.reduce((acc, line) => {
            const key = line.store_category ?? "Other";
            const existing = acc.get(key) ?? [];
            existing.push(line);
            acc.set(key, existing);
            return acc;
          }, new Map<string, typeof lines>()),
        )
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([title, groupedLines]) => ({ title, lines: groupedLines }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Shopping list</h1>
          <p className="text-sm text-zinc-600">
            Week (Mon–Sun): {weekStart} · <Link className="underline" href={`/app/planner?week=${weekStart}`}>Planner</Link>
          </p>
        </div>
        <form
          action={async (formData) => {
            "use server";
            const week = String(formData.get("week") ?? "");
            const src = String(formData.get("source") ?? "draft");
            const grp = String(formData.get("group") ?? "ingredient");
            const ws = toWeekStartDateISO(new Date(`${week}T00:00:00Z`));
            redirect(`/app/shopping?week=${ws}&source=${src}&group=${grp}`);
          }}
          className="flex flex-wrap items-end gap-2"
        >
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs text-zinc-600">Week</span>
            <input type="date" name="week" defaultValue={rawWeek} className="h-10 rounded-md border px-3" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs text-zinc-600">Source</span>
            <select name="source" defaultValue={requestedSource} className="h-10 rounded-md border px-3">
              <option value="draft">Draft (computed)</option>
              <option value="published">Published snapshot</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs text-zinc-600">Group</span>
            <select name="group" defaultValue={group} className="h-10 rounded-md border px-3">
              <option value="ingredient">By ingredient</option>
              <option value="store">By store category</option>
            </select>
          </label>
          <button className="h-10 rounded-md border bg-white px-3 text-sm font-medium" type="submit">
            Refresh
          </button>
        </form>
      </div>

      {requestedSource === "published" && plan.status !== "published" ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          No published snapshot for this week. Showing draft computed list.
        </div>
      ) : null}
      {source === "draft" ? (
        <div className="rounded-md border bg-white p-3 text-sm text-zinc-700">
          Draft mode: shopping list computed from current draft plan and may change as you edit recipes/goals.
        </div>
      ) : null}

      {groups.map((g) => (
        <section key={g.title} className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 text-sm font-medium">{g.title}</div>
          {g.lines.length === 0 ? (
            <div className="p-6 text-sm text-zinc-700">Nothing yet. Add recipes to planner and publish or compute draft.</div>
          ) : (
            <div className="divide-y">
              {g.lines.map((line) => (
                <div key={line.key} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div>{line.name}</div>
                  <div className="font-mono">{Math.round(line.grams)}g</div>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
