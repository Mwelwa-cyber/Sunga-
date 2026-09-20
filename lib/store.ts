import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createId } from "./id";
import { isSameMonth, startOfWeek, todayISO, WEEKDAY_LABELS } from "./dates";
import {
  CurrencyCode,
  ExpensePriority,
  Goal,
  GoalDeposit,
  GoalPriority,
  IncomeFrequency,
  IncomeSource,
  Plan,
  PlanCategory,
  Profile,
  SavingsLocation,
  Transaction,
  TrackingMode,
} from "./types";

export const DEFAULT_PLAN_CATEGORIES: Omit<PlanCategory, "id" | "amount">[] = [
  { name: "Food", icon: "utensils", bucket: "needs" },
  { name: "Transport", icon: "bus", bucket: "needs" },
  { name: "School fees", icon: "graduation-cap", bucket: "needs" },
  { name: "Emergency", icon: "shield", bucket: "needs" },
  { name: "Savings goals", icon: "target", bucket: "goals" },
  { name: "Other", icon: "dots", bucket: "free" },
];

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Airtime",
  "Shopping",
  "Health",
  "Other",
];

interface SungaState {
  profile: Profile | null;
  transactions: Transaction[];
  goals: Goal[];
  goalEntries: GoalDeposit[];
  plans: Plan[];
  hydrated: boolean;

  setHydrated: () => void;
  completeOnboarding: (input: {
    name: string;
    currency: CurrencyCode;
    trackingMode: TrackingMode;
  }) => void;

  addIncome: (input: {
    amount: number;
    source: IncomeSource;
    frequency: IncomeFrequency;
    date: string;
    note?: string;
  }) => void;

  addExpense: (input: {
    amount: number;
    category: string;
    priority: ExpensePriority;
    date: string;
    note?: string;
  }) => void;

  addTransfer: (input: {
    amount: number;
    from: SavingsLocation;
    to: SavingsLocation;
    date: string;
    note?: string;
  }) => void;

  addGoal: (input: {
    name: string;
    icon: string;
    purpose: string;
    targetAmount: number | null;
    targetDate: string | null;
    priority: GoalPriority;
    contributionMethod: Goal["contributionMethod"];
    location: SavingsLocation;
    startingSaved?: number;
  }) => string;

  addGoalEntry: (input: {
    goalId: string;
    kind: "deposit" | "withdrawal";
    amount: number;
    location: SavingsLocation;
    date: string;
    note?: string;
  }) => void;

  updateGoalStatus: (goalId: string, status: Goal["status"]) => void;
  updateGoalTarget: (
    goalId: string,
    updates: Partial<Pick<Goal, "targetAmount" | "targetDate" | "priority">>
  ) => void;

  savePlan: (categories: PlanCategory[]) => void;
}

const initialProfile: Profile | null = null;

export const useSungaStore = create<SungaState>()(
  persist(
    (set, get) => ({
      profile: initialProfile,
      transactions: [],
      goals: [],
      goalEntries: [],
      plans: [],
      hydrated: false,

      setHydrated: () => set({ hydrated: true }),

      completeOnboarding: ({ name, currency, trackingMode }) =>
        set({
          profile: {
            name,
            currency,
            trackingMode,
            country: "Zambia",
            onboarded: true,
            createdAt: new Date().toISOString(),
          },
        }),

      addIncome: ({ amount, source, frequency, date, note }) => {
        const currency = get().profile?.currency ?? "ZMW";
        const tx: Transaction = {
          id: createId("txn"),
          type: "income",
          amount,
          currency,
          source,
          frequency,
          date,
          note,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ transactions: [tx, ...state.transactions] }));
      },

      addExpense: ({ amount, category, priority, date, note }) => {
        const currency = get().profile?.currency ?? "ZMW";
        const tx: Transaction = {
          id: createId("txn"),
          type: "expense",
          amount,
          currency,
          category,
          priority,
          date,
          note,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ transactions: [tx, ...state.transactions] }));
      },

      addTransfer: ({ amount, from, to, date, note }) => {
        const currency = get().profile?.currency ?? "ZMW";
        const tx: Transaction = {
          id: createId("txn"),
          type: "transfer",
          amount,
          currency,
          from,
          to,
          date,
          note,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ transactions: [tx, ...state.transactions] }));
      },

      addGoal: ({
        name,
        icon,
        purpose,
        targetAmount,
        targetDate,
        priority,
        contributionMethod,
        location,
        startingSaved,
      }) => {
        const id = createId("goal");
        const goal: Goal = {
          id,
          name,
          icon,
          purpose,
          targetAmount,
          savedAmount: startingSaved ?? 0,
          targetDate,
          priority,
          contributionMethod,
          location,
          status: "active",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ goals: [goal, ...state.goals] }));
        return id;
      },

      addGoalEntry: ({ goalId, kind, amount, location, date, note }) => {
        const entry: GoalDeposit = {
          id: createId("entry"),
          goalId,
          kind,
          amount,
          location,
          date,
          note,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          goalEntries: [entry, ...state.goalEntries],
          goals: state.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  savedAmount: Math.max(
                    0,
                    g.savedAmount + (kind === "deposit" ? amount : -amount)
                  ),
                }
              : g
          ),
        }));
      },

      updateGoalStatus: (goalId, status) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === goalId ? { ...g, status } : g)),
        })),

      updateGoalTarget: (goalId, updates) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === goalId ? { ...g, ...updates } : g)),
        })),

      savePlan: (categories) => {
        const total = categories.reduce((sum, c) => sum + c.amount, 0);
        const plan: Plan = {
          id: createId("plan"),
          total,
          categories,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ plans: [...state.plans, plan] }));
      },
    }),
    {
      name: "sunga-store",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        profile: state.profile,
        transactions: state.transactions,
        goals: state.goals,
        goalEntries: state.goalEntries,
        plans: state.plans,
      }),
    }
  )
);

