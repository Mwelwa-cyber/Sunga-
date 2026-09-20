"use client";

import { usePathname } from "next/navigation";

/**
 * Static export serves every /section/[id]/ URL from one pre-rendered
 * placeholder page (see each route's generateStaticParams), so the real id
 * must come from the browser's actual URL rather than the build-time
 * `params` prop, which is always the placeholder value.
 */
export function useRouteId(): string {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? "";
}
