import { NextResponse } from "next/server";

import { recipeV1Schema } from "@/lib/recipes/schema";
import { createRecipe, mapRecipeV1ToRowInput } from "@/lib/db/recipes";

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

  const parsed = recipeV1Schema.safeParse(parsedJson);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Recipe JSON failed schema validation",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const created = await createRecipe(mapRecipeV1ToRowInput(parsed.data));

  return NextResponse.json({ ok: true, recipeId: created.id });
}

