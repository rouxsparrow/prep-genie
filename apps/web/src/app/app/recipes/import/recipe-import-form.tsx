"use client";

import { useActionState, useState } from "react";

type ImportState =
  | { ok: true; recipeId: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

async function importRecipeAction(
  _prevState: ImportState | null,
  formData: FormData,
): Promise<ImportState> {
  const res = await fetch("/app/recipes/import/submit", {
    method: "POST",
    body: formData,
  });

  const json = (await res.json()) as ImportState;
  return json;
}

function FieldErrors({ fieldErrors }: { fieldErrors?: Record<string, string[]> }) {
  if (!fieldErrors) return null;

  const entries = Object.entries(fieldErrors).filter(([, v]) => v && v.length > 0);
  if (entries.length === 0) return null;

  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
      <div className="font-medium">Validation errors</div>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {entries.map(([field, messages]) => (
          <li key={field}>
            <span className="font-mono">{field}</span>: {messages.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function RecipeImportForm() {
  const [jsonText, setJsonText] = useState("");
  const [state, action, isPending] = useActionState<ImportState | null, FormData>(
    importRecipeAction,
    null,
  );

  return (
    <form className="space-y-4" action={action}>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">Recipe JSON</span>
        <textarea
          className="min-h-[360px] rounded-md border px-3 py-2 font-mono text-xs"
          name="json"
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          required
        />
      </label>

      {state && !state.ok ? (
        <>
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {state.message}
          </div>
          <FieldErrors fieldErrors={state.fieldErrors} />
        </>
      ) : null}

      {state && state.ok ? (
        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-900">
          Imported.{" "}
          <a className="underline" href={`/app/recipes/${state.recipeId}`}>
            View recipe
          </a>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="h-11 rounded-md bg-zinc-900 px-4 font-medium text-white disabled:opacity-60"
      >
        {isPending ? "Importing…" : "Import"}
      </button>
    </form>
  );
}

