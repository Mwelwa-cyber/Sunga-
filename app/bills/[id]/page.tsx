"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ScreenHeader,
  ScreenBody,
  PrimaryButton,
  SecondaryButton,
  Card,
  Chip,
  TipBanner,
} from "@/components/ui";
import { useSungaStore } from "@/lib/store";
import { BillFrequency, ExpensePriority } from "@/lib/types";
import { CURRENCY_SYMBOLS, formatMoney } from "@/lib/currency";
import { daysUntil, formatDueLabel, todayISO } from "@/lib/dates";
import { IconGlyph, BILL_CATEGORIES, BILL_CATEGORY_ICONS } from "@/lib/icons";
import { CheckCircle2 } from "lucide-react";

const FREQUENCIES: { value: BillFrequency; label: string }[] = [
  { value: "one_time", label: "One time" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const PRIORITIES: { value: ExpensePriority; label: string }[] = [
  { value: "must_pay", label: "Must pay" },
  { value: "important", label: "Important" },
  { value: "flexible", label: "Flexible" },
  { value: "optional", label: "Optional" },
];

export default function BillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const profile = useSungaStore((s) => s.profile);
  const bill = useSungaStore((s) => s.bills.find((b) => b.id === id));
  const updateBill = useSungaStore((s) => s.updateBill);
  const deleteBill = useSungaStore((s) => s.deleteBill);
  const markBillPaid = useSungaStore((s) => s.markBillPaid);

  const currency = profile?.currency ?? "ZMW";
  const symbol = CURRENCY_SYMBOLS[currency];

  const [name, setName] = useState(bill?.name ?? "");
  const [amount, setAmount] = useState(bill ? String(bill.amount) : "");
  const [category, setCategory] = useState(bill?.category ?? BILL_CATEGORIES[0]);
  const [priority, setPriority] = useState<ExpensePriority>(bill?.priority ?? "must_pay");
  const [frequency, setFrequency] = useState<BillFrequency>(bill?.frequency ?? "monthly");
  const [dueDate, setDueDate] = useState(bill?.dueDate ?? todayISO());

  if (!bill) {
    return (
      <div>
        <ScreenHeader title="Bill" backHref="/bills" />
        <ScreenBody>
          <p className="text-sm text-sunga-muted">This bill could not be found.</p>
        </ScreenBody>
      </div>
    );
  }

  const numericAmount = Number(amount) || 0;
  const overdue = daysUntil(bill.dueDate) < 0;

  function handleSave() {
    if (numericAmount <= 0 || !name.trim() || !dueDate) return;
    updateBill(bill!.id, {
      name: name.trim(),
      amount: numericAmount,
      category,
      priority,
      frequency,
      dueDate,
    });
    router.push("/bills");
  }

  function handleMarkPaid() {
    markBillPaid(bill!.id, todayISO());
    router.push("/bills");
  }

  function handleDelete() {
    if (typeof window !== "undefined" && !window.confirm(`Delete ${bill!.name}?`)) return;
    deleteBill(bill!.id);
    router.push("/bills");
  }

  return (
    <div>
      <ScreenHeader title={bill.name} backHref="/bills" />
      <ScreenBody>
        <TipBanner tone={overdue ? "orange" : "green"}>
          {formatDueLabel(bill.dueDate)} · {formatMoney(bill.amount, currency)}
          {bill.paidAt ? ` · last paid ${formatDueLabel(bill.paidAt).toLowerCase()}` : ""}
        </TipBanner>

        <PrimaryButton onClick={handleMarkPaid}>
          <span className="flex items-center justify-center gap-2">
            <CheckCircle2 size={18} />
            Mark as paid
          </span>
        </PrimaryButton>

        <Card>
          <label className="block text-sm font-medium text-sunga-muted">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-sunga-border bg-white px-3.5 py-3 text-base outline-none focus:border-sunga-green"
          />
        </Card>

        <div className="flex items-center gap-2 rounded-xl border border-sunga-border bg-white px-3.5 py-3">
          <span className="text-lg font-semibold text-sunga-green">{symbol}</span>
          <input
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            className="w-full bg-transparent text-base outline-none"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-sunga-muted">Category</p>
          <div className="grid grid-cols-4 gap-2">
            {BILL_CATEGORIES.map((c) => (
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
                <IconGlyph name={BILL_CATEGORY_ICONS[c]} size={18} />
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

        <div>
          <p className="mb-2 text-sm font-medium text-sunga-muted">How often?</p>
          <div className="flex flex-wrap gap-2">
            {FREQUENCIES.map((f) => (
              <Chip key={f.value} active={frequency === f.value} onClick={() => setFrequency(f.value)}>
                {f.label}
              </Chip>
            ))}
          </div>
        </div>

        <Card>
          <label className="block text-sm font-medium text-sunga-muted">
            {frequency === "one_time" ? "Due date" : "Next due date"}
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-2 w-full rounded-xl border border-sunga-border bg-white px-3.5 py-2.5 text-sm outline-none"
          />
        </Card>

        <PrimaryButton disabled={numericAmount <= 0 || !name.trim()} onClick={handleSave}>
          Save changes
        </PrimaryButton>
        <SecondaryButton onClick={handleDelete} className="border-sunga-danger text-sunga-danger">
          Delete bill
        </SecondaryButton>
      </ScreenBody>
    </div>
  );
}
