# Sunga

Every kwacha has a purpose.

Sunga is an inclusive budgeting, savings and money-tracking companion built in
Zambia, designed for Africa. It treats small and irregular income as
first-class, never claims a plan is affordable without data to back it up, and
never holds, transfers or invests a user's money — it is a tracker and
adviser, not a wallet or bank.

This repository contains the web app for **Phase 1 of the product concept**
(see `docs/Sunga_Complete_Product_Concept.docx` for the full spec): the personal
"My Money" tracker, covering onboarding, income/expense recording, savings
goals, budgeting/planning, daily spend tracking and insights. Family spaces,
child/teen profiles, receipts/voice/SMS entry, and financial-custody features
are out of scope for this slice and described in later phases of the concept
document.

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Zustand (with `persist` to `localStorage`) for local state — no backend
  required for this pilot
- Recharts for the weekly spending chart
- lucide-react for icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app is designed
mobile-first (max-width phone frame, centered on wider screens).

Other scripts:

```bash
npm run build   # production build
npm run lint    # eslint
```

## What's implemented

- Onboarding: welcome, currency/name/tracking-mode setup, first-record CTA
- Home dashboard: money available, needs/goals/free split from the latest
  plan, top goal progress, week-over-week savings comparison
- Add flow: money received, expense, savings deposit, transfer
- Plan: envelope-style allocation of available money into needs/goals/free
  categories, with an honest note when there isn't enough income/expense
  data yet to judge affordability
- Goals: list, creation, detail view with milestones, quick-add deposits,
  history and pause/resume
- Track: daily spending limit estimate, today's expenses, quick-add
  categories
- Insights: month overview (saved/planned/spent), weekly spending chart,
  saving streak, goals recap
- Bills & subscriptions: recurring/one-time bills with due dates and
  priority, a "coming up" list on Home, a must-pay reminder on Plan, and
  "mark as paid" (which records an expense and rolls recurring bills to
  their next due date)
- Transaction history and editing: every income/expense/transfer is
  editable and deletable (amount, category/source, priority, date, note)
  from `/transactions`
- Local-first Chilimba pilot: groups, members, contribution cycles,
  paid/pending status, payout records, WhatsApp-friendly statements and CSV
  export
- Encrypted backup export and restore using a user-supplied passphrase
- Installable PWA shell that caches visited app pages for offline return visits

All live data is stored locally in the browser (`localStorage`) — there is no
backend yet. Live browser storage is not encrypted, so this build is a pilot
and should not be used on shared devices. Clearing site data resets the app;
users should export an encrypted backup from **Data & privacy** first.

## Product principles this build follows

- **Every amount counts.** Small deposits and irregular income are
  first-class, not edge cases.
- **Honest limitations.** If income and expenses haven't been recorded,
  Sunga says so instead of pretending a savings plan is confirmed affordable.
- **Advice, not control.** Nothing is ever moved, cancelled or changed
  automatically.
- **Sunga does not hold money.** This is stated in the UI. “Transfer,”
  “contribution,” and “payout” actions only create records; no payment API is
  connected.

## Quality checks

```bash
npm run lint
npm test
npm run build
```
