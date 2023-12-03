"use client";
import { useEffect, useState } from "react";
import { SelectTodos } from "@/types/schema";
export default function Todo() {
  const [todos, setTodos] = useState<SelectTodos[]>([]);
  useEffect(() => {
    const fetchTodos = async () => {
      const res = await fetch("/api/todo", {
        method: "GET",
      });
      if (res.ok) setTodos(await res.json());
    };
    fetchTodos();
  }, []);
  return (
    <section className="place-items-center h-[100%] flex">
      <ul>
        {todos.map((todo) => {
          return <li key={todo.id}>{todo.todoName}</li>;
        })}
      </ul>
    </section>
  );
}
