import Link from "next/link";
import { Goal } from "@/lib/types";
import { goalProgress } from "@/lib/store";
import { formatMoney } from "@/lib/currency";
import { IconGlyph } from "@/lib/icons";
import { ProgressBar } from "@/components/ui";

export function GoalCard({ goal, currency }: { goal: Goal; currency: "ZMW" | "USD" | "ZAR" }) {
  const percent = goalProgress(goal);

  return (
    <Link
      href={`/goals/${goal.id}`}
      className="block rounded-2xl border border-sunga-border bg-sunga-card p-4"
    >
      <div className="mb-2 flex items-center gap-3">
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-sunga-green-tint text-sunga-green">
          <IconGlyph name={goal.icon} size={18} />
        </span>
        <div className="flex-1">
          <p className="font-display font-semibold text-sunga-green">{goal.name}</p>
          <p className="text-xs text-sunga-muted">
            {formatMoney(goal.savedAmount, currency)}
            {goal.targetAmount ? ` of ${formatMoney(goal.targetAmount, currency)}` : " saved"}
          </p>
        </div>
        {percent !== null && (
          <span className="font-display text-sm font-semibold text-sunga-green">
            {percent}%
          </span>
        )}
        {goal.status === "paused" && (
          <span className="rounded-full bg-sunga-cream-soft px-2 py-0.5 text-[10px] font-semibold uppercase text-sunga-muted">
            Paused
          </span>
        )}
      </div>
      <ProgressBar percent={percent ?? 0} />
    </Link>
  );
}
