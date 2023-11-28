import type { Config } from "drizzle-kit";

export default {
  schema: "./schema/*",
  out: "./supabase/migrations",
} satisfies Config;
