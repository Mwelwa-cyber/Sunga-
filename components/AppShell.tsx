"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { useSungaStore } from "@/lib/store";
import BottomNav from "@/components/BottomNav";

if (typeof window !== "undefined") {
  useSungaStore.persist.rehydrate();
}

function useHydrated() {
  return useSyncExternalStore(
    (callback) => useSungaStore.persist.onFinishHydration(callback),
    () => useSungaStore.persist.hasHydrated(),
    () => false
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();
  const pathname = usePathname();

  const showNav = hydrated && !pathname.startsWith("/onboarding");

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-sunga-cream sm:my-4 sm:min-h-[calc(100vh-2rem)] sm:rounded-[2.5rem] sm:border sm:border-sunga-border sm:shadow-xl">
      <div className="flex-1 overflow-y-auto pb-24">
        {hydrated ? children : null}
      </div>
      {showNav && <BottomNav />}
    </div>
  );
}
