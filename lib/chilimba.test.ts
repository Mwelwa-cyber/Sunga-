import { describe, expect, it } from "vitest";
import { buildGroupStatement, expectedRecipient, getCurrentCycleNumber, groupCycleSummary } from "./chilimba";
import type { ChilimbaContribution, ChilimbaGroup } from "./types";

const group: ChilimbaGroup = {
  id: "group-1",
  name: "Family Chilimba",
  contributionAmount: 100,
  frequency: "monthly",
  cycleStartDate: "2026-01-01",
  members: [
    { id: "a", name: "Anna", active: true, createdAt: "2026-01-01" },
    { id: "b", name: "Bwalya", active: true, createdAt: "2026-01-01" },
  ],
  payoutOrder: ["a", "b"],
  status: "active",
  createdAt: "2026-01-01",
};

const contributions: ChilimbaContribution[] = [
  { id: "c1", groupId: "group-1", memberId: "a", cycleNumber: 2, amount: 100, paidAt: "2026-02-02", createdAt: "2026-02-02" },
];

describe("Chilimba cycles", () => {
  it("calculates monthly cycles", () => {
    expect(getCurrentCycleNumber("2026-01-01", "monthly", new Date("2026-03-15"))).toBe(3);
  });

  it("rotates the scheduled recipient", () => {
    expect(expectedRecipient(group, 1)?.name).toBe("Anna");
    expect(expectedRecipient(group, 2)?.name).toBe("Bwalya");
    expect(expectedRecipient(group, 3)?.name).toBe("Anna");
  });

  it("separates paid and pending members", () => {
    const summary = groupCycleSummary(group, 2, contributions, []);
    expect(summary.paidCount).toBe(1);
    expect(summary.pendingCount).toBe(1);
    expect(summary.collected).toBe(100);
    expect(summary.expected).toBe(200);
  });

  it("creates a clear shareable statement", () => {
    const statement = buildGroupStatement(group, 2, contributions, [], "K");
    expect(statement).toContain("✅ Anna");
    expect(statement).toContain("⏳ Bwalya");
    expect(statement).toContain("Next recipient: Bwalya");
    expect(statement).toContain("does not hold or transfer");
  });
});
