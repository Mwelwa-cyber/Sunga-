import { describe, expect, it } from "vitest";
import { moneyAvailable } from "./store";
import type { GoalDeposit, Transaction } from "./types";

describe("recorded balance", () => {
  it("subtracts expenses and net goal contributions while ignoring transfers", () => {
    const transactions: Transaction[] = [
      { id: "1", type: "income", amount: 1000, currency: "ZMW", source: "salary", frequency: "one_time", date: "2026-09-01", createdAt: "2026-09-01" },
      { id: "2", type: "expense", amount: 250, currency: "ZMW", category: "Food", priority: "must_pay", date: "2026-09-02", createdAt: "2026-09-02" },
      { id: "3", type: "transfer", amount: 100, currency: "ZMW", from: "cash", to: "bank", date: "2026-09-03", createdAt: "2026-09-03" },
    ];
    const goalEntries: GoalDeposit[] = [
      { id: "g1", goalId: "goal", kind: "deposit", amount: 100, location: "bank", date: "2026-09-04", createdAt: "2026-09-04" },
      { id: "g2", goalId: "goal", kind: "withdrawal", amount: 20, location: "bank", date: "2026-09-05", createdAt: "2026-09-05" },
    ];
    expect(moneyAvailable(transactions, goalEntries)).toBe(670);
  });
});
