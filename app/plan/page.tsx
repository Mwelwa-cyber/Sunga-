"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useSungaStore,
  moneyAvailable,
  latestPlan,
  makeDefaultPlanCategories,
  hasFinancialData,
} from "@/lib/store";
import { ScreenHeader, ScreenBody, PrimaryButton, TipBanner, Stepper } from "@/components/ui";
import { formatMoney } from "@/lib/currency";
import { getIcon } from "@/lib/icons";
import { PlanCategory } from "@/lib/types";

export default function PlanPage() {
  const router = useRouter();
  const profile = useSungaStore((s) => s.profile);
  const transactions = useSungaStore((s) => s.transactions);
  const goalEntries = useSungaStore((s) => s.goalEntries);
  const plans = useSungaStore((s) => s.plans);
  const savePlan = useSungaStore((s) => s.savePlan);

  const currency = profile?.currency ?? "ZMW";
  const available = moneyAvailable(transactions, goalEntries);
  const existingPlan = latestPlan(plans);
  const knowsBudget = hasFinancialData(transactions);

  const [categories, setCategories] = useState<PlanCategory[]>(
    existingPlan ? existingPlan.categories.map((c) => ({ ...c })) : makeDefaultPlanCategories()
  );

  const total = categories.reduce((sum, c) => sum + c.amount, 0);
  const remaining = available - total;

  function updateAmount(id: string, amount: number) {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, amount } : c)));
  }

  function handleSave() {
    savePlan(categories);
    router.push("/home");
  }

  return (
    <div>
      <ScreenHeader title={`Plan ${formatMoney(available, currency)}`} backHref="/home" />
      <ScreenBody>
        {!knowsBudget && (
          <TipBanner tone="orange">
            You haven&apos;t recorded income or expenses yet, so this plan is only a
            starting point — not confirmed to fit your budget.
          </TipBanner>
        )}

        <div className="space-y-2">
          {categories.map((c) => {
            const Icon = getIcon(c.icon);
            return (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-2xl border border-sunga-border bg-white p-3.5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sunga-green-tint text-sunga-green">
                    <Icon size={16} />
                  </span>
                  <span className="font-medium text-sunga-green">{c.name}</span>
                </div>
                <Stepper value={c.amount} onChange={(v) => updateAmount(c.id, v)} />
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-sunga-green-tint p-4">
          <span className="font-display font-semibold text-sunga-green">Total</span>
          <span className="font-display text-lg font-semibold text-sunga-green">
            {formatMoney(total, currency)}
          </span>
        </div>

        <TipBanner tone={remaining < 0 ? "orange" : "green"}>
          {remaining < 0
            ? `This plan is ${formatMoney(Math.abs(remaining), currency)} over what you have available.`
            : remaining === 0
            ? "Even K10 saved is progress — this plan uses all of your available money."
            : `${formatMoney(remaining, currency)} is still unplanned.`}
        </TipBanner>

        <PrimaryButton onClick={handleSave}>Save this plan</PrimaryButton>
      </ScreenBody>
    </div>
  );
}
