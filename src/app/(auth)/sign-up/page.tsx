import SignUpForm from "./sign-up-form";

export default function SignUpPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="text-sm text-zinc-600">Email + password (Supabase Auth).</p>
      </div>
      <SignUpForm />
      <p className="text-sm text-zinc-600">
        Already have account?{" "}
        <a className="underline" href="/sign-in">
          Sign in
        </a>
      </p>
    </div>
  );
}

