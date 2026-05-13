"use client";

import { usePathname, useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <a
      href={href}
      className={[
        "rounded-md px-3 py-2 text-sm font-medium",
        isActive ? "bg-white shadow-sm" : "text-zinc-700 hover:bg-white/60",
      ].join(" ")}
    >
      {label}
    </a>
  );
}

export default function AppNav() {
  const router = useRouter();

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/sign-in");
    router.refresh();
  }

  return (
    <header className="border-b bg-zinc-50/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-2">
          <a className="text-sm font-semibold" href="/app">
            Prep Genie
          </a>
          <nav className="ml-4 flex items-center gap-1">
            <NavLink href="/app/people" label="People" />
            <NavLink href="/app/recipes" label="Recipes" />
            <NavLink href="/app/planner" label="Planner" />
            <NavLink href="/app/shopping" label="Shopping" />
          </nav>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="rounded-md border bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}

