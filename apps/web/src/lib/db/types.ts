export type MacroGoals = {
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

export type MealCount = 2 | 3;

export type ClampRange = {
  min_g?: number;
  max_g?: number;
};

export type Category = "protein" | "carb" | "veg" | "extra";

export type CategoryClamps = Partial<Record<Category, ClampRange>>;

export type RecipeCategory = Category;

export type PersonRow = {
  id: string;
  account_id: string;
  name: string;
  daily_kcal: number;
  daily_protein_g: number;
  daily_carbs_g: number;
  daily_fat_g: number;
  meals_per_day: MealCount;
  clamps: CategoryClamps | null;
  created_at: string;
  updated_at: string;
};

export type RecipeNutritionPer100gCooked = {
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

export type RecipeIngredientG = {
  name: string;
  grams: number;
  is_main?: boolean;
};

export type RecipeRow = {
  id: string;
  account_id: string;

  version: 1;
  name: string;
  category: RecipeCategory;

  nutrition_kcal_per_100g: number;
  nutrition_protein_g_per_100g: number;
  nutrition_carbs_g_per_100g: number;
  nutrition_fat_g_per_100g: number;

  yield_factor_cooked_from_raw: number;

  ingredients_g: RecipeIngredientG[];
  steps: string[];
  fridge_life_days: number;
  notes: string;
  raw_json: unknown;

  created_at: string;
  updated_at: string;
};
