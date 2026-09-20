"use client";

import { use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ScreenHeader, ScreenBody, PrimaryButton, SecondaryButton, TipBanner, ProgressBar } from "@/components/ui";
import { useSungaStore, goalProgress } from "@/lib/store";
import { formatMoney } from "@/lib/currency";
import { formatDateLabel } from "@/lib/dates";
import { IconGlyph } from "@/lib/icons";
import { Leaf, CheckCircle2, Circle } from "lucide-react";
import { todayISO } from "@/lib/dates";

function buildMilestones(targetAmount: number | null, saved: number) {
  if (targetAmount && targetAmount > 0) {
    const marks = [
      { label: "First contribution", value: 1 },
      { label: "25% saved", value: targetAmount * 0.25 },
      { label: "50% saved", value: targetAmount * 0.5 },
      { label: "Goal complete", value: targetAmount },
    ];
    return marks.map((m) => ({
      label: m.label,
      achieved: saved >= m.value,
      valueLabel: m.label === "Goal complete" ? null : `${Math.round((m.value / targetAmount) * 100)}%`,
    }));
  }
  const steps = [1000, 5000, 10000, 25000, 50000];
  return steps.map((s) => ({
    label: `${s.toLocaleString()} saved`,
    achieved: saved >= s,
    valueLabel: null,
  }));
}

export default function GoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const profile = useSungaStore((s) => s.profile);
  const goal = useSungaStore((s) => s.goals.find((g) => g.id === id));
  const goalEntries = useSungaStore((s) => s.goalEntries);
  const entries = useMemo(
    () =>
      goalEntries
        .filter((e) => e.goalId === id)
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [goalEntries, id]
  );
  const addGoalEntry = useSungaStore((s) => s.addGoalEntry);
  const updateGoalStatus = useSungaStore((s) => s.updateGoalStatus);

  const currency = profile?.currency ?? "ZMW";

  if (!goal) {
    return (
      <div>
        <ScreenHeader title="Goal" backHref="/goals" />
        <ScreenBody>
          <p className="text-sm text-sunga-muted">This goal could not be found.</p>
        </ScreenBody>
      </div>
    );
  }

  const percent = goalProgress(goal);
  const milestones = buildMilestones(goal.targetAmount, goal.savedAmount);
  const nextMilestone = milestones.find((m) => !m.achieved);

  function quickAdd(amount: number) {
    addGoalEntry({
      goalId: goal!.id,
      kind: "deposit",
      amount,
      location: goal!.location,
      date: todayISO(),
    });
  }

  return (
    <div>
      <ScreenHeader title={goal.name} backHref="/goals" />
      <ScreenBody>
        <div className="flex flex-col items-center gap-2 py-2 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sunga-green-tint text-sunga-green">
            <IconGlyph name={goal.icon} size={28} />
          </span>
          <p className="font-display text-2xl font-semibold text-sunga-green">
            {formatMoney(goal.savedAmount, currency)}
            {goal.targetAmount ? ` of ${formatMoney(goal.targetAmount, currency)}` : ""}
          </p>
          {percent !== null && <p className="text-sm text-sunga-muted">{percent}% complete</p>}
          <div className="w-full pt-1">
            <ProgressBar percent={percent ?? Math.min(100, (goal.savedAmount / 1000) * 10)} />
          </div>
        </div>

        <TipBanner icon={Leaf}>
          Small deposits still move you forward{nextMilestone ? ` — next stop: ${nextMilestone.label}.` : "."}
        </TipBanner>

        <div>
          <p className="mb-2 text-sm font-medium text-sunga-muted">Quick add</p>
          <div className="flex gap-2">
            {[10, 20, 50].map((v) => (
              <button
                key={v}
                onClick={() => quickAdd(v)}
                className="flex-1 rounded-full border border-sunga-border bg-white py-2.5 text-sm font-semibold text-sunga-green"
              >
                +{formatMoney(v, currency)}
              </button>
            ))}
            <button
              onClick={() => router.push(`/add/savings?goalId=${goal.id}`)}
              className="flex-1 rounded-full border border-sunga-border bg-white py-2.5 text-sm font-semibold text-sunga-green"
            >
              Custom
            </button>
          </div>
        </div>

        <PrimaryButton onClick={() => router.push(`/add/savings?goalId=${goal.id}`)}>
          Record savings
        </PrimaryButton>

        <div>
          <p className="mb-2 text-sm font-medium text-sunga-muted">Milestones</p>
          <div className="space-y-2 rounded-2xl border border-sunga-border bg-white p-4">
            {milestones.map((m) => (
              <div key={m.label} className="flex items-center gap-2.5">
                {m.achieved ? (
                  <CheckCircle2 size={18} className="text-sunga-green" />
                ) : (
                  <Circle size={18} className="text-sunga-border" />
                )}
                <span
                  className={
                    m.achieved ? "text-sm font-medium text-sunga-green" : "text-sm text-sunga-muted"
                  }
                >
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {entries.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium text-sunga-muted">History</p>
            <div className="divide-y divide-sunga-border rounded-2xl border border-sunga-border bg-white">
              {entries.map((e) => (
                <div key={e.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-sunga-green">
                      {e.kind === "deposit" ? "Deposit" : "Withdrawal"}
                    </p>
                    <p className="text-xs text-sunga-muted">{formatDateLabel(e.date)}</p>
                  </div>
                  <p
                    className={
                      "font-semibold " + (e.kind === "deposit" ? "text-sunga-green" : "text-sunga-danger")
                    }
                  >
                    {e.kind === "deposit" ? "+" : "-"}
                    {formatMoney(e.amount, currency)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <SecondaryButton
          onClick={() =>
            updateGoalStatus(goal.id, goal.status === "paused" ? "active" : "paused")
          }
        >
          {goal.status === "paused" ? "Resume goal" : "Pause goal"}
        </SecondaryButton>
      </ScreenBody>
    </div>
  );
}
