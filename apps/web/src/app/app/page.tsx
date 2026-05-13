import { requireUser } from "@/lib/auth/require-user";

export default async function AppHome() {
  const user = await requireUser();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-sm text-zinc-700">Signed in as: {user.email}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <a className="rounded-lg border bg-white p-4 hover:bg-zinc-50" href="/app/people">
          <div className="font-medium">People</div>
          <div className="text-sm text-zinc-600">Set daily goals, meals/day, clamps.</div>
        </a>
        <a className="rounded-lg border bg-white p-4 hover:bg-zinc-50" href="/app/recipes">
          <div className="font-medium">Recipes</div>
          <div className="text-sm text-zinc-600">Save recipes + JSON import.</div>
        </a>
        <a className="rounded-lg border bg-white p-4 hover:bg-zinc-50" href="/app/planner">
          <div className="font-medium">Planner</div>
          <div className="text-sm text-zinc-600">Assign recipes for Mon–Sun.</div>
        </a>
        <a className="rounded-lg border bg-white p-4 hover:bg-zinc-50" href="/app/shopping">
          <div className="font-medium">Shopping</div>
          <div className="text-sm text-zinc-600">Aggregated ingredients.</div>
        </a>
      </div>
    </div>
  );
}

