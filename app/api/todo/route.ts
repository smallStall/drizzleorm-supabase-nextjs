import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { todos } from "@/schema/todos";
import { userRLSQuery } from "@/utils/database";

export async function GET() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await supabase.auth.getUser();
  if (user.data.user == null) return Response.json({ error: "Not logged in" });
  const data = await userRLSQuery(user.data.user.id, async (tx) => {
    return await tx.select().from(todos);
  });
  return Response.json(data);
}
