"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={[
        "rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-zinc-900 text-white shadow-sm"
          : "text-zinc-900 hover:bg-zinc-100",
      ].join(" ")}
    >
      {label}
    </Link>
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
    <header className="border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-2">
          <Link className="text-sm font-semibold text-zinc-950" href="/app">
            Prep Genie
          </Link>
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
          className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
