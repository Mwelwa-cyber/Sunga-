"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Wallet, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  useSungaStore,
  latestPlan,
  planBucketTotals,
  todaysExpenseTotal,
  getTodayIsoSafe,
} from "@/lib/store";
import { daysInMonth } from "@/lib/dates";
import { formatMoney } from "@/lib/currency";
import { formatDateLabel, formatTimeLabel } from "@/lib/dates";
import { ScreenHeader, ScreenBody, TipBanner } from "@/components/ui";
import { getIcon, EXPENSE_CATEGORY_ICONS } from "@/lib/icons";
import { EXPENSE_CATEGORIES } from "@/lib/store";

export default function TrackPage() {
  const profile = useSungaStore((s) => s.profile);
  const transactions = useSungaStore((s) => s.transactions);
  const plans = useSungaStore((s) => s.plans);

  const currency = profile?.currency ?? "ZMW";
  const plan = latestPlan(plans);
  const buckets = planBucketTotals(plan);
  const today = getTodayIsoSafe();

  const spentToday = todaysExpenseTotal(transactions, today);
  const dailyBudget = buckets.free > 0 ? buckets.free / daysInMonth() : 0;
  const remainingToday = dailyBudget - spentToday;

  const todaysExpenses = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense" && t.date.slice(0, 10) === today.slice(0, 10))
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [transactions, today]
  );

  return (
    <div>
      <ScreenHeader title="Track" />
      <ScreenBody>
        {plan ? (
          <div className="rounded-2xl bg-sunga-green-tint p-4">
            <div className="flex items-center gap-2 text-sunga-green">
              <Wallet size={18} />
              <p className="text-sm font-medium">Daily limit</p>
            </div>
            <p className="font-display mt-1 text-3xl font-semibold text-sunga-green">
              {formatMoney(Math.max(0, remainingToday), currency)}
            </p>
            <p className="text-xs text-sunga-muted">left for today</p>
          </div>
        ) : (
          <TipBanner tone="orange">
            Save a plan to see a daily spending limit.{" "}
            <Link href="/plan" className="font-semibold underline">
              Plan your money
            </Link>
          </TipBanner>
        )}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-sunga-muted">Expenses today</p>
            <Link href="/transactions" className="text-sm font-medium text-sunga-orange">
              View all
            </Link>
          </div>
          {todaysExpenses.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-sunga-border bg-white p-4 text-center text-sm text-sunga-muted">
              Nothing recorded yet today.
            </p>
          ) : (
            <div className="divide-y divide-sunga-border rounded-2xl border border-sunga-border bg-white">
              {todaysExpenses.map((t) => {
                if (t.type !== "expense") return null;
                const Icon = getIcon(EXPENSE_CATEGORY_ICONS[t.category] ?? "dots");
                return (
                  <Link
                    key={t.id}
                    href={`/transactions/${t.id}`}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sunga-green-tint text-sunga-green">
                      <Icon size={16} />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-sunga-green">{t.category}</p>
                      <p className="text-xs text-sunga-muted">
                        {formatDateLabel(t.date)} · {formatTimeLabel(t.createdAt)}
                      </p>
                    </div>
                    <p className="font-semibold text-sunga-green">
                      {formatMoney(t.amount, currency)}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-sunga-muted">Quick add</p>
          <div className="flex flex-wrap gap-2">
            {EXPENSE_CATEGORIES.map((c) => {
              const Icon = getIcon(EXPENSE_CATEGORY_ICONS[c]);
              return (
                <Link
                  key={c}
                  href={`/add/expense?category=${encodeURIComponent(c)}`}
                  className="flex items-center gap-1.5 rounded-full border border-sunga-border bg-white px-3.5 py-2 text-sm font-medium text-sunga-green"
                >
                  <Icon size={15} />
                  {c}
                </Link>
              );
            })}
          </div>
        </div>

        {plan && (
          <TipBanner icon={remainingToday >= 0 ? CheckCircle2 : AlertTriangle} tone={remainingToday >= 0 ? "green" : "orange"}>
            {remainingToday >= 0
              ? "You are still within today's plan."
              : `You are ${formatMoney(Math.abs(remainingToday), currency)} over today's plan.`}
          </TipBanner>
        )}
      </ScreenBody>
    </div>
  );
}
