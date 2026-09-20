"use client";

import Link from "next/link";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Trophy } from "lucide-react";
import {
  useSungaStore,
  monthOverview,
  weeklySpending,
  savingsStreakWeeks,
  goalProgress,
} from "@/lib/store";
import { formatMoney } from "@/lib/currency";
import { ScreenHeader, ScreenBody, Card, ProgressBar, TipBanner } from "@/components/ui";
import { getIcon } from "@/lib/icons";

export default function InsightsPage() {
  const profile = useSungaStore((s) => s.profile);
  const transactions = useSungaStore((s) => s.transactions);
  const goals = useSungaStore((s) => s.goals);
  const goalEntries = useSungaStore((s) => s.goalEntries);
  const plans = useSungaStore((s) => s.plans);

  const currency = profile?.currency ?? "ZMW";
  const overview = monthOverview(transactions, goalEntries, plans);
  const chartData = weeklySpending(transactions);
  const streak = savingsStreakWeeks(goalEntries);

  return (
    <div>
      <ScreenHeader title="Insights" />
      <ScreenBody>
        <Card>
          <p className="mb-3 text-sm font-medium text-sunga-muted">This month</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-sunga-muted">Saved</p>
              <p className="font-display font-semibold text-sunga-green">
                {formatMoney(overview.saved, currency)}
              </p>
            </div>
            <div>
              <p className="text-xs text-sunga-muted">Planned</p>
              <p className="font-display font-semibold text-sunga-green">
                {formatMoney(overview.planned, currency)}
              </p>
            </div>
            <div>
              <p className="text-xs text-sunga-muted">Spent</p>
              <p className="font-display font-semibold text-sunga-danger">
                {formatMoney(overview.spent, currency)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-sunga-muted">Weekly spending</p>
            <span className="text-xs text-sunga-muted">{currency}</span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#6b7a72" }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(27,59,47,0.06)" }}
                  formatter={(value) => formatMoney(Number(value), currency)}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e7ddca",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="amount" fill="#1b3b2f" radius={[6, 6, 6, 6]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {streak > 0 && (
          <TipBanner icon={Trophy}>
            <span className="font-semibold">{streak}</span> week{streak === 1 ? "" : "s"} of
            saving in a row. Great consistency.
          </TipBanner>
        )}

        <Card>
          <div className="mb-2 flex items-center justify-between">
            <p className="font-display font-semibold text-sunga-green">Your goals</p>
            <Link href="/goals" className="text-sm font-medium text-sunga-orange">
              View all
            </Link>
          </div>
          {goals.length === 0 ? (
            <p className="text-sm text-sunga-muted">No goals yet.</p>
          ) : (
            <div className="space-y-3">
              {goals.slice(0, 4).map((g) => {
                const percent = goalProgress(g);
                const Icon = getIcon(g.icon);
                return (
                  <div key={g.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 font-medium text-sunga-green">
                        <Icon size={14} />
                        {g.name}
                      </span>
                      <span className="text-sunga-muted">{percent ?? "—"}%</span>
                    </div>
                    <ProgressBar percent={percent ?? 0} />
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <p className="text-center text-sm text-sunga-muted">
          Your progress is growing, one small step at a time.
        </p>
      </ScreenBody>
    </div>
  );
}
