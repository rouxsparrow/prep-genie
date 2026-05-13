import { describe, expect, test } from "vitest";

import { recipeV1Schema } from "@/lib/recipes/schema";

describe("recipeV1Schema", () => {
  test("accepts valid v1 recipe", () => {
    const input = {
      version: 1,
      name: "Chicken",
      category: "protein",
      nutrition_per_100g_cooked: { kcal: 160, protein_g: 31, carbs_g: 0, fat_g: 4 },
      yield_factor_cooked_from_raw: 0.75,
      ingredients_g: [{ name: "chicken breast", grams: 1000, is_main: true }],
      steps: ["Cook."],
      fridge_life_days: 4,
      notes: "",
    };

    expect(recipeV1Schema.safeParse(input).success).toBe(true);
  });

  test("rejects unknown keys (strict)", () => {
    const input: Record<string, unknown> = {
      version: 1,
      name: "Chicken",
      category: "protein",
      nutrition_per_100g_cooked: { kcal: 160, protein_g: 31, carbs_g: 0, fat_g: 4 },
      yield_factor_cooked_from_raw: 0.75,
      ingredients_g: [{ name: "chicken breast", grams: 1000, is_main: true }],
      steps: ["Cook."],
      fridge_life_days: 4,
      notes: "",
      extra_key: "nope",
    };

    expect(recipeV1Schema.safeParse(input).success).toBe(false);
  });
});
