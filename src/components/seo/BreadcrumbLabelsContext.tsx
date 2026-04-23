"use client";

import { createContext, useContext } from "react";

export type BreadcrumbLabels = {
  home: string;
  /** label per segmento path (es. "ai-tools", "guide-slug") */
  bySegment: Record<string, string>;
};

const Ctx = createContext<BreadcrumbLabels | null>(null);

export function BreadcrumbLabelsProvider({
  value,
  children,
}: {
  value: BreadcrumbLabels;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBreadcrumbLabels() {
  return useContext(Ctx);
}
