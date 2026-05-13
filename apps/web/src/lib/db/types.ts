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

