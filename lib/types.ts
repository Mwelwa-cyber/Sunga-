export type CurrencyCode = "ZMW" | "USD" | "ZAR";

export type TrackingMode = "savings" | "expense" | "full";

export type IncomeSource =
  | "salary"
  | "business"
  | "piecework"
  | "farming"
  | "gift"
  | "rental"
  | "other";

export type IncomeFrequency = "one_time" | "regular";

export type ExpensePriority = "must_pay" | "important" | "flexible" | "optional";

export type PlanBucket = "needs" | "goals" | "free";

export type SavingsLocation =
  | "cash"
  | "mobile_money"
  | "bank"
  | "chilimba"
  | "trusted_person"
  | "other";

export type GoalPriority = "essential" | "important" | "nice_to_have";

export type GoalStatus = "active" | "paused" | "completed";

export interface Profile {
  name: string;
  country: string;
  currency: CurrencyCode;
  trackingMode: TrackingMode;
  onboarded: boolean;
  createdAt: string;
}

export interface IncomeTransaction {
  id: string;
  type: "income";
  amount: number;
  currency: CurrencyCode;
  source: IncomeSource;
  frequency: IncomeFrequency;
  date: string;
  note?: string;
  createdAt: string;
}

export interface ExpenseTransaction {
  id: string;
  type: "expense";
  amount: number;
  currency: CurrencyCode;
  category: string;
  priority: ExpensePriority;
  date: string;
  note?: string;
  createdAt: string;
}

export interface TransferTransaction {
  id: string;
  type: "transfer";
  amount: number;
  currency: CurrencyCode;
  from: SavingsLocation;
  to: SavingsLocation;
  date: string;
  note?: string;
  createdAt: string;
}

export type Transaction = IncomeTransaction | ExpenseTransaction | TransferTransaction;

type DistributivePartialOmit<T, K extends string> = T extends unknown
  ? Partial<Omit<T, K>>
  : never;

export type TransactionUpdate = DistributivePartialOmit<
  Transaction,
  "id" | "type" | "createdAt"
>;

export type BillFrequency = "one_time" | "weekly" | "monthly" | "yearly";

export interface Bill {
  id: string;
  name: string;
  amount: number;
  currency: CurrencyCode;
  category: string;
  priority: ExpensePriority;
  frequency: BillFrequency;
  dueDate: string;
  paidAt: string | null;
  createdAt: string;
}

export interface GoalDeposit {
  id: string;
  goalId: string;
  kind: "deposit" | "withdrawal";
  amount: number;
  location: SavingsLocation;
  date: string;
  note?: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  name: string;
  icon: string;
  purpose: string;
  targetAmount: number | null;
  savedAmount: number;
  targetDate: string | null;
  priority: GoalPriority;
  contributionMethod: "daily" | "weekly" | "monthly" | "payday" | "flexible";
  location: SavingsLocation;
  status: GoalStatus;
  createdAt: string;
}

export interface PlanCategory {
  id: string;
  name: string;
  icon: string;
  bucket: PlanBucket;
  amount: number;
}

export interface Plan {
  id: string;
  total: number;
  categories: PlanCategory[];
  createdAt: string;
}

export type ChilimbaFrequency = "weekly" | "monthly";
export type ChilimbaGroupStatus = "active" | "completed";

export interface ChilimbaMember {
  id: string;
  name: string;
  phone?: string;
  active: boolean;
  createdAt: string;
}

export interface ChilimbaGroup {
  id: string;
  name: string;
  contributionAmount: number;
  frequency: ChilimbaFrequency;
  cycleStartDate: string;
  members: ChilimbaMember[];
  payoutOrder: string[];
  status: ChilimbaGroupStatus;
  createdAt: string;
}

export interface ChilimbaContribution {
  id: string;
  groupId: string;
  memberId: string;
  cycleNumber: number;
  amount: number;
  paidAt: string;
  note?: string;
  createdAt: string;
}

export interface ChilimbaPayout {
  id: string;
  groupId: string;
  memberId: string;
  cycleNumber: number;
  amount: number;
  paidAt: string;
  note?: string;
  createdAt: string;
}
