import SignInForm from "./sign-in-form";

export default function SignInPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-zinc-600">
          Use your Supabase email/password account.
        </p>
      </div>
      <SignInForm />
      <p className="text-sm text-zinc-600">
        New here?{" "}
        <a className="underline" href="/sign-up">
          Create account
        </a>
      </p>
    </div>
  );
}

