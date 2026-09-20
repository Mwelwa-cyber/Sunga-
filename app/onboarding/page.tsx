"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wordmark, Logo } from "@/components/Logo";
import { PrimaryButton, SecondaryButton, ScreenBody, Card } from "@/components/ui";
import { useSungaStore } from "@/lib/store";
import { CurrencyCode, TrackingMode } from "@/lib/types";
import { CURRENCY_LABELS, CURRENCY_SYMBOLS } from "@/lib/currency";
import { HeartHandshake, Wallet, ListChecks, Target } from "lucide-react";
import clsx from "clsx";

const CURRENCIES: CurrencyCode[] = ["ZMW", "USD", "ZAR"];

const MODES: { value: TrackingMode; title: string; desc: string; icon: typeof Wallet }[] = [
  {
    value: "savings",
    title: "Savings only",
    desc: "Track goals, deposits and withdrawals. No income questions required.",
    icon: Target,
  },
  {
    value: "expense",
    title: "Expense tracker",
    desc: "Record spending, bills and subscriptions with categories and trends.",
    icon: ListChecks,
  },
  {
    value: "full",
    title: "Full money plan",
    desc: "Income, expenses, bills and savings together with cash-flow planning.",
    icon: Wallet,
  },
];

type Step = "welcome" | "setup" | "first-record";

export default function OnboardingPage() {
  const router = useRouter();
  const completeOnboarding = useSungaStore((s) => s.completeOnboarding);

  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("ZMW");
  const [mode, setMode] = useState<TrackingMode>("full");

  if (step === "welcome") {
    return (
      <ScreenBody className="flex min-h-[calc(100vh-2rem)] flex-col justify-between py-10">
        <div />
        <div className="flex flex-col items-center gap-6 text-center">
          <Logo size={72} />
          <div>
            <h1 className="font-display text-3xl font-semibold leading-tight text-sunga-green">
              Every kwacha
              <br />
              has a purpose.
            </h1>
            <p className="mt-3 text-sunga-muted">
              Plan what you have. Save at your own pace.
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <PrimaryButton onClick={() => setStep("setup")}>Get started</PrimaryButton>
          <SecondaryButton onClick={() => setStep("setup")}>
            I already have an account
          </SecondaryButton>
          <p className="flex items-center justify-center gap-1.5 pt-2 text-sm text-sunga-muted">
            <HeartHandshake size={16} className="text-sunga-orange" />
            Built for real life in Zambia.
          </p>
        </div>
      </ScreenBody>
    );
  }

  if (step === "setup") {
    return (
      <ScreenBody>
        <Wordmark />
        <div>
          <h2 className="font-display text-xl font-semibold">Let&apos;s set things up</h2>
          <p className="mt-1 text-sm text-sunga-muted">
            This takes less than a minute. You can change any of this later.
          </p>
        </div>

        <Card>
          <label className="block text-sm font-medium text-sunga-muted">
            What should we call you?
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="mt-2 w-full rounded-xl border border-sunga-border bg-white px-3.5 py-3 text-base outline-none focus:border-sunga-green"
          />
        </Card>

        <Card>
          <label className="block text-sm font-medium text-sunga-muted">
            Home currency
          </label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {CURRENCIES.map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={clsx(
                  "rounded-xl border px-2 py-2.5 text-sm font-semibold transition",
                  currency === c
                    ? "border-sunga-green bg-sunga-green text-white"
                    : "border-sunga-border bg-white text-sunga-green"
                )}
              >
                {CURRENCY_SYMBOLS[c]} {c}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-sunga-muted">
            {CURRENCY_LABELS[currency]}. Zambia suggests ZMW, but it&apos;s never forced.
          </p>
        </Card>

        <Card className="space-y-3">
          <label className="block text-sm font-medium text-sunga-muted">
            How do you want to use Sunga?
          </label>
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={clsx(
                "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition",
                mode === m.value
                  ? "border-sunga-green bg-sunga-green-tint"
                  : "border-sunga-border bg-white"
              )}
            >
              <m.icon size={20} className="mt-0.5 flex-none text-sunga-green" />
              <span>
                <span className="block font-semibold text-sunga-green">{m.title}</span>
                <span className="block text-sm text-sunga-muted">{m.desc}</span>
              </span>
            </button>
          ))}
        </Card>

        <PrimaryButton
          disabled={!name.trim()}
          onClick={() => {
            completeOnboarding({ name: name.trim(), currency, trackingMode: mode });
            setStep("first-record");
          }}
        >
          Continue
        </PrimaryButton>
      </ScreenBody>
    );
  }

  return (
    <ScreenBody className="flex min-h-[calc(100vh-2rem)] flex-col justify-center gap-4 py-10">
      <div className="text-center">
        <h2 className="font-display text-2xl font-semibold text-sunga-green">
          Nice to meet you, {name.trim().split(" ")[0]}.
        </h2>
        <p className="mt-2 text-sunga-muted">
          Let&apos;s record your first thing. Every amount counts.
        </p>
      </div>

      <div className="space-y-3">
        <SecondaryButton onClick={() => router.push("/add/income")}>
          Record money received
        </SecondaryButton>
        <SecondaryButton onClick={() => router.push("/add/expense")}>
          Record an expense
        </SecondaryButton>
        <SecondaryButton onClick={() => router.push("/goals/new")}>
          Create a savings goal
        </SecondaryButton>
      </div>

      <button
        onClick={() => router.push("/home")}
        className="pt-2 text-center text-sm font-medium text-sunga-muted underline underline-offset-2"
      >
        Skip for now
      </button>
    </ScreenBody>
  );
}
