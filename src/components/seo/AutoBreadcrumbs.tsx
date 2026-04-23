"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBreadcrumbLabels } from "./BreadcrumbLabelsContext";

function segmentToLabel(segment: string) {
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const hiddenRoots = new Set(["dashboard", "login", "signup", "welcome"]);

export function AutoBreadcrumbs() {
  const pathname = usePathname();
  const labels = useBreadcrumbLabels();
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length <= 1) return null;

  const [, ...segments] = parts;
  if (segments.length === 0 || hiddenRoots.has(segments[0])) return null;

  const homeLabel = labels?.home ?? "Home";
  const bySeg = labels?.bySegment ?? {};

  let currentPath = `/${parts[0]}`;
  const crumbs = [{ href: currentPath, label: homeLabel }];

  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label = bySeg[segment] ?? segmentToLabel(segment);
    crumbs.push({ href: currentPath, label });
  }

  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-6 pt-24 text-xs text-on-surface-variant md:pt-28">
      <ol className="flex flex-wrap items-center gap-2">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-2">
              {isLast ? (
                <span className="font-semibold text-on-surface">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-indigo-300">
                  {crumb.label}
                </Link>
              )}
              {!isLast ? <span aria-hidden>/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
