"use client";
import { useEffect } from "react";
export default function Todo() {
  useEffect(() => {
    const test = async () => {
      await fetch("/api/test", {
        method: "GET",
      });
    };
    test();
  }, []);
  return <div> </div>;
}
