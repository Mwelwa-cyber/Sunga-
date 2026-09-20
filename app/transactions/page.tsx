"use client";

import { useMemo } from "react";
import Link from "next/link";
import { History, ArrowLeftRight } from "lucide-react";
import { useSungaStore } from "@/lib/store";
import { ScreenHeader, ScreenBody } from "@/components/ui";
import { formatMoney } from "@/lib/currency";
import { formatDateLabel } from "@/lib/dates";
import { IconGlyph, EXPENSE_CATEGORY_ICONS, INCOME_SOURCE_ICONS } from "@/lib/icons";
import { Transaction } from "@/lib/types";

function transactionIcon(t: Transaction) {
  if (t.type === "income") return INCOME_SOURCE_ICONS[t.source] ?? "dots";
  if (t.type === "expense") return EXPENSE_CATEGORY_ICONS[t.category] ?? "dots";
  return "target";
}

function transactionLabel(t: Transaction) {
  if (t.type === "income") return t.note || "Income";
  if (t.type === "expense") return t.category;
  return `${t.from.replace("_", " ")} → ${t.to.replace("_", " ")}`;
}

export default function TransactionsPage() {
  const profile = useSungaStore((s) => s.profile);
  const transactions = useSungaStore((s) => s.transactions);
  const currency = profile?.currency ?? "ZMW";

  const groups = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1));
    const map = new Map<string, Transaction[]>();
    for (const t of sorted) {
      const label = formatDateLabel(t.date);
      map.set(label, [...(map.get(label) ?? []), t]);
    }
    return Array.from(map.entries());
  }, [transactions]);

  return (
    <div>
      <ScreenHeader title="All transactions" backHref="/track" />
      <ScreenBody>
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-sunga-border bg-white p-8 text-center">
            <History size={32} className="text-sunga-orange" />
            <p className="font-display font-semibold text-sunga-green">
              Nothing recorded yet
            </p>
            <p className="text-sm text-sunga-muted">
              Income, expenses and transfers you record will show up here.
            </p>
          </div>
        ) : (
          groups.map(([label, items]) => (
            <div key={label}>
              <p className="mb-2 text-sm font-medium text-sunga-muted">{label}</p>
              <div className="divide-y divide-sunga-border rounded-2xl border border-sunga-border bg-white">
                {items.map((t) => (
                  <Link
                    key={t.id}
                    href={`/transactions/${t.id}`}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-sunga-green-tint text-sunga-green">
                      {t.type === "transfer" ? (
                        <ArrowLeftRight size={16} />
                      ) : (
                        <IconGlyph name={transactionIcon(t)} size={16} />
                      )}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium capitalize text-sunga-green">
                        {transactionLabel(t)}
                      </p>
                      <p className="text-xs capitalize text-sunga-muted">{t.type}</p>
                    </div>
                    <p
                      className={
                        "font-semibold " +
                        (t.type === "income"
                          ? "text-sunga-green"
                          : t.type === "expense"
                          ? "text-sunga-danger"
                          : "text-sunga-muted")
                      }
                    >
                      {t.type === "income" ? "+" : t.type === "expense" ? "-" : ""}
                      {formatMoney(t.amount, currency)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </ScreenBody>
    </div>
  );
}
