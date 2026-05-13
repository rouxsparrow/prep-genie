import { ReactNode } from "react";

import { requireAdminBypassSession } from "@/lib/admin/bypass";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdminBypassSession();

  return <div className="min-h-dvh bg-zinc-50">{children}</div>;
}
