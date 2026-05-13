import type { RecipeRow } from "@/lib/db/types";

export type ShoppingLine = {
  key: string;
  name: string;
  grams: number;
  store_category?: string;
};

export type ShoppingGroup = {
  groupKey: string;
  lines: ShoppingLine[];
};

function normalizeIngredientKey(name: string) {
  return name.trim().toLowerCase();
}

export function computeIngredientsForCookedGrams({
  recipe,
  cookedGrams,
}: {
  recipe: RecipeRow;
  cookedGrams: number;
}): Array<{ name: string; grams: number; is_main?: boolean }> {
  if (!Number.isFinite(cookedGrams) || cookedGrams <= 0) return [];

  const mainIngredients = recipe.ingredients_g.filter((i) => i.is_main);
  const totalMainRaw = mainIngredients.reduce((sum, i) => sum + (Number(i.grams) || 0), 0);

  const rawMainNeeded =
    recipe.yield_factor_cooked_from_raw > 0
      ? cookedGrams / recipe.yield_factor_cooked_from_raw
      : cookedGrams;

  const scale = totalMainRaw > 0 ? rawMainNeeded / totalMainRaw : cookedGrams / 100;

  return recipe.ingredients_g.map((i) => ({
    name: i.name,
    grams: (Number(i.grams) || 0) * scale,
    is_main: i.is_main,
  }));
}

export function buildShoppingList({
  recipeById,
  recipeCookedGrams,
}: {
  recipeById: Map<string, RecipeRow>;
  recipeCookedGrams: Array<{ recipeId: string; cookedGrams: number }>;
}): ShoppingLine[] {
  const totals = new Map<string, ShoppingLine>();

  for (const { recipeId, cookedGrams } of recipeCookedGrams) {
    const recipe = recipeById.get(recipeId);
    if (!recipe) continue;

    const ingredients = computeIngredientsForCookedGrams({ recipe, cookedGrams });
    for (const ing of ingredients) {
      const key = normalizeIngredientKey(ing.name);
      const existing = totals.get(key);
      const nextGrams = (existing?.grams ?? 0) + ing.grams;
      totals.set(key, { key, name: ing.name, grams: nextGrams });
    }
  }

  return Array.from(totals.values()).sort((a, b) => a.key.localeCompare(b.key));
}
