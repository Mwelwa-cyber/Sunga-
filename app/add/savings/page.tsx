"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ScreenHeader, ScreenBody, PrimaryButton, Card } from "@/components/ui";
import { useSungaStore } from "@/lib/store";
import { SavingsLocation } from "@/lib/types";
import { CURRENCY_SYMBOLS } from "@/lib/currency";
import { todayISO } from "@/lib/dates";
import { getIcon } from "@/lib/icons";
import { Target } from "lucide-react";

const LOCATIONS: { value: SavingsLocation; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "mobile_money", label: "Mobile money" },
  { value: "bank", label: "Bank" },
  { value: "chilimba", label: "Chilimba / village bank" },
  { value: "trusted_person", label: "Trusted person" },
  { value: "other", label: "Other" },
];

function AddSavingsForm() {
  const router = useRouter();
  const params = useSearchParams();
  const profile = useSungaStore((s) => s.profile);
  const allGoals = useSungaStore((s) => s.goals);
  const goals = useMemo(() => allGoals.filter((g) => g.status !== "completed"), [allGoals]);
  const addGoalEntry = useSungaStore((s) => s.addGoalEntry);

  const [goalId, setGoalId] = useState(params.get("goalId") ?? goals[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [location, setLocation] = useState<SavingsLocation>("cash");
  const [note, setNote] = useState("");

  const currency = profile?.currency ?? "ZMW";
  const symbol = CURRENCY_SYMBOLS[currency];
  const numericAmount = Number(amount) || 0;

  if (goals.length === 0) {
    return (
      <div>
        <ScreenHeader title="Savings" backHref="/add" />
        <ScreenBody className="flex flex-col items-center gap-4 pt-10 text-center">
          <Target size={40} className="text-sunga-orange" />
          <div>
            <p className="font-display text-lg font-semibold text-sunga-green">
              You don&apos;t have a goal yet
            </p>
            <p className="mt-1 text-sm text-sunga-muted">
              Create a savings goal first, then record deposits toward it.
            </p>
          </div>
          <PrimaryButton onClick={() => router.push("/goals/new")}>
            Create a goal
          </PrimaryButton>
        </ScreenBody>
      </div>
    );
  }

  function handleSubmit() {
    if (numericAmount <= 0 || !goalId) return;
    addGoalEntry({
      goalId,
      kind: "deposit",
      amount: numericAmount,
      location,
      date: todayISO(),
      note: note.trim() || undefined,
    });
    router.push(`/goals/${goalId}`);
  }

  return (
    <div>
      <ScreenHeader title="Savings" backHref="/add" />
      <ScreenBody>
        <div className="flex flex-col items-center gap-1 py-3">
          <div className="flex items-baseline gap-1 text-4xl font-semibold text-sunga-green">
            <span>{symbol}</span>
            <input
              autoFocus
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="0"
              className="w-40 bg-transparent text-center outline-none placeholder:text-sunga-muted/40"
            />
          </div>
          <p className="text-sm text-sunga-muted">Even {symbol}10 saved is progress</p>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-sunga-muted">Which goal?</p>
          <div className="space-y-2">
            {goals.map((g) => {
              const Icon = getIcon(g.icon);
              return (
                <button
                  key={g.id}
                  onClick={() => setGoalId(g.id)}
                  className={
                    "flex w-full items-center gap-3 rounded-xl border p-3 text-left " +
                    (goalId === g.id
                      ? "border-sunga-green bg-sunga-green-tint"
                      : "border-sunga-border bg-white")
                  }
                >
                  <Icon size={18} className="text-sunga-green" />
                  <span className="flex-1 font-medium text-sunga-green">{g.name}</span>
                  <span className="text-xs text-sunga-muted">
                    {symbol}
                    {g.savedAmount.toLocaleString()}
                    {g.targetAmount ? ` / ${symbol}${g.targetAmount.toLocaleString()}` : ""}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Card>
          <label className="block text-sm font-medium text-sunga-muted">
            Where is this money kept?
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

        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (optional)"
          className="w-full rounded-xl border border-sunga-border bg-white px-3.5 py-3 text-sm outline-none focus:border-sunga-green"
        />

        <PrimaryButton disabled={numericAmount <= 0 || !goalId} onClick={handleSubmit}>
          Record savings
        </PrimaryButton>
      </ScreenBody>
    </div>
  );
}

export default function AddSavingsPage() {
  return (
    <Suspense fallback={null}>
      <AddSavingsForm />
    </Suspense>
  );
}
