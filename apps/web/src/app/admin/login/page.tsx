import { redirect } from "next/navigation";

import { isAdminBypassEnabled, setAdminBypassSession } from "@/lib/admin/bypass";

export default function AdminLoginPage() {
  if (!isAdminBypassEnabled()) {
    redirect("/app");
  }

  async function login(formData: FormData) {
    "use server";

    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");

    if (username !== "admin" || password !== "admin") {
      redirect("/admin/login?error=invalid");
    }

    await setAdminBypassSession();
    redirect("/admin");
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Admin bypass</h1>
        <p className="text-sm text-zinc-600">
          Dev-only. Requires `NEXT_PUBLIC_ENABLE_ADMIN_BYPASS=true`.
        </p>
      </div>

      <form className="flex flex-col gap-4" action={login}>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Username</span>
          <input className="h-11 rounded-md border px-3" name="username" required />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Password</span>
          <input
            className="h-11 rounded-md border px-3"
            type="password"
            name="password"
            required
          />
        </label>
        <button className="h-11 rounded-md bg-zinc-900 px-4 font-medium text-white" type="submit">
          Sign in (bypass)
        </button>
      </form>
    </div>
  );
}

