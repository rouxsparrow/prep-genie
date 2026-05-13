import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_ENABLE_ADMIN_BYPASS: z
    .enum(["true", "false"])
    .optional()
    .default("false"),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

export function getPublicEnv(): PublicEnv {
  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_ENABLE_ADMIN_BYPASS: process.env.NEXT_PUBLIC_ENABLE_ADMIN_BYPASS,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid public env vars: ${JSON.stringify(parsed.error.flatten().fieldErrors)}`,
    );
  }

  return parsed.data;
}

