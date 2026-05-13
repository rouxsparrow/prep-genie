import { requireUser } from "@/lib/auth/require-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type WeeklyPlanStatus = "draft" | "published";

export type WeeklyPlanRow = {
  id: string;
  account_id: string;
  week_start_date: string;
  status: WeeklyPlanStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type MealSlot = "breakfast" | "lunch" | "dinner";

export type PlanMealRow = {
  id: string;
  account_id: string;
  plan_id: string;
  person_id: string;
  date: string;
  meal_slot: MealSlot;
  protein_recipe_id: string | null;
  carb_recipe_id: string | null;
  veg_recipe_id: string | null;
  extra_recipe_id: string | null;
  created_at: string;
  updated_at: string;
};

export type PlanPortionRow = {
  id: string;
  account_id: string;
  plan_id: string;
  person_id: string;
  date: string;
  meal_slot: MealSlot;
  category: "protein" | "carb" | "veg" | "extra";
  grams_cooked: number;
  is_manual: boolean;
  clamp_applied: boolean;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  created_at: string;
  updated_at: string;
};

export async function getOrCreateWeeklyPlan(weekStartDate: string): Promise<WeeklyPlanRow> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data: existing, error: existingError } = await supabase
    .from("weekly_plans")
    .select("*")
    .eq("account_id", user.id)
    .eq("week_start_date", weekStartDate)
    .maybeSingle();

  if (existingError) throw new Error(existingError.message);
  if (existing) return existing as WeeklyPlanRow;

  const { data: created, error: createError } = await supabase
    .from("weekly_plans")
    .insert({ account_id: user.id, week_start_date: weekStartDate, status: "draft" })
    .select("*")
    .single();

  if (createError) throw new Error(createError.message);
  return created as WeeklyPlanRow;
}

export async function listPlanMeals(planId: string): Promise<PlanMealRow[]> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("plan_meals")
    .select("*")
    .eq("account_id", user.id)
    .eq("plan_id", planId);

  if (error) throw new Error(error.message);
  return data as PlanMealRow[];
}

export async function upsertPlanMeal(input: Omit<PlanMealRow, "id" | "account_id" | "created_at" | "updated_at">) {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("plan_meals")
    .upsert(
      {
        ...input,
        account_id: user.id,
      },
      { onConflict: "plan_id,person_id,date,meal_slot" },
    )
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as PlanMealRow;
}

export async function publishWeeklyPlan(planId: string) {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("weekly_plans")
    .update({ status: "published", published_at: now, updated_at: now })
    .eq("account_id", user.id)
    .eq("id", planId)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as WeeklyPlanRow;
}

export async function replacePlanPortions(
  planId: string,
  portions: Omit<PlanPortionRow, "id" | "account_id" | "created_at" | "updated_at">[],
) {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { error: deleteError } = await supabase
    .from("plan_portions")
    .delete()
    .eq("account_id", user.id)
    .eq("plan_id", planId);
  if (deleteError) throw new Error(deleteError.message);

  if (portions.length === 0) return;

  const now = new Date().toISOString();
  const { error: insertError } = await supabase.from("plan_portions").insert(
    portions.map((p) => ({
      ...p,
      account_id: user.id,
      created_at: now,
      updated_at: now,
    })),
  );
  if (insertError) throw new Error(insertError.message);
}

export async function listPlanPortions(planId: string): Promise<PlanPortionRow[]> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("plan_portions")
    .select("*")
    .eq("account_id", user.id)
    .eq("plan_id", planId);

  if (error) throw new Error(error.message);
  return data as PlanPortionRow[];
}
