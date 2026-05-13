import { redirect } from "next/navigation";

import RecipeForm, { parseRecipeForm } from "../recipe-form";

import { createRecipe } from "@/lib/db/recipes";

export default function NewRecipePage() {
  async function create(formData: FormData) {
    "use server";
    const parsed = parseRecipeForm(formData);
    const created = await createRecipe(parsed);
    redirect(`/app/recipes/${created.id}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New recipe</h1>
        <p className="text-sm text-zinc-600">Create normalized recipe + raw JSON snapshot.</p>
      </div>
      <RecipeForm action={create} submitLabel="Create recipe" />
    </div>
  );
}
