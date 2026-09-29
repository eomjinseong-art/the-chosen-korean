"use client";

import { useEffect, useState } from "react";
import { VISITOR_KEY, VISITOR_NAMESPACE } from "@/lib/site";

const STORAGE_KEY = `${VISITOR_NAMESPACE}:visits:day`;

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-CA");
    const last = localStorage.getItem(STORAGE_KEY);
    const path = last === today ? "get" : "hit";
    fetch(`https://abacus.jasoncameron.dev/${path}/${VISITOR_NAMESPACE}/${VISITOR_KEY}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: { value?: number }) => {
        if (typeof data.value === "number") setCount(data.value);
        if (last !== today) localStorage.setItem(STORAGE_KEY, today);
      })
      .catch(() => {
        /* counter is decorative */
      });
  }, []);

  return (
    <span className="visitors" aria-label={count === null ? "방문자" : `방문자 ${count.toLocaleString("ko-KR")}명`}>
      <span aria-hidden>👁</span> {count === null ? "" : count.toLocaleString("ko-KR")}
    </span>
  );
}
