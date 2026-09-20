"use client";

import Link from "next/link";
import { ReceiptText } from "lucide-react";
import { useSungaStore, upcomingBills, paidBills } from "@/lib/store";
import { ScreenHeader, ScreenBody } from "@/components/ui";
import { IconGlyph, BILL_CATEGORY_ICONS } from "@/lib/icons";
import { formatMoney } from "@/lib/currency";
import { formatDueLabel, daysUntil } from "@/lib/dates";

export default function BillsPage() {
  const profile = useSungaStore((s) => s.profile);
  const bills = useSungaStore((s) => s.bills);

  const currency = profile?.currency ?? "ZMW";
  const upcoming = upcomingBills(bills);
  const paid = paidBills(bills);

  return (
    <div>
      <ScreenHeader title="Bills & subscriptions" backHref="/home" />
      <ScreenBody>
        {upcoming.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-sunga-border bg-white p-8 text-center">
            <ReceiptText size={32} className="text-sunga-orange" />
            <p className="font-display font-semibold text-sunga-green">
              No bills tracked yet
            </p>
            <p className="text-sm text-sunga-muted">
              Add rent, school fees or a subscription so Sunga can remind you before
              it&apos;s due.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-sunga-border rounded-2xl border border-sunga-border bg-white">
            {upcoming.map((b) => {
              const overdue = daysUntil(b.dueDate) < 0;
              return (
                <Link
                  key={b.id}
                  href={`/bills/${b.id}`}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-orange-50 text-sunga-orange">
                    <IconGlyph name={BILL_CATEGORY_ICONS[b.category] ?? "receipt"} size={18} />
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-sunga-green">{b.name}</p>
                    <p className={"text-xs " + (overdue ? "text-sunga-danger" : "text-sunga-orange")}>
                      {formatDueLabel(b.dueDate)}
                    </p>
                  </div>
                  <p className="font-semibold text-sunga-green">
                    {formatMoney(b.amount, currency)}
                  </p>
                </Link>
              );
            })}
          </div>
        )}

        <Link
          href="/bills/new"
          className="block w-full rounded-full bg-sunga-orange px-5 py-3.5 text-center font-semibold text-white shadow-sm transition active:scale-[0.98]"
        >
          + New bill or subscription
        </Link>

        {paid.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium text-sunga-muted">Paid</p>
            <div className="divide-y divide-sunga-border rounded-2xl border border-sunga-border bg-white opacity-70">
              {paid.map((b) => (
                <Link
                  key={b.id}
                  href={`/bills/${b.id}`}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-sunga-green-tint text-sunga-green">
                    <IconGlyph name={BILL_CATEGORY_ICONS[b.category] ?? "receipt"} size={18} />
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-sunga-green">{b.name}</p>
                    <p className="text-xs text-sunga-muted">Paid</p>
                  </div>
                  <p className="font-semibold text-sunga-green">
                    {formatMoney(b.amount, currency)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </ScreenBody>
    </div>
  );
}
