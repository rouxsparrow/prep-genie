import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/require-user";
import type { CategoryClamps, MealCount, PersonRow } from "@/lib/db/types";

export type UpsertPersonInput = {
  name: string;
  daily_kcal: number;
  daily_protein_g: number;
  daily_carbs_g: number;
  daily_fat_g: number;
  meals_per_day: MealCount;
  clamps: CategoryClamps | null;
};

export async function listPeople(): Promise<PersonRow[]> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("people")
    .select("*")
    .eq("account_id", user.id)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data as PersonRow[];
}

export async function getPerson(id: string): Promise<PersonRow | null> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("people")
    .select("*")
    .eq("account_id", user.id)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as PersonRow) ?? null;
}

export async function createPerson(input: UpsertPersonInput): Promise<PersonRow> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("people")
    .insert({
      account_id: user.id,
      ...input,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as PersonRow;
}

export async function updatePerson(id: string, input: UpsertPersonInput): Promise<PersonRow> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("people")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("account_id", user.id)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as PersonRow;
}

export async function deletePerson(id: string) {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("people").delete().eq("account_id", user.id).eq("id", id);
  if (error) throw new Error(error.message);
}

