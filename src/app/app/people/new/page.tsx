import { redirect } from "next/navigation";

import PersonForm, { parsePersonForm } from "../person-form";

import { createPerson } from "@/lib/db/people";

export default function NewPersonPage() {
  async function create(formData: FormData) {
    "use server";

    const parsed = parsePersonForm(formData, 3);
    const created = await createPerson(parsed);

    redirect(`/app/people/${created.id}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New person</h1>
        <p className="text-sm text-zinc-600">Create profile with daily goals.</p>
      </div>
      <PersonForm action={create} submitLabel="Create person" />
    </div>
  );
}
