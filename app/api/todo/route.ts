import { createClient } from "@/utils/supabase/server";
import { db } from "@/utils/database";
import { cookies } from "next/headers";
import { todos } from "@/schema/todos";
import { sql } from "drizzle-orm";

export async function GET() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await supabase.auth.getUser();
  if (user.data.user == null) return Response.json({ error: "Not logged in" });
  const data = await db.transaction(async (tx) => {
    await tx.execute(
      sql`SELECT set_config('request.jwt.claim.sub', '${sql.raw(
        user.data.user?.id ?? ""
      )}', TRUE)`
    );
    // All the following will be run with the user context set with `set_config`
    return await tx.select().from(todos);
  });
  return Response.json(data);
}
