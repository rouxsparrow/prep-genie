import Link from "next/link";

import { listRecipes } from "@/lib/db/recipes";

export default async function RecipesListPage() {
  const recipes = await listRecipes();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Recipes</h1>
          <p className="text-sm text-zinc-600">Stored per account. Import supports v1 JSON.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link className="rounded-md border bg-white px-3 py-2 text-sm font-medium" href="/app/recipes/import">
            Import JSON
          </Link>
          <Link className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white" href="/app/recipes/new">
            New recipe
          </Link>
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="rounded-lg border bg-white p-6 text-sm text-zinc-700">
          No recipes yet. Create or import first recipe.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              className="rounded-lg border bg-white p-4 hover:bg-zinc-50"
              href={`/app/recipes/${recipe.id}`}
            >
              <div className="font-medium">{recipe.name}</div>
              <div className="mt-1 text-sm text-zinc-600">
                {recipe.category} · {recipe.nutrition_kcal_per_100g} kcal/100g
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
