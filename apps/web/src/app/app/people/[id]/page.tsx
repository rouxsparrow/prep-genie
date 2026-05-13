import { redirect } from "next/navigation";

import PersonForm, { parsePersonForm } from "../person-form";

import { deletePerson, getPerson, updatePerson } from "@/lib/db/people";

export default async function PersonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = await getPerson(id);

  if (!person) {
    redirect("/app/people");
  }
  const existingPerson = person;

  async function save(formData: FormData) {
    "use server";

    const parsed = parsePersonForm(formData, existingPerson.meals_per_day);
    await updatePerson(existingPerson.id, parsed);

    redirect(`/app/people/${existingPerson.id}`);
  }

  async function onDelete() {
    "use server";
    await deletePerson(existingPerson.id);
    redirect("/app/people");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{person.name}</h1>
          <p className="text-sm text-zinc-600">Edit profile and constraints.</p>
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

      <PersonForm person={existingPerson} action={save} submitLabel="Save changes" />
    </div>
  );
}
