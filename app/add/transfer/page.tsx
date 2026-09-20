"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ScreenHeader, ScreenBody, PrimaryButton, Card, TipBanner } from "@/components/ui";
import { useSungaStore } from "@/lib/store";
import { SavingsLocation } from "@/lib/types";
import { CURRENCY_SYMBOLS } from "@/lib/currency";
import { todayISO } from "@/lib/dates";
import { ArrowLeftRight } from "lucide-react";

const LOCATIONS: { value: SavingsLocation; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "mobile_money", label: "Mobile money" },
  { value: "bank", label: "Bank" },
  { value: "chilimba", label: "Chilimba / village bank" },
  { value: "trusted_person", label: "Trusted person" },
  { value: "other", label: "Other" },
];

export default function AddTransferPage() {
  const router = useRouter();
  const profile = useSungaStore((s) => s.profile);
  const addTransfer = useSungaStore((s) => s.addTransfer);

  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState<SavingsLocation>("mobile_money");
  const [to, setTo] = useState<SavingsLocation>("bank");
  const [note, setNote] = useState("");

  const currency = profile?.currency ?? "ZMW";
  const symbol = CURRENCY_SYMBOLS[currency];
  const numericAmount = Number(amount) || 0;

  function handleSubmit() {
    if (numericAmount <= 0) return;
    addTransfer({
      amount: numericAmount,
      from,
      to,
      date: todayISO(),
      note: note.trim() || undefined,
    });
    router.push("/home");
  }

  return (
    <div>
      <ScreenHeader title="Transfer" backHref="/add" />
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

        <Card className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-sunga-muted">From</label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value as SavingsLocation)}
              className="mt-2 w-full rounded-xl border border-sunga-border bg-white px-3.5 py-3 text-sm outline-none"
            >
              {LOCATIONS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-center text-sunga-muted">
            <ArrowLeftRight size={18} />
          </div>
          <div>
            <label className="block text-sm font-medium text-sunga-muted">To</label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value as SavingsLocation)}
              className="mt-2 w-full rounded-xl border border-sunga-border bg-white px-3.5 py-3 text-sm outline-none"
            >
              {LOCATIONS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </Card>

        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (optional)"
          className="w-full rounded-xl border border-sunga-border bg-white px-3.5 py-3 text-sm outline-none focus:border-sunga-green"
        />

        <TipBanner>
          Moving money between cash, mobile money, a bank or a savings location is not
          counted as an expense.
        </TipBanner>

        <PrimaryButton disabled={numericAmount <= 0} onClick={handleSubmit}>
          Record transfer
        </PrimaryButton>
      </ScreenBody>
    </div>
  );
}
