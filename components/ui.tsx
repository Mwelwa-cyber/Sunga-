"use client";

import Link from "next/link";
import clsx from "clsx";
import { ChevronLeft, LucideIcon } from "lucide-react";

export function ScreenHeader({
  title,
  backHref,
  right,
}: {
  title: string;
  backHref?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between bg-sunga-green px-5 pb-5 pt-6 text-sunga-cream">
      <div className="flex items-center gap-2">
        {backHref && (
          <Link
            href={backHref}
            aria-label="Back"
            className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-sunga-cream/90 active:bg-white/10"
          >
            <ChevronLeft size={22} />
          </Link>
        )}
        <h1 className="font-display text-xl font-semibold">{title}</h1>
      </div>
      {right}
    </div>
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-sunga-border bg-sunga-card p-4 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function PrimaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={clsx(
        "w-full rounded-full bg-sunga-orange px-5 py-3.5 text-center font-semibold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={clsx(
        "w-full rounded-full border border-sunga-green/30 bg-transparent px-5 py-3.5 text-center font-semibold text-sunga-green transition active:scale-[0.98]",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TipBanner({
  icon: Icon,
  children,
  tone = "green",
}: {
  icon?: LucideIcon;
  children: React.ReactNode;
  tone?: "green" | "orange";
}) {
  return (
    <div
      className={clsx(
        "flex items-start gap-3 rounded-2xl p-3.5 text-sm",
        tone === "green" ? "bg-sunga-green-tint text-sunga-green" : "bg-orange-50 text-sunga-orange-dark"
      )}
    >
      {Icon && (
        <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-white/70">
          <Icon size={16} />
        </span>
      )}
      <span>{children}</span>
    </div>
  );
}

export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-sunga-green-tint">
      <div
        className="h-full rounded-full bg-sunga-green transition-all"
        style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
      />
    </div>
  );
}

export function Chip({
  active,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      {...props}
      className={clsx(
        "rounded-full border px-4 py-2 text-sm font-medium transition",
        active
          ? "border-sunga-green bg-sunga-green text-white"
          : "border-sunga-border bg-white text-sunga-green",
        className
      )}
    >
      {children}
    </button>
  );
}

export function Stepper({
  value,
  onChange,
  step = 10,
  min = 0,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Decrease"
        onClick={() => onChange(Math.max(min, value - step))}
        className="flex h-7 w-7 items-center justify-center rounded-full border border-sunga-border text-sunga-green"
      >
        −
      </button>
      <span className="w-14 text-right font-semibold">{value}</span>
      <button
        type="button"
        aria-label="Increase"
        onClick={() => onChange(value + step)}
        className="flex h-7 w-7 items-center justify-center rounded-full border border-sunga-border text-sunga-green"
      >
        +
      </button>
    </div>
  );
}

export function ScreenBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={clsx("space-y-4 px-5 py-5", className)}>{children}</div>;
}
