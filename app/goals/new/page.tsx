"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ScreenHeader, ScreenBody, PrimaryButton, Card, Chip, TipBanner } from "@/components/ui";
import { useSungaStore, hasFinancialData } from "@/lib/store";
import { GoalPriority, SavingsLocation } from "@/lib/types";
import { CURRENCY_SYMBOLS, formatMoney } from "@/lib/currency";
import { GOAL_PURPOSE_ICONS, getIcon } from "@/lib/icons";
import { Sparkles } from "lucide-react";
import { cleanMoneyInput } from "@/lib/money";

const PRIORITIES: { value: GoalPriority; label: string }[] = [
  { value: "essential", label: "Essential" },
  { value: "important", label: "Important" },
  { value: "nice_to_have", label: "Nice to have" },
];

const METHODS: { value: "daily" | "weekly" | "monthly" | "payday" | "flexible"; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
  { value: "daily", label: "Daily" },
  { value: "payday", label: "Payday" },
  { value: "flexible", label: "Flexible" },
];

const LOCATIONS: { value: SavingsLocation; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "mobile_money", label: "Mobile money" },
  { value: "bank", label: "Bank" },
  { value: "chilimba", label: "Chilimba / village bank" },
  { value: "trusted_person", label: "Trusted person" },
  { value: "other", label: "Other" },
];

export default function NewGoalPage() {
  const router = useRouter();
  const profile = useSungaStore((s) => s.profile);
  const transactions = useSungaStore((s) => s.transactions);
  const addGoal = useSungaStore((s) => s.addGoal);

  const currency = profile?.currency ?? "ZMW";
  const symbol = CURRENCY_SYMBOLS[currency];
  const knowsBudget = hasFinancialData(transactions);

  const [purposeIdx, setPurposeIdx] = useState(0);
  const [name, setName] = useState("");
  const [hasTarget, setHasTarget] = useState(true);
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [priority, setPriority] = useState<GoalPriority>("important");
  const [method, setMethod] = useState<"daily" | "weekly" | "monthly" | "payday" | "flexible">(
    "monthly"
  );
  const [location, setLocation] = useState<SavingsLocation>("mobile_money");

  const [now] = useState(() => Date.now());
  const purpose = GOAL_PURPOSE_ICONS[purposeIdx];
  const numericTarget = Number(targetAmount) || 0;

  const monthlyContribution = useMemo(() => {
    if (!hasTarget || numericTarget <= 0 || !targetDate) return null;
    const months = Math.max(
      1,
      Math.ceil((new Date(targetDate).getTime() - now) / (1000 * 60 * 60 * 24 * 30))
    );
    return Math.ceil(numericTarget / months);
  }, [hasTarget, numericTarget, targetDate, now]);

  function handleSubmit() {
    const finalName = name.trim() || purpose.label;
    const id = addGoal({
      name: finalName,
      icon: purpose.icon,
      purpose: purpose.label,
      targetAmount: hasTarget && numericTarget > 0 ? numericTarget : null,
      targetDate: hasTarget && targetDate ? targetDate : null,
      priority,
      contributionMethod: method,
      location,
    });
    router.push(`/goals/${id}`);
  }

  return (
    <div>
      <ScreenHeader title="New goal" backHref="/goals" />
      <ScreenBody>
        <div>
          <p className="mb-2 text-sm font-medium text-sunga-muted">What&apos;s this for?</p>
          <div className="grid grid-cols-4 gap-2">
            {GOAL_PURPOSE_ICONS.map((p, idx) => {
              const Icon = getIcon(p.icon);
              return (
                <button
                  key={p.label}
                  onClick={() => setPurposeIdx(idx)}
                  className={
                    "flex flex-col items-center gap-1 rounded-xl border p-2.5 text-[11px] font-medium " +
                    (purposeIdx === idx
                      ? "border-sunga-green bg-sunga-green-tint text-sunga-green"
                      : "border-sunga-border bg-white text-sunga-green")
                  }
                >
                  <Icon size={18} />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <Card>
          <label className="block text-sm font-medium text-sunga-muted">Goal name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={purpose.label}
            className="mt-2 w-full rounded-xl border border-sunga-border bg-white px-3.5 py-3 text-base outline-none focus:border-sunga-green"
          />
        </Card>

        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-sunga-muted">
              Does this goal have a target amount?
            </label>
            <div className="flex gap-2">
              <Chip active={hasTarget} onClick={() => setHasTarget(true)}>
                Yes
              </Chip>
              <Chip active={!hasTarget} onClick={() => setHasTarget(false)}>
                No
              </Chip>
            </div>
          </div>
          {hasTarget && (
            <>
              <div className="flex items-center gap-2 rounded-xl border border-sunga-border bg-white px-3.5 py-3">
                <span className="text-lg font-semibold text-sunga-green">{symbol}</span>
                <input
                  inputMode="decimal"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(cleanMoneyInput(e.target.value))}
                  placeholder="Target amount"
                  className="w-full bg-transparent text-base outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-sunga-muted">Target date (optional)</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-sunga-border bg-white px-3.5 py-2.5 text-sm outline-none"
                />
              </div>
            </>
          )}
        </Card>

        {monthlyContribution !== null && (
          <TipBanner icon={Sparkles} tone={knowsBudget ? "green" : "orange"}>
            {knowsBudget ? (
              <>
                Saving {formatMoney(monthlyContribution, currency)} monthly would reach
                this goal by your target date.
              </>
            ) : (
              <>
                Saving {formatMoney(monthlyContribution, currency)} monthly would reach
                this goal by your target date. Because you haven&apos;t added income or
                expenses, Sunga cannot confirm whether this fits your budget.
              </>
            )}
          </TipBanner>
        )}

        <div>
          <p className="mb-2 text-sm font-medium text-sunga-muted">Priority</p>
          <div className="flex gap-2">
            {PRIORITIES.map((p) => (
              <Chip key={p.value} active={priority === p.value} onClick={() => setPriority(p.value)}>
                {p.label}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-sunga-muted">
            How will you contribute?
          </p>
          <div className="flex flex-wrap gap-2">
            {METHODS.map((m) => (
              <Chip key={m.value} active={method === m.value} onClick={() => setMethod(m.value)}>
                {m.label}
              </Chip>
            ))}
          </div>
        </div>

        <Card>
          <label className="block text-sm font-medium text-sunga-muted">
            Where will you keep this money?
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value as SavingsLocation)}
            className="mt-2 w-full rounded-xl border border-sunga-border bg-white px-3.5 py-3 text-sm outline-none"
          >
            {LOCATIONS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </Card>

        <PrimaryButton onClick={handleSubmit}>Create goal</PrimaryButton>
      </ScreenBody>
    </div>
  );
}
