import type { RecipeCategory, RecipeRow } from "@/lib/db/types";

function toNumber(value: FormDataEntryValue | null, fallback: number) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function requireString(value: FormDataEntryValue | null, fieldName: string) {
  const str = String(value ?? "").trim();
  if (!str) throw new Error(`${fieldName} required`);
  return str;
}

function parseJson(value: FormDataEntryValue | null, fieldName: string) {
  const str = String(value ?? "").trim();
  if (!str) throw new Error(`${fieldName} required`);
  try {
    return JSON.parse(str);
  } catch {
    throw new Error(`${fieldName} must be valid JSON`);
  }
}

export type RecipeFormParsed = {
  version: 1;
  name: string;
  category: RecipeCategory;
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

export function parseRecipeForm(formData: FormData): RecipeFormParsed {
  const category = String(formData.get("category") ?? "") as RecipeCategory;
  if (!["protein", "carb", "veg", "extra"].includes(category)) {
    throw new Error("Category invalid");
  }

  const ingredients = parseJson(formData.get("ingredients_g_json"), "Ingredients JSON");
  const steps = parseJson(formData.get("steps_json"), "Steps JSON");

  const recipeJson = {
    version: 1,
    name: requireString(formData.get("name"), "Name"),
    category,
    nutrition_per_100g_cooked: {
      kcal: toNumber(formData.get("nutrition_kcal_per_100g"), 0),
      protein_g: toNumber(formData.get("nutrition_protein_g_per_100g"), 0),
      carbs_g: toNumber(formData.get("nutrition_carbs_g_per_100g"), 0),
      fat_g: toNumber(formData.get("nutrition_fat_g_per_100g"), 0),
    },
    yield_factor_cooked_from_raw: toNumber(formData.get("yield_factor_cooked_from_raw"), 1),
    ingredients_g: ingredients,
    steps,
    fridge_life_days: Math.max(0, Math.round(toNumber(formData.get("fridge_life_days"), 0))),
    notes: String(formData.get("notes") ?? ""),
  };

  return {
    version: 1,
    name: recipeJson.name,
    category,
    nutrition_kcal_per_100g: recipeJson.nutrition_per_100g_cooked.kcal,
    nutrition_protein_g_per_100g: recipeJson.nutrition_per_100g_cooked.protein_g,
    nutrition_carbs_g_per_100g: recipeJson.nutrition_per_100g_cooked.carbs_g,
    nutrition_fat_g_per_100g: recipeJson.nutrition_per_100g_cooked.fat_g,
    yield_factor_cooked_from_raw: recipeJson.yield_factor_cooked_from_raw,
    ingredients_g: ingredients,
    steps,
    fridge_life_days: recipeJson.fridge_life_days,
    notes: recipeJson.notes,
    raw_json: recipeJson,
  };
}

export default function RecipeForm({
  recipe,
  action,
  submitLabel,
}: {
  recipe?: RecipeRow | null;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}) {
  return (
    <form className="space-y-6" action={action}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-sm font-medium">Name</span>
          <input className="h-11 rounded-md border px-3" name="name" defaultValue={recipe?.name ?? ""} required />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Category</span>
          <select className="h-11 rounded-md border px-3" name="category" defaultValue={recipe?.category ?? "protein"}>
            <option value="protein">protein</option>
            <option value="carb">carb</option>
            <option value="veg">veg</option>
            <option value="extra">extra</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Yield factor cooked from raw</span>
          <input
            className="h-11 rounded-md border px-3"
            type="number"
            step="0.01"
            min="0"
            name="yield_factor_cooked_from_raw"
            defaultValue={recipe?.yield_factor_cooked_from_raw ?? 1}
            required
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">kcal / 100g cooked</span>
          <input
            className="h-11 rounded-md border px-3"
            type="number"
            step="0.01"
            min="0"
            name="nutrition_kcal_per_100g"
            defaultValue={recipe?.nutrition_kcal_per_100g ?? 0}
            required
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">protein g / 100g cooked</span>
          <input
            className="h-11 rounded-md border px-3"
            type="number"
            step="0.01"
            min="0"
            name="nutrition_protein_g_per_100g"
            defaultValue={recipe?.nutrition_protein_g_per_100g ?? 0}
            required
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">carbs g / 100g cooked</span>
          <input
            className="h-11 rounded-md border px-3"
            type="number"
            step="0.01"
            min="0"
            name="nutrition_carbs_g_per_100g"
            defaultValue={recipe?.nutrition_carbs_g_per_100g ?? 0}
            required
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">fat g / 100g cooked</span>
          <input
            className="h-11 rounded-md border px-3"
            type="number"
            step="0.01"
            min="0"
            name="nutrition_fat_g_per_100g"
            defaultValue={recipe?.nutrition_fat_g_per_100g ?? 0}
            required
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Fridge life (days)</span>
          <input
            className="h-11 rounded-md border px-3"
            type="number"
            step="1"
            min="0"
            name="fridge_life_days"
            defaultValue={recipe?.fridge_life_days ?? 0}
            required
          />
        </label>
        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-sm font-medium">Notes</span>
          <textarea className="min-h-24 rounded-md border px-3 py-2" name="notes" defaultValue={recipe?.notes ?? ""} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Ingredients JSON</span>
          <textarea
            className="min-h-56 rounded-md border px-3 py-2 font-mono text-xs"
            name="ingredients_g_json"
            defaultValue={JSON.stringify(recipe?.ingredients_g ?? [], null, 2)}
            required
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Steps JSON</span>
          <textarea
            className="min-h-56 rounded-md border px-3 py-2 font-mono text-xs"
            name="steps_json"
            defaultValue={JSON.stringify(recipe?.steps ?? [], null, 2)}
            required
          />
        </label>
      </div>

      <button className="h-11 rounded-md bg-zinc-900 px-4 font-medium text-white" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}