export function makeDefaultPlanCategories(): PlanCategory[] {
  return DEFAULT_PLAN_CATEGORIES.map((c) => ({
    ...c,
    id: createId("cat"),
    amount: 0,
  }));
}

// ---- Derived selectors (pure functions over state snapshots) ----

export function totalReceivedIncome(transactions: Transaction[]) {
  return transactions
    .filter((t): t is Extract<Transaction, { type: "income" }> => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function totalExpenses(transactions: Transaction[]) {
  return transactions
    .filter((t): t is Extract<Transaction, { type: "expense" }> => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function netSavingsContributions(goalEntries: GoalDeposit[]) {
  return goalEntries.reduce(
    (sum, e) => sum + (e.kind === "deposit" ? e.amount : -e.amount),
    0
  );
}

export function moneyAvailable(
  transactions: Transaction[],
  goalEntries: GoalDeposit[]
) {
  return (
    totalReceivedIncome(transactions) -
    totalExpenses(transactions) -
    netSavingsContributions(goalEntries)
  );
}

export function hasFinancialData(transactions: Transaction[]) {
  return transactions.some((t) => t.type === "income" || t.type === "expense");
}

export function latestPlan(plans: Plan[]): Plan | null {
  return plans.length ? plans[plans.length - 1] : null;
}

export function planBucketTotals(plan: Plan | null) {
  const totals = { needs: 0, goals: 0, free: 0 };
  if (!plan) return totals;
  for (const c of plan.categories) {
    totals[c.bucket] += c.amount;
  }
  return totals;
}

export function goalProgress(goal: Goal) {
  if (!goal.targetAmount || goal.targetAmount <= 0) return null;
  return Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
}

export function todaysExpenseTotal(transactions: Transaction[], todayIso: string) {
  return transactions
    .filter(
      (t): t is Extract<Transaction, { type: "expense" }> =>
        t.type === "expense" && t.date.slice(0, 10) === todayIso.slice(0, 10)
    )
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getTodayIsoSafe() {
  return todayISO();
}

export function weeklySavingsComparison(goalEntries: GoalDeposit[]) {
  const now = new Date();
  const startOfThisWeek = new Date(now);
  const day = (startOfThisWeek.getDay() + 6) % 7;
  startOfThisWeek.setDate(startOfThisWeek.getDate() - day);
  startOfThisWeek.setHours(0, 0, 0, 0);

  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

  let thisWeek = 0;
  let lastWeek = 0;
  for (const e of goalEntries) {
    if (e.kind !== "deposit") continue;
    const d = new Date(e.date);
    if (d >= startOfThisWeek) thisWeek += e.amount;
    else if (d >= startOfLastWeek && d < startOfThisWeek) lastWeek += e.amount;
  }
  return { thisWeek, lastWeek, diff: thisWeek - lastWeek };
}

export function monthOverview(
  transactions: Transaction[],
  goalEntries: GoalDeposit[],
  plans: Plan[]
) {
  const now = new Date();
  const saved = goalEntries
    .filter((e) => isSameMonth(e.date, now))
    .reduce((sum, e) => sum + (e.kind === "deposit" ? e.amount : -e.amount), 0);
  const spent = transactions
    .filter(
      (t): t is Extract<Transaction, { type: "expense" }> =>
        t.type === "expense" && isSameMonth(t.date, now)
    )
    .reduce((sum, t) => sum + t.amount, 0);
  const plan = latestPlan(plans);
  const planned = plan ? plan.total : 0;
  return { saved, planned, spent };
}

export function weeklySpending(transactions: Transaction[]) {
  const start = startOfWeek(new Date());
  const totals = WEEKDAY_LABELS.map((label, idx) => {
    const day = new Date(start);
    day.setDate(day.getDate() + idx);
    const dayIso = day.toISOString().slice(0, 10);
    const amount = transactions
      .filter(
        (t): t is Extract<Transaction, { type: "expense" }> =>
          t.type === "expense" && t.date.slice(0, 10) === dayIso
      )
      .reduce((sum, t) => sum + t.amount, 0);
    return { day: label, amount };
  });
  return totals;
}

export function savingsStreakWeeks(goalEntries: GoalDeposit[]) {
  const deposits = goalEntries.filter((e) => e.kind === "deposit");
  if (deposits.length === 0) return 0;

  const weekStart = (d: Date) => {
    const copy = new Date(d);
    const day = (copy.getDay() + 6) % 7;
    copy.setDate(copy.getDate() - day);
    copy.setHours(0, 0, 0, 0);
    return copy.getTime();
  };

  const weeksWithDeposit = new Set(deposits.map((e) => weekStart(new Date(e.date))));
  let streak = 0;
  const cursor = weekStart(new Date());
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
  let week = cursor;
  while (weeksWithDeposit.has(week)) {
    streak += 1;
    week -= oneWeekMs;
  }
  return streak;
}
