import { redirect } from "next/navigation";

import { clearAdminBypassSession } from "@/lib/admin/bypass";

export default function AdminHomePage() {
  async function logout() {
    "use server";
    await clearAdminBypassSession();
    redirect("/app");
  }

  return (
    <main className="mx-auto w-full max-w-3xl space-y-4 px-6 py-10">
      <h1 className="text-2xl font-semibold">Admin (bypass)</h1>
      <p className="text-sm text-zinc-700">
        This area exists only for MVP admin screens. Do not enable bypass in production.
      </p>
      <form action={logout}>
        <button className="rounded-md border bg-white px-3 py-2 text-sm font-medium" type="submit">
          Logout bypass
        </button>
      </form>
    </main>
  );
}

