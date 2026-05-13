import type { Category, CategoryClamps, MacroGoals, MealCount, RecipeRow } from "@/lib/db/types";

export type MealSlot = "breakfast" | "lunch" | "dinner";

export type SlotRatios = Record<MealSlot, number>;

export type SlotSelection = Partial<Record<Category, RecipeRow | null>>;

export type SlotPortions = Record<Category, { grams_cooked: number; is_manual: boolean; clamp_applied: boolean }>;

export type SlotMacros = MacroGoals;

export type SlotSolveResult = {
  incomplete: boolean;
  portions: SlotPortions;
  macros: SlotMacros;
  target: SlotMacros;
};

export type ManualOverrides = Partial<Record<Category, number>>;

export const COVERAGE = 0.8;

export function getSlotRatios(mealsPerDay: MealCount): SlotRatios {
  if (mealsPerDay === 2) return { breakfast: 0.5, lunch: 0.5, dinner: 0 };
  return { breakfast: 0.2, lunch: 0.4, dinner: 0.4 };
}

export function roundToNearest5g(grams: number): number {
  if (!Number.isFinite(grams)) return 0;
  return Math.max(0, Math.round(grams / 5) * 5);
}

function clampGrams(category: Category, grams: number, clamps: CategoryClamps | null | undefined) {
  const range = clamps?.[category];
  if (!range) return { grams, clampApplied: false };

  let out = grams;
  let applied = false;
  if (range.min_g !== undefined && out < range.min_g) {
    out = range.min_g;
    applied = true;
  }
  if (range.max_g !== undefined && out > range.max_g) {
    out = range.max_g;
    applied = true;
  }
  return { grams: out, clampApplied: applied };
}

function macrosFor(recipe: RecipeRow, gramsCooked: number): SlotMacros {
  const factor = gramsCooked / 100;
  return {
    kcal: recipe.nutrition_kcal_per_100g * factor,
    protein_g: recipe.nutrition_protein_g_per_100g * factor,
    carbs_g: recipe.nutrition_carbs_g_per_100g * factor,
    fat_g: recipe.nutrition_fat_g_per_100g * factor,
  };
}

function addMacros(a: SlotMacros, b: SlotMacros): SlotMacros {
  return {
    kcal: a.kcal + b.kcal,
    protein_g: a.protein_g + b.protein_g,
    carbs_g: a.carbs_g + b.carbs_g,
    fat_g: a.fat_g + b.fat_g,
  };
}

