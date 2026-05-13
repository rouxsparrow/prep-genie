import { z } from "zod";

const nutritionPer100gCookedSchema = z
  .object({
    kcal: z.number(),
    protein_g: z.number(),
    carbs_g: z.number(),
    fat_g: z.number(),
  })
  .strict();

const ingredientSchema = z
  .object({
    name: z.string().min(1),
    grams: z.number(),
    is_main: z.boolean().optional(),
  })
  .strict();

export const recipeV1Schema = z
  .object({
    version: z.literal(1),
    name: z.string().min(1),
    category: z.enum(["protein", "carb", "veg", "extra"]),
    nutrition_per_100g_cooked: nutritionPer100gCookedSchema,
    yield_factor_cooked_from_raw: z.number(),
    ingredients_g: z.array(ingredientSchema),
    steps: z.array(z.string()),
    fridge_life_days: z.number().int(),
    notes: z.string(),
  })
  .strict();

export type RecipeV1 = z.infer<typeof recipeV1Schema>;

