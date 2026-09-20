"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSungaStore } from "@/lib/store";

export default function RootPage() {
  const router = useRouter();
  const profile = useSungaStore((s) => s.profile);

  useEffect(() => {
    router.replace(profile?.onboarded ? "/home" : "/onboarding");
  }, [profile, router]);

  return null;
}
