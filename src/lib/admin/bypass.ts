import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getPublicEnv } from "@/lib/env";

const ADMIN_COOKIE_NAME = "pg_admin";

export function isAdminBypassEnabled() {
  return getPublicEnv().NEXT_PUBLIC_ENABLE_ADMIN_BYPASS === "true";
}

export async function requireAdminBypassSession() {
  if (!isAdminBypassEnabled()) {
    redirect("/app");
  }

  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_COOKIE_NAME);
  if (!cookie?.value) {
    redirect("/admin/login");
  }
}

export async function clearAdminBypassSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });
}

export async function setAdminBypassSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, "1", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
  });
}

