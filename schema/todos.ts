import { pgTable, timestamp, uuid, text, boolean } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
export const todos = pgTable("todos", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.userId),
  todoName: text("todo_name").notNull(),
  isDone: boolean("is_done").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
