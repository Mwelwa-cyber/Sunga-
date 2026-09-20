"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ScreenHeader, ScreenBody, PrimaryButton, SecondaryButton, Card, Chip } from "@/components/ui";
import { useSungaStore, EXPENSE_CATEGORIES } from "@/lib/store";
import {
  ExpensePriority,
  IncomeFrequency,
  IncomeSource,
  SavingsLocation,
} from "@/lib/types";
import { CURRENCY_SYMBOLS } from "@/lib/currency";
import { IconGlyph, EXPENSE_CATEGORY_ICONS, INCOME_SOURCE_ICONS } from "@/lib/icons";

const INCOME_SOURCES: { value: IncomeSource; label: string }[] = [
  { value: "salary", label: "Salary" },
  { value: "business", label: "Business" },
  { value: "piecework", label: "Piecework" },
  { value: "farming", label: "Farming" },
  { value: "gift", label: "Gift" },
  { value: "rental", label: "Rental" },
  { value: "other", label: "Other" },
];

const PRIORITIES: { value: ExpensePriority; label: string }[] = [
  { value: "must_pay", label: "Must pay" },
  { value: "important", label: "Important" },
  { value: "flexible", label: "Flexible" },
  { value: "optional", label: "Optional" },
];

const LOCATIONS: { value: SavingsLocation; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "mobile_money", label: "Mobile money" },
  { value: "bank", label: "Bank" },
  { value: "chilimba", label: "Chilimba / village bank" },
  { value: "trusted_person", label: "Trusted person" },
  { value: "other", label: "Other" },
];

export default function EditTransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const profile = useSungaStore((s) => s.profile);
  const transaction = useSungaStore((s) => s.transactions.find((t) => t.id === id));
  const updateTransaction = useSungaStore((s) => s.updateTransaction);
  const deleteTransaction = useSungaStore((s) => s.deleteTransaction);

  const currency = profile?.currency ?? "ZMW";
  const symbol = CURRENCY_SYMBOLS[currency];

  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : "");
  const [date, setDate] = useState(transaction?.date.slice(0, 10) ?? "");
  const [note, setNote] = useState(transaction?.note ?? "");

  const [source, setSource] = useState<IncomeSource>(
    transaction?.type === "income" ? transaction.source : "salary"
  );
  const [frequency, setFrequency] = useState<IncomeFrequency>(
    transaction?.type === "income" ? transaction.frequency : "one_time"
  );

  const [category, setCategory] = useState(
    transaction?.type === "expense" ? transaction.category : EXPENSE_CATEGORIES[0]
  );
  const [priority, setPriority] = useState<ExpensePriority>(
    transaction?.type === "expense" ? transaction.priority : "flexible"
  );

  const [from, setFrom] = useState<SavingsLocation>(
    transaction?.type === "transfer" ? transaction.from : "mobile_money"
  );
  const [to, setTo] = useState<SavingsLocation>(
    transaction?.type === "transfer" ? transaction.to : "bank"
  );

  if (!transaction) {
    return (
      <div>
        <ScreenHeader title="Transaction" backHref="/transactions" />
        <ScreenBody>
          <p className="text-sm text-sunga-muted">This transaction could not be found.</p>
        </ScreenBody>
      </div>
    );
  }

  const numericAmount = Number(amount) || 0;

  function handleSave() {
    if (numericAmount <= 0 || !date) return;
    if (transaction!.type === "income") {
      updateTransaction(transaction!.id, {
        amount: numericAmount,
        source,
        frequency,
        date,
        note: note.trim() || undefined,
      });
    } else if (transaction!.type === "expense") {
      updateTransaction(transaction!.id, {
        amount: numericAmount,
        category,
        priority,
        date,
        note: note.trim() || undefined,
      });
    } else {
      updateTransaction(transaction!.id, {
        amount: numericAmount,
        from,
        to,
        date,
        note: note.trim() || undefined,
      });
    }
    router.push("/transactions");
  }

  function handleDelete() {
    if (typeof window !== "undefined" && !window.confirm("Delete this record?")) return;
    deleteTransaction(transaction!.id);
    router.push("/transactions");
  }

  const title =
    transaction.type === "income" ? "Money received" : transaction.type === "expense" ? "Expense" : "Transfer";

  return (
    <div>
      <ScreenHeader title={title} backHref="/transactions" />
      <ScreenBody>
        <div className="flex flex-col items-center gap-1 py-3">
          <div className="flex items-baseline gap-1 text-4xl font-semibold text-sunga-green">
            <span>{symbol}</span>
            <input
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              className="w-40 bg-transparent text-center outline-none"
            />
          </div>
        </div>

        {transaction.type === "income" && (
          <>
            <div>
              <p className="mb-2 text-sm font-medium text-sunga-muted">Type of income</p>
              <div className="grid grid-cols-4 gap-2">
                {INCOME_SOURCES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSource(s.value)}
                    className={
                      "flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-[11px] font-medium " +
                      (source === s.value
                        ? "border-sunga-green bg-sunga-green-tint text-sunga-green"
                        : "border-sunga-border bg-white text-sunga-green")
                    }
                  >
                    <IconGlyph name={INCOME_SOURCE_ICONS[s.value]} size={18} />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-sunga-muted">Frequency</p>
              <div className="flex gap-2">
                <Chip active={frequency === "one_time"} onClick={() => setFrequency("one_time")}>
                  One time
                </Chip>
                <Chip active={frequency === "regular"} onClick={() => setFrequency("regular")}>
                  Regular
                </Chip>
              </div>
            </div>
          </>
        )}

        {transaction.type === "expense" && (
          <>
            <div>
              <p className="mb-2 text-sm font-medium text-sunga-muted">Category</p>
              <div className="grid grid-cols-4 gap-2">
                {EXPENSE_CATEGORIES.map((c) => (
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
                    <IconGlyph name={EXPENSE_CATEGORY_ICONS[c]} size={18} />
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-sunga-muted">Priority</p>
              <div className="flex flex-wrap gap-2">
                {PRIORITIES.map((p) => (
                  <Chip key={p.value} active={priority === p.value} onClick={() => setPriority(p.value)}>
                    {p.label}
                  </Chip>
                ))}
              </div>
            </div>
          </>
        )}

        {transaction.type === "transfer" && (
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
        )}

        <Card>
          <label className="block text-sm font-medium text-sunga-muted">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 w-full rounded-xl border border-sunga-border bg-white px-3.5 py-2.5 text-sm outline-none"
          />
        </Card>

        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (optional)"
          className="w-full rounded-xl border border-sunga-border bg-white px-3.5 py-3 text-sm outline-none focus:border-sunga-green"
        />

        <PrimaryButton disabled={numericAmount <= 0 || !date} onClick={handleSave}>
          Save changes
        </PrimaryButton>
        <SecondaryButton onClick={handleDelete} className="border-sunga-danger text-sunga-danger">
          Delete record
        </SecondaryButton>
      </ScreenBody>
    </div>
  );
}
