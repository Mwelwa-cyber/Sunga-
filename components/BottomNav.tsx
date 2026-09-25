"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, Plus, UsersRound, BarChart3 } from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS: {
  href: string;
  label: string;
  icon: typeof Home;
  isAction?: boolean;
}[] = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/plan", label: "Plan", icon: CalendarDays },
  { href: "/add", label: "Add", icon: Plus, isAction: true },
  { href: "/groups", label: "Groups", icon: UsersRound },
  { href: "/insights", label: "Insights", icon: BarChart3 },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-sunga-border bg-sunga-cream/95 backdrop-blur sm:rounded-b-[2.5rem]">
      <ul className="flex items-center justify-between px-4 py-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <li key={item.href} className="-mt-6 flex flex-1 justify-center">
                <Link
                  href={item.href}
                  aria-label="Add"
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-sunga-orange text-white shadow-lg shadow-sunga-orange/40 transition-transform active:scale-95"
                >
                  <Icon size={26} strokeWidth={2.5} />
                </Link>
              </li>
            );
          }

          return (
            <li key={item.href} className="flex flex-1 justify-center">
              <Link
                href={item.href}
                className={clsx(
                  "flex flex-col items-center gap-0.5 px-2 py-1 text-xs font-medium",
                  active ? "text-sunga-orange" : "text-sunga-muted"
                )}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
