"use client";

import { useSyncExternalStore, type ReactNode } from "react";

/**
 * 가계도 탭과 아래 «글로 읽는 가족관계»를 묶는 작은 저장소.
 * FamilyTreeView가 탭이 바뀔 때 setActiveTree를 부르고, TreePanel은 고른 탭의 글만 보여 줍니다.
 * 서버 렌더에서는 기본 탭만 보이고, 다른 탭의 글도 HTML에는 남습니다(hidden).
 */
let active: string | null = null;
const listeners = new Set<() => void>();

export function setActiveTree(id: string) {
  if (active === id) return;
  active = id;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function TreePanel({ id, defaultId, children }: { id: string; defaultId: string; children: ReactNode }) {
  const current = useSyncExternalStore(
    subscribe,
    () => active ?? defaultId,
    () => defaultId,
  );
  return (
    <div data-tree-panel={id} hidden={current !== id}>
      {children}
    </div>
  );
}
