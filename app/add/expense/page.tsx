"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ScreenHeader, ScreenBody, PrimaryButton, Chip } from "@/components/ui";
import { useSungaStore, EXPENSE_CATEGORIES } from "@/lib/store";
import { ExpensePriority } from "@/lib/types";
import { CURRENCY_SYMBOLS } from "@/lib/currency";
import { todayISO, isoDaysAgo } from "@/lib/dates";
import { cleanMoneyInput, parseMoney } from "@/lib/money";
import { getIcon, EXPENSE_CATEGORY_ICONS } from "@/lib/icons";

const PRIORITIES: { value: ExpensePriority; label: string; hint: string }[] = [
  { value: "must_pay", label: "Must pay", hint: "Essential or contractually due" },
  { value: "important", label: "Important", hint: "Fund where possible" },
  { value: "flexible", label: "Flexible", hint: "Amount or timing can change" },
  { value: "optional", label: "Optional", hint: "Candidate to reduce or pause" },
];

function AddExpenseForm() {
  const router = useRouter();
  const params = useSearchParams();
  const profile = useSungaStore((s) => s.profile);
  const addExpense = useSungaStore((s) => s.addExpense);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(params.get("category") ?? "Food");
  const [priority, setPriority] = useState<ExpensePriority>("flexible");
  const [when, setWhen] = useState<"today" | "yesterday">("today");
  const [note, setNote] = useState("");

  const currency = profile?.currency ?? "ZMW";
  const symbol = CURRENCY_SYMBOLS[currency];
  const numericAmount = parseMoney(amount) ?? 0;

  function handleSubmit() {
    if (numericAmount <= 0) return;
    addExpense({
      amount: numericAmount,
      category,
      priority,
      date: when === "today" ? todayISO() : isoDaysAgo(1),
      note: note.trim() || undefined,
    });
    router.push("/track");
  }

  return (
    <div>
      <ScreenHeader title="Expense" backHref="/add" />
      <ScreenBody>
        <div className="flex flex-col items-center gap-1 py-3">
          <div className="flex items-baseline gap-1 text-4xl font-semibold text-sunga-green">
            <span>{symbol}</span>
            <input
              autoFocus
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(cleanMoneyInput(e.target.value))}
              placeholder="0"
              className="w-40 bg-transparent text-center outline-none placeholder:text-sunga-muted/40"
            />
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-sunga-muted">Category</p>
          <div className="grid grid-cols-4 gap-2">
            {EXPENSE_CATEGORIES.map((c) => {
              const Icon = getIcon(EXPENSE_CATEGORY_ICONS[c]);
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={
                    "flex flex-col items-center gap-1 rounded-xl border p-2.5 text-[11px] font-medium " +
                    (category === c
                      ? "border-sunga-green bg-sunga-green-tint text-sunga-green"
                      : "border-sunga-border bg-white text-sunga-green")
                  }
                >
                  <Icon size={18} />
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-sunga-muted">Priority</p>
          <div className="space-y-2">
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                onClick={() => setPriority(p.value)}
                className={
                  "flex w-full items-center justify-between rounded-xl border p-3 text-left " +
                  (priority === p.value
                    ? "border-sunga-green bg-sunga-green-tint"
                    : "border-sunga-border bg-white")
                }
              >
                <span>
                  <span className="block text-sm font-semibold text-sunga-green">
                    {p.label}
                  </span>
                  <span className="block text-xs text-sunga-muted">{p.hint}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-sunga-muted">When?</p>
          <div className="flex gap-2">
            <Chip active={when === "today"} onClick={() => setWhen("today")}>
              Today
            </Chip>
            <Chip active={when === "yesterday"} onClick={() => setWhen("yesterday")}>
              Yesterday
            </Chip>
          </div>
        </div>

        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (optional)"
          className="w-full rounded-xl border border-sunga-border bg-white px-3.5 py-3 text-sm outline-none focus:border-sunga-green"
        />

        <PrimaryButton disabled={numericAmount <= 0} onClick={handleSubmit}>
          Save expense
        </PrimaryButton>
      </ScreenBody>
    </div>
  );
}

export default function AddExpensePage() {
  return (
    <Suspense fallback={null}>
      <AddExpenseForm />
    </Suspense>
  );
}
