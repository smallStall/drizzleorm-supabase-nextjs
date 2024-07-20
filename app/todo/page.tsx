import { createClient } from "../utils/supabase/client";
import { todos } from "@/schema/todos";
import { rlsQuery } from "../utils/database";

export default async function Todo() {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (user.data.user == null) return Response.json({ error: "Not logged in" });

  const data = await rlsQuery(user.data.user.id, async (tx) => {
    return await tx.select().from(todos);
  });
  return (
    <section className="place-items-center h-[100%] flex">
      <ul>
        {data.map((todo) => {
          return <li key={todo.id}>{todo.todoName}</li>;
        })}
      </ul>
    </section>
  );
}
