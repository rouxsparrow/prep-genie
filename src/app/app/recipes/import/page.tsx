import RecipeImportForm from "./recipe-import-form";
import Link from "next/link";

export default function RecipeImportPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Import recipe JSON</h1>
        <p className="text-sm text-zinc-600">
          Paste JSON array (v1). Strict validation. All-or-nothing. No defaults. Upsert by name.
        </p>
        <div>
          <Link
            className="inline-flex h-10 items-center rounded-md border bg-white px-3 text-sm font-medium hover:bg-zinc-50"
            href="/app/recipes/import/template"
          >
            Download JSON template
          </Link>
        </div>
      </div>
      <RecipeImportForm />
    </div>
  );
}
