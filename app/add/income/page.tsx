"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ScreenHeader, ScreenBody, PrimaryButton, Chip } from "@/components/ui";
import { useSungaStore } from "@/lib/store";
import { IncomeFrequency, IncomeSource } from "@/lib/types";
import { CURRENCY_SYMBOLS } from "@/lib/currency";
import { todayISO, isoDaysAgo } from "@/lib/dates";
import { getIcon, INCOME_SOURCE_ICONS } from "@/lib/icons";

const SOURCES: { value: IncomeSource; label: string }[] = [
  { value: "salary", label: "Salary" },
  { value: "business", label: "Business" },
  { value: "piecework", label: "Piecework" },
  { value: "farming", label: "Farming" },
  { value: "gift", label: "Gift" },
  { value: "other", label: "Other" },
];

type WhenOption = "today" | "yesterday" | "this_week" | "custom";

export default function AddIncomePage() {
  const router = useRouter();
  const profile = useSungaStore((s) => s.profile);
  const addIncome = useSungaStore((s) => s.addIncome);

  const [amount, setAmount] = useState("");
  const [source, setSource] = useState<IncomeSource>("salary");
  const [frequency, setFrequency] = useState<IncomeFrequency>("one_time");
  const [when, setWhen] = useState<WhenOption>("today");
  const [customDate, setCustomDate] = useState(todayISO());

  const currency = profile?.currency ?? "ZMW";
  const symbol = CURRENCY_SYMBOLS[currency];
  const numericAmount = Number(amount) || 0;

  function resolveDate() {
    if (when === "today") return todayISO();
    if (when === "yesterday") return isoDaysAgo(1);
    if (when === "this_week") return isoDaysAgo(3);
    return customDate;
  }

  function handleSubmit() {
    if (numericAmount <= 0) return;
    addIncome({
      amount: numericAmount,
      source,
      frequency,
      date: resolveDate(),
    });
    router.push("/plan?from=income");
  }

  return (
    <div>
      <ScreenHeader title="Money received" backHref="/add" />
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
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-sunga-muted">
            What type of income is this?
          </p>
          <div className="grid grid-cols-3 gap-2">
            {SOURCES.map((s) => {
              const Icon = getIcon(INCOME_SOURCE_ICONS[s.value]);
              return (
                <button
                  key={s.value}
                  onClick={() => setSource(s.value)}
                  className={
                    "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium " +
                    (source === s.value
                      ? "border-sunga-green bg-sunga-green-tint text-sunga-green"
                      : "border-sunga-border bg-white text-sunga-green")
                  }
                >
                  <Icon size={20} />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-sunga-muted">
            How often do you receive it?
          </p>
          <div className="flex gap-2">
            <Chip active={frequency === "one_time"} onClick={() => setFrequency("one_time")}>
              One time
            </Chip>
            <Chip active={frequency === "regular"} onClick={() => setFrequency("regular")}>
              Regular
            </Chip>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-sunga-muted">
            When did you receive it?
          </p>
          <div className="grid grid-cols-4 gap-2">
            {(
              [
                ["today", "Today"],
                ["yesterday", "Yesterday"],
                ["this_week", "This week"],
                ["custom", "Custom"],
              ] as [WhenOption, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setWhen(value)}
                className={
                  "rounded-xl border px-1 py-2.5 text-xs font-medium " +
                  (when === value
                    ? "border-sunga-green bg-sunga-green-tint text-sunga-green"
                    : "border-sunga-border bg-white text-sunga-green")
                }
              >
                {label}
              </button>
            ))}
          </div>
          {when === "custom" && (
            <input
              type="date"
              value={customDate}
              max={todayISO()}
              onChange={(e) => setCustomDate(e.target.value)}
              className="mt-2 w-full rounded-xl border border-sunga-border bg-white px-3.5 py-2.5 text-sm outline-none"
            />
          )}
        </div>

        <p className="flex items-center gap-1.5 text-sm text-sunga-muted">
          Every amount counts.
        </p>

        <PrimaryButton disabled={numericAmount <= 0} onClick={handleSubmit}>
          Plan this money
        </PrimaryButton>
      </ScreenBody>
    </div>
  );
}
