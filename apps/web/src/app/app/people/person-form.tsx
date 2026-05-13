import type { Category, CategoryClamps, MealCount, PersonRow } from "@/lib/db/types";

function toInt(value: FormDataEntryValue | null, fallback: number) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(0, Math.round(num));
}

function toMealCount(value: FormDataEntryValue | null, fallback: MealCount): MealCount {
  const num = Number(value);
  return num === 2 || num === 3 ? (num as MealCount) : fallback;
}

function parseClamps(formData: FormData): CategoryClamps | null {
  const categories: Category[] = ["protein", "carb", "veg", "extra"];
  const clamps: CategoryClamps = {};

  for (const cat of categories) {
    const minVal = formData.get(`clamp_${cat}_min`);
    const maxVal = formData.get(`clamp_${cat}_max`);

    const minNum = minVal === null || String(minVal).trim() === "" ? undefined : toInt(minVal, 0);
    const maxNum = maxVal === null || String(maxVal).trim() === "" ? undefined : toInt(maxVal, 0);

    if (minNum !== undefined || maxNum !== undefined) {
      clamps[cat] = {};
      if (minNum !== undefined) clamps[cat]!.min_g = minNum;
      if (maxNum !== undefined) clamps[cat]!.max_g = maxNum;
    }
  }

  return Object.keys(clamps).length === 0 ? null : clamps;
}

export type PersonFormParsed = {
  name: string;
  daily_kcal: number;
  daily_protein_g: number;
  daily_carbs_g: number;
  daily_fat_g: number;
  meals_per_day: MealCount;
  clamps: CategoryClamps | null;
};

export function parsePersonForm(formData: FormData, fallbackMealsPerDay: MealCount): PersonFormParsed {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Name required");

  return {
    name,
    daily_kcal: toInt(formData.get("daily_kcal"), 2000),
    daily_protein_g: toInt(formData.get("daily_protein_g"), 150),
    daily_carbs_g: toInt(formData.get("daily_carbs_g"), 200),
    daily_fat_g: toInt(formData.get("daily_fat_g"), 60),
    meals_per_day: toMealCount(formData.get("meals_per_day"), fallbackMealsPerDay),
    clamps: parseClamps(formData),
  };
}

export default function PersonForm({
  person,
  action,
  submitLabel,
}: {
  person?: PersonRow | null;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}) {
  const mealsPerDay = person?.meals_per_day ?? 3;
  const clamps = person?.clamps ?? null;

  const mealRatio =
    mealsPerDay === 2
      ? { breakfast: "50%", lunch: "50%" }
      : { breakfast: "20%", lunch: "40%", dinner: "40%" };

  return (
    <form className="space-y-6" action={action}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Name</span>
          <input className="h-11 rounded-md border px-3" name="name" defaultValue={person?.name ?? ""} required />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Meals per day</span>
          <select className="h-11 rounded-md border px-3" name="meals_per_day" defaultValue={mealsPerDay}>
            <option value={2}>2 meals (50/50)</option>
            <option value={3}>3 meals (20/40/40)</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Daily kcal</span>
          <input className="h-11 rounded-md border px-3" type="number" min={1} name="daily_kcal" defaultValue={person?.daily_kcal ?? 2000} required />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Protein (g)</span>
          <input className="h-11 rounded-md border px-3" type="number" min={0} name="daily_protein_g" defaultValue={person?.daily_protein_g ?? 150} required />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Carbs (g)</span>
          <input className="h-11 rounded-md border px-3" type="number" min={0} name="daily_carbs_g" defaultValue={person?.daily_carbs_g ?? 200} required />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Fat (g)</span>
          <input className="h-11 rounded-md border px-3" type="number" min={0} name="daily_fat_g" defaultValue={person?.daily_fat_g ?? 60} required />
        </label>
      </div>

      <div className="rounded-lg border bg-white p-4 text-sm text-zinc-700">
        <div className="font-medium">Fixed rules (MVP)</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Coverage: 80% of daily goals across all meals</li>
          <li>Rounding: nearest 5g</li>
          <li>
            Slot ratios:{" "}
            {Object.entries(mealRatio)
              .map(([k, v]) => `${k} ${v}`)
              .join(", ")}
          </li>
        </ul>
      </div>

      <div className="space-y-3 rounded-lg border bg-white p-4">
        <div>
          <div className="text-sm font-medium">Clamps (optional)</div>
          <p className="text-sm text-zinc-600">Limit grams per category when solver rebalances.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {(["protein", "carb", "veg", "extra"] as const).map((cat) => (
            <div key={cat} className="rounded-md border p-3">
              <div className="text-sm font-medium capitalize">{cat}</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1 text-xs">
                  Min (g)
                  <input
                    className="h-9 rounded-md border px-2 text-sm"
                    type="number"
                    min={0}
                    name={`clamp_${cat}_min`}
                    defaultValue={clamps?.[cat]?.min_g ?? ""}
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs">
                  Max (g)
                  <input
                    className="h-9 rounded-md border px-2 text-sm"
                    type="number"
                    min={0}
                    name={`clamp_${cat}_max`}
                    defaultValue={clamps?.[cat]?.max_g ?? ""}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="h-11 rounded-md bg-zinc-900 px-4 font-medium text-white" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}

