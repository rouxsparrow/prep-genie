import { ReactNode } from "react";

import { requireUser } from "@/lib/auth/require-user";

import AppNav from "./nav";

export default async function AppLayout({ children }: { children: ReactNode }) {
  await requireUser();

  return (
    <div className="min-h-dvh bg-zinc-50">
      <AppNav />
      <main className="mx-auto w-full max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}

