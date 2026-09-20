"use client";

import Link from "next/link";
import { useSungaStore } from "@/lib/store";
import { ScreenHeader, ScreenBody } from "@/components/ui";
import { GoalCard } from "@/components/GoalCard";
import { Target } from "lucide-react";

export default function GoalsPage() {
  const profile = useSungaStore((s) => s.profile);
  const goals = useSungaStore((s) => s.goals);
  const currency = profile?.currency ?? "ZMW";

  const active = goals.filter((g) => g.status !== "completed");
  const completed = goals.filter((g) => g.status === "completed");

  return (
    <div>
      <ScreenHeader title="Your goals" />
      <ScreenBody>
        {goals.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-sunga-border bg-white p-8 text-center">
            <Target size={32} className="text-sunga-orange" />
            <p className="font-display font-semibold text-sunga-green">
              Every amount counts.
            </p>
            <p className="text-sm text-sunga-muted">
              Start your first goal — it can be for anything, with or without a fixed
              target.
            </p>
          </div>
        ) : (
          <>
            {active.map((g) => (
              <GoalCard key={g.id} goal={g} currency={currency} />
            ))}
            {completed.length > 0 && (
              <div className="pt-2">
                <p className="mb-2 text-sm font-medium text-sunga-muted">Completed</p>
                <div className="space-y-3">
                  {completed.map((g) => (
                    <GoalCard key={g.id} goal={g} currency={currency} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <Link
          href="/goals/new"
          className="block w-full rounded-full bg-sunga-orange px-5 py-3.5 text-center font-semibold text-white shadow-sm transition active:scale-[0.98]"
        >
          + New goal
        </Link>
      </ScreenBody>
    </div>
  );
}
