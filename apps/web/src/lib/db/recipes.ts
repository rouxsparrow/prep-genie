import { requireUser } from "@/lib/auth/require-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { RecipeRow } from "@/lib/db/types";

export type UpsertRecipeInput = {
  version: 1;
  name: string;
  category: "protein" | "carb" | "veg" | "extra";
  nutrition_kcal_per_100g: number;
  nutrition_protein_g_per_100g: number;
  nutrition_carbs_g_per_100g: number;
  nutrition_fat_g_per_100g: number;
  yield_factor_cooked_from_raw: number;
  ingredients_g: unknown;
  steps: unknown;
  fridge_life_days: number;
  notes: string;
  raw_json: unknown;
};

export async function listRecipes(): Promise<RecipeRow[]> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("account_id", user.id)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data as RecipeRow[];
}

export async function getRecipe(id: string): Promise<RecipeRow | null> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("account_id", user.id)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as RecipeRow) ?? null;
}

export async function createRecipe(input: UpsertRecipeInput): Promise<RecipeRow> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("recipes")
    .insert({
      account_id: user.id,
      ...input,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as RecipeRow;
}

export async function updateRecipe(id: string, input: UpsertRecipeInput): Promise<RecipeRow> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("recipes")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("account_id", user.id)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as RecipeRow;
}

export async function deleteRecipe(id: string) {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("recipes").delete().eq("account_id", user.id).eq("id", id);
  if (error) throw new Error(error.message);
}

