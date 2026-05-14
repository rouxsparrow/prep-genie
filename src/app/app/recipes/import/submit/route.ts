import { NextResponse } from "next/server";

import { z } from "zod";

import { recipeV1Schema } from "@/lib/recipes/schema";
import { requireUser } from "@/lib/auth/require-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapRecipeV1ToRowInput } from "@/lib/db/recipes";

export async function POST(request: Request) {
  const formData = await request.formData();
  const jsonText = String(formData.get("json") ?? "");

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(jsonText);
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid JSON", fieldErrors: { json: ["Invalid JSON"] } },
      { status: 400 },
    );
  }

  const parsed = z.array(recipeV1Schema).safeParse(parsedJson);
  if (!parsed.success) {
    // Improve UX: show per-item issues with index paths.
    const perItem: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = `items[${issue.path.join("][")}]`;
      perItem[key] = perItem[key] ?? [];
      perItem[key].push(issue.message);
    }

    return NextResponse.json(
      {
        ok: false,
        message: "Recipe JSON failed schema validation",
        fieldErrors: { ...parsed.error.flatten().fieldErrors, ...perItem },
      },
      { status: 400 },
    );
  }

  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const rowInputs = parsed.data.map(mapRecipeV1ToRowInput).map((r) => ({ account_id: user.id, ...r }));

  const { data, error } = await supabase
    .from("recipes")
    .upsert(rowInputs, { onConflict: "account_id,name" })
    .select("id,name");

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  const results = (data ?? []).map((r) => ({ id: r.id as string, name: r.name as string }));
  return NextResponse.json({ ok: true, results });
}
