import { NextResponse } from "next/server";

export async function GET() {
  const template = [
    {
      version: 1,
      name: "Chicken Breast Sous Vide",
      category: "protein",
      nutrition_per_100g_cooked: {
        kcal: 160,
        protein_g: 31,
        carbs_g: 0,
        fat_g: 4,
      },
      yield_factor_cooked_from_raw: 0.75,
      ingredients_g: [
        { name: "chicken breast", grams: 1000, is_main: true },
        { name: "salt", grams: 10 },
        { name: "garlic powder", grams: 5 },
      ],
      steps: ["Season chicken.", "Sous vide at 64C for 2 hours.", "Ice bath, then sear."],
      fridge_life_days: 4,
      notes: "Good for lunch/dinner bowls.",
    },
  ];

  return new NextResponse(JSON.stringify(template, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": 'attachment; filename="prep-genie-recipe-template.v1.json"',
    },
  });
}

