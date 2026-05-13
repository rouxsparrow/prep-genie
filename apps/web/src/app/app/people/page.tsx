import { listPeople } from "@/lib/db/people";
import Link from "next/link";

export default async function PeopleListPage() {
  const people = await listPeople();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">People</h1>
          <p className="text-sm text-zinc-600">Profiles with daily goals and clamps.</p>
        </div>
        <Link className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white" href="/app/people/new">
          New person
        </Link>
      </div>

      {people.length === 0 ? (
        <div className="rounded-lg border bg-white p-6 text-sm text-zinc-700">
          No people yet. Create first person to start planning.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {people.map((person) => (
            <Link
              key={person.id}
              className="rounded-lg border bg-white p-4 hover:bg-zinc-50"
              href={`/app/people/${person.id}`}
            >
              <div className="font-medium">{person.name}</div>
              <div className="mt-1 text-sm text-zinc-600">
                {person.daily_kcal} kcal · P {person.daily_protein_g}g · C {person.daily_carbs_g}g · F{" "}
                {person.daily_fat_g}g · {person.meals_per_day} meals/day
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