export function solveSlot({
  slotRatio,
  dailyTargets,
  clamps,
  selection,
  manualOverrides,
}: {
  slotRatio: number;
  dailyTargets: MacroGoals;
  clamps: CategoryClamps | null;
  selection: SlotSelection;
  manualOverrides?: ManualOverrides;
}): SlotSolveResult {
  const target: SlotMacros = {
    kcal: dailyTargets.kcal * COVERAGE * slotRatio,
    protein_g: dailyTargets.protein_g * COVERAGE * slotRatio,
    carbs_g: dailyTargets.carbs_g * COVERAGE * slotRatio,
    fat_g: dailyTargets.fat_g * COVERAGE * slotRatio,
  };

  const portions: SlotPortions = {
    protein: { grams_cooked: 0, is_manual: false, clamp_applied: false },
    carb: { grams_cooked: 0, is_manual: false, clamp_applied: false },
    veg: { grams_cooked: 0, is_manual: false, clamp_applied: false },
    extra: { grams_cooked: 0, is_manual: false, clamp_applied: false },
  };

  const proteinRecipe = selection.protein ?? null;
  const carbRecipe = selection.carb ?? null;
  const vegRecipe = selection.veg ?? null;
  const extraRecipe = selection.extra ?? null;

  const incomplete = !proteinRecipe || !carbRecipe || !vegRecipe;

  // Protein grams -> protein target.
  if (proteinRecipe) {
    const per100 = proteinRecipe.nutrition_protein_g_per_100g;
    const grams = per100 > 0 ? (target.protein_g / per100) * 100 : 0;
    const rounded = roundToNearest5g(grams);
    const clamped = clampGrams("protein", rounded, clamps);
    portions.protein.grams_cooked = clamped.grams;
    portions.protein.clamp_applied = clamped.clampApplied;
  }

  // Carb grams -> carbs target.
  if (carbRecipe) {
    const per100 = carbRecipe.nutrition_carbs_g_per_100g;
    const grams = per100 > 0 ? (target.carbs_g / per100) * 100 : 0;
    const rounded = roundToNearest5g(grams);
    const clamped = clampGrams("carb", rounded, clamps);
    portions.carb.grams_cooked = clamped.grams;
    portions.carb.clamp_applied = clamped.clampApplied;
  }

  // Extra default 0, unless manual override sets it.
  if (extraRecipe && manualOverrides?.extra !== undefined) {
    const rounded = roundToNearest5g(manualOverrides.extra);
    const clamped = clampGrams("extra", rounded, clamps);
    portions.extra.grams_cooked = clamped.grams;
    portions.extra.is_manual = true;
    portions.extra.clamp_applied = clamped.clampApplied;
  }

  // Manual overrides for protein/carb/veg.
  for (const cat of ["protein", "carb", "veg"] as const) {
    const manual = manualOverrides?.[cat];
    if (manual === undefined) continue;
    const rounded = roundToNearest5g(manual);
    const clamped = clampGrams(cat, rounded, clamps);
    portions[cat].grams_cooked = clamped.grams;
    portions[cat].is_manual = true;
    portions[cat].clamp_applied = clamped.clampApplied;
  }

  // If user manually changed protein or carb or veg: rebalance carb + veg only.
  // Simplified MVP: if protein manual set, keep protein fixed; compute carb from target if not manual; veg fills kcal.
  // If carb manual set, keep carb fixed; veg fills remaining kcal.
  if (vegRecipe) {
    const proteinMacros = proteinRecipe ? macrosFor(proteinRecipe, portions.protein.grams_cooked) : undefined;
    const carbMacros = carbRecipe ? macrosFor(carbRecipe, portions.carb.grams_cooked) : undefined;
    const extraMacros = extraRecipe ? macrosFor(extraRecipe, portions.extra.grams_cooked) : undefined;

    let current: SlotMacros = { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 };
    if (proteinMacros) current = addMacros(current, proteinMacros);
    if (carbMacros) current = addMacros(current, carbMacros);
    if (extraMacros) current = addMacros(current, extraMacros);

    const remainingKcal = Math.max(0, target.kcal - current.kcal);
    const vegPer100Kcal = vegRecipe.nutrition_kcal_per_100g;
    const vegGrams = vegPer100Kcal > 0 ? (remainingKcal / vegPer100Kcal) * 100 : 0;
    const roundedVeg = roundToNearest5g(vegGrams);
    const clampedVeg = clampGrams("veg", roundedVeg, clamps);
    portions.veg.grams_cooked = clampedVeg.grams;
    portions.veg.clamp_applied = clampedVeg.clampApplied;
  }

  // Compute achieved macros.
  let macros: SlotMacros = { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 };
  if (proteinRecipe) macros = addMacros(macros, macrosFor(proteinRecipe, portions.protein.grams_cooked));
  if (carbRecipe) macros = addMacros(macros, macrosFor(carbRecipe, portions.carb.grams_cooked));
  if (vegRecipe) macros = addMacros(macros, macrosFor(vegRecipe, portions.veg.grams_cooked));
  if (extraRecipe) macros = addMacros(macros, macrosFor(extraRecipe, portions.extra.grams_cooked));

  return { incomplete, portions, macros, target };
}

export function withinTolerance({ value, target, plusMinusPct }: { value: number; target: number; plusMinusPct: number }) {
  const low = target * (1 - plusMinusPct);
  const high = target * (1 + plusMinusPct);
  return value >= low && value <= high;
}
