import { describe, expect, test } from "vitest";

import { solveSlot } from "@/lib/solver/solver";

const proteinRecipe = {
  id: "p",
  account_id: "a",
  version: 1 as const,
  name: "Protein",
  category: "protein" as const,
  nutrition_kcal_per_100g: 160,
  nutrition_protein_g_per_100g: 31,
  nutrition_carbs_g_per_100g: 0,
  nutrition_fat_g_per_100g: 4,
  yield_factor_cooked_from_raw: 0.75,
  ingredients_g: [],
  steps: [],
  fridge_life_days: 4,
  notes: "",
  raw_json: {},
  created_at: "",
  updated_at: "",
};

const carbRecipe = {
  ...proteinRecipe,
  id: "c",
  name: "Carb",
  category: "carb" as const,
  nutrition_kcal_per_100g: 130,
  nutrition_protein_g_per_100g: 2,
  nutrition_carbs_g_per_100g: 28,
  nutrition_fat_g_per_100g: 1,
};

const vegRecipe = {
  ...proteinRecipe,
  id: "v",
  name: "Veg",
  category: "veg" as const,
  nutrition_kcal_per_100g: 35,
  nutrition_protein_g_per_100g: 2,
  nutrition_carbs_g_per_100g: 7,
  nutrition_fat_g_per_100g: 0,
};

describe("solveSlot", () => {
  test("rounds grams to nearest 5g", () => {
    const result = solveSlot({
      slotRatio: 0.5,
      dailyTargets: { kcal: 2000, protein_g: 151, carbs_g: 201, fat_g: 60 },
      clamps: null,
      selection: { protein: proteinRecipe, carb: carbRecipe, veg: vegRecipe, extra: null },
    });

    expect(result.portions.protein.grams_cooked % 5).toBe(0);
    expect(result.portions.carb.grams_cooked % 5).toBe(0);
    expect(result.portions.veg.grams_cooked % 5).toBe(0);
  });

  test("applies clamps", () => {
    const result = solveSlot({
      slotRatio: 0.5,
      dailyTargets: { kcal: 2000, protein_g: 200, carbs_g: 200, fat_g: 60 },
      clamps: { protein: { max_g: 100 } },
      selection: { protein: proteinRecipe, carb: carbRecipe, veg: vegRecipe, extra: null },
    });

    expect(result.portions.protein.grams_cooked).toBeLessThanOrEqual(100);
    expect(result.portions.protein.clamp_applied).toBe(true);
  });

  test("manual override marks is_manual and persists grams", () => {
    const result = solveSlot({
      slotRatio: 0.5,
      dailyTargets: { kcal: 2000, protein_g: 200, carbs_g: 200, fat_g: 60 },
      clamps: null,
      selection: { protein: proteinRecipe, carb: carbRecipe, veg: vegRecipe, extra: null },
      manualOverrides: { protein: 123 },
    });

    expect(result.portions.protein.is_manual).toBe(true);
    expect(result.portions.protein.grams_cooked).toBe(125);
  });
});

