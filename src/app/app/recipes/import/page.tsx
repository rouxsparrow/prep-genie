import RecipeImportForm from "./recipe-import-form";

export default function RecipeImportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Import recipe JSON</h1>
        <p className="text-sm text-zinc-600">
          Paste JSON array (v1). Strict validation. All-or-nothing. No defaults. Upsert by name.
        </p>
      </div>
      <RecipeImportForm />
    </div>
  );
}
