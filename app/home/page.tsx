"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Bell, Wallet, TrendingUp, TrendingDown, Lock } from "lucide-react";
import {
  useSungaStore,
  moneyAvailable,
  latestPlan,
  planBucketTotals,
  goalProgress,
  weeklySavingsComparison,
} from "@/lib/store";
import { formatMoney } from "@/lib/currency";
import { getGreeting } from "@/lib/dates";
import { Card, ProgressBar, TipBanner } from "@/components/ui";
import { getIcon } from "@/lib/icons";

export default function HomePage() {
  const profile = useSungaStore((s) => s.profile);
  const transactions = useSungaStore((s) => s.transactions);
  const goals = useSungaStore((s) => s.goals);
  const goalEntries = useSungaStore((s) => s.goalEntries);
  const plans = useSungaStore((s) => s.plans);

  const currency = profile?.currency ?? "ZMW";
  const available = moneyAvailable(transactions, goalEntries);
  const plan = latestPlan(plans);
  const buckets = planBucketTotals(plan);

  const topGoal = useMemo(() => {
    const active = goals.filter((g) => g.status === "active");
    return active.sort((a, b) => (goalProgress(b) ?? 0) - (goalProgress(a) ?? 0))[0];
  }, [goals]);

  const { diff } = weeklySavingsComparison(goalEntries);

  if (!profile) return null;

  return (
    <div className="px-5 pb-4 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sunga-green text-lg font-semibold text-sunga-cream">
            {profile.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="text-sm text-sunga-muted">{getGreeting()},</p>
            <p className="font-display text-lg font-semibold text-sunga-green">
              {profile.name.split(" ")[0]}
            </p>
          </div>
        </div>
        <button
          aria-label="Notifications"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-sunga-border bg-white text-sunga-green"
        >
          <Bell size={18} />
        </button>
      </div>

      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-sunga-green px-4 py-2 text-sm font-medium text-sunga-cream">
        <Wallet size={16} />
        My Money
      </div>

      <div className="mt-3 space-y-4">
        <div className="rounded-2xl bg-sunga-green p-5 text-sunga-cream">
          <p className="text-sm text-sunga-cream/80">Money available</p>
          <p className="font-display mt-1 text-4xl font-semibold">
            {formatMoney(available, currency)}
          </p>
          <p className="mt-1 text-xs text-sunga-cream/70">Based on what you&apos;ve recorded</p>
          <Link
            href="/plan"
            className="mt-4 block rounded-full bg-sunga-orange px-5 py-3 text-center font-semibold text-white"
          >
            Plan this money
          </Link>
        </div>

        {plan && (
          <div className="grid grid-cols-3 gap-3 text-center">
            <Card className="py-3">
              <p className="text-xs text-sunga-muted">Needs</p>
              <p className="font-display font-semibold text-sunga-green">
                {formatMoney(buckets.needs, currency)}
              </p>
            </Card>
            <Card className="py-3">
              <p className="text-xs text-sunga-muted">Goals</p>
              <p className="font-display font-semibold text-sunga-green">
                {formatMoney(buckets.goals, currency)}
              </p>
            </Card>
            <Card className="py-3">
              <p className="text-xs text-sunga-muted">Free to spend</p>
              <p className="font-display font-semibold text-sunga-green">
                {formatMoney(buckets.free, currency)}
              </p>
            </Card>
          </div>
        )}

        <Card>
          <div className="flex items-center justify-between">
            <p className="font-display font-semibold text-sunga-green">Your goals</p>
            <Link href="/goals" className="text-sm font-medium text-sunga-orange">
              View all
            </Link>
          </div>
          {topGoal ? (
            <div className="mt-3">
              <div className="mb-1.5 flex items-center gap-2">
                {(() => {
                  const Icon = getIcon(topGoal.icon);
                  return <Icon size={16} className="text-sunga-green" />;
                })()}
                <p className="font-medium text-sunga-green">{topGoal.name}</p>
              </div>
              <ProgressBar percent={goalProgress(topGoal) ?? 0} />
              <p className="mt-1.5 text-xs text-sunga-muted">
                {formatMoney(topGoal.savedAmount, currency)}
                {topGoal.targetAmount
                  ? ` of ${formatMoney(topGoal.targetAmount, currency)}`
                  : " saved"}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-sunga-muted">
              You don&apos;t have a goal yet.{" "}
              <Link href="/goals/new" className="font-medium text-sunga-orange">
                Create one
              </Link>
              .
            </p>
          )}
        </Card>

        {diff !== 0 && (
          <TipBanner icon={diff > 0 ? TrendingUp : TrendingDown} tone={diff > 0 ? "green" : "orange"}>
            You saved {formatMoney(Math.abs(diff), currency)}{" "}
            {diff > 0 ? "more" : "less"} than last week.
          </TipBanner>
        )}

        <p className="flex items-center justify-center gap-1.5 py-2 text-center text-xs text-sunga-muted">
          <Lock size={12} className="flex-none" />
          Sunga does not hold or move your money — it only helps you plan and track it.
        </p>
      </div>
    </div>
  );
}
