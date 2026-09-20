"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Wallet, ShoppingBag, Target, ArrowLeftRight } from "lucide-react";

const OPTIONS = [
  {
    href: "/add/income",
    title: "Money received",
    desc: "Salary, business, piecework or gift",
    icon: Wallet,
  },
  {
    href: "/add/expense",
    title: "Expense",
    desc: "Food, transport, bills or subscription",
    icon: ShoppingBag,
  },
  {
    href: "/add/savings",
    title: "Savings",
    desc: "Add to one of your goals",
    icon: Target,
    accent: true,
  },
  {
    href: "/add/transfer",
    title: "Transfer",
    desc: "Move money without counting it as spending",
    icon: ArrowLeftRight,
  },
];

export default function AddSheetPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100vh-2rem)] flex-col justify-end">
      <div className="rounded-t-3xl bg-sunga-card px-5 pb-8 pt-4 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-sunga-border" />
        <div className="mb-5 flex items-start justify-between">
          <h1 className="font-display text-2xl font-semibold leading-tight text-sunga-green">
            What would you like
            <br />
            to record?
          </h1>
          <button
            aria-label="Close"
            onClick={() => router.back()}
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-sunga-green"
          >
            <X size={22} />
          </button>
        </div>

        <div className="space-y-3">
          {OPTIONS.map((opt) => (
            <Link
              key={opt.href}
              href={opt.href}
              className="flex items-center gap-4 rounded-2xl border border-sunga-border bg-white p-4 transition active:scale-[0.99]"
            >
              <span
                className={
                  "flex h-11 w-11 flex-none items-center justify-center rounded-full " +
                  (opt.accent
                    ? "bg-orange-50 text-sunga-orange"
                    : "bg-sunga-green-tint text-sunga-green")
                }
              >
                <opt.icon size={20} />
              </span>
              <span>
                <span className="block font-display text-base font-semibold text-sunga-green">
                  {opt.title}
                </span>
                <span className="block text-sm text-sunga-muted">{opt.desc}</span>
              </span>
            </Link>
          ))}
        </div>

        <Link
          href="/add/expense?category=Other"
          className="mt-5 block text-center text-sm font-semibold text-sunga-green underline underline-offset-2"
        >
          Record something else
        </Link>
      </div>
    </div>
  );
}
