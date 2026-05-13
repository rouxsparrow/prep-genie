import { redirect } from "next/navigation";

import RecipeForm, { parseRecipeForm } from "../recipe-form";

import { deleteRecipe, getRecipe, updateRecipe } from "@/lib/db/recipes";

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    redirect("/app/recipes");
  }
  const existingRecipe = recipe;

  async function save(formData: FormData) {
    "use server";
    const parsed = parseRecipeForm(formData);
    await updateRecipe(existingRecipe.id, parsed);
    redirect(`/app/recipes/${existingRecipe.id}`);
  }

  async function onDelete() {
    "use server";
    await deleteRecipe(existingRecipe.id);
    redirect("/app/recipes");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{existingRecipe.name}</h1>
          <p className="text-sm text-zinc-600">Edit recipe fields and JSON arrays.</p>
        </div>
        <form action={onDelete}>
          <button
            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-100"
            type="submit"
          >
            Delete
          </button>
        </form>
      </div>

      <RecipeForm recipe={existingRecipe} action={save} submitLabel="Save changes" />
    </div>
  );
}

