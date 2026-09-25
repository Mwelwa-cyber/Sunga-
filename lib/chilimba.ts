import type {
  ChilimbaContribution,
  ChilimbaFrequency,
  ChilimbaGroup,
  ChilimbaPayout,
} from "./types";

export function getCurrentCycleNumber(
  cycleStartDate: string,
  frequency: ChilimbaFrequency,
  reference = new Date()
) {
  const start = new Date(`${cycleStartDate.slice(0, 10)}T00:00:00`);
  if (reference < start) return 1;
  if (frequency === "weekly") {
    return Math.floor((reference.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
  }
  return (
    (reference.getFullYear() - start.getFullYear()) * 12 +
    reference.getMonth() -
    start.getMonth() +
    1
  );
}

export function expectedRecipient(group: ChilimbaGroup, cycleNumber: number) {
  if (group.payoutOrder.length === 0) return null;
  const memberId = group.payoutOrder[(Math.max(1, cycleNumber) - 1) % group.payoutOrder.length];
  return group.members.find((member) => member.id === memberId) ?? null;
}

export function groupCycleSummary(
  group: ChilimbaGroup,
  cycleNumber: number,
  contributions: ChilimbaContribution[],
  payouts: ChilimbaPayout[]
) {
  const activeMembers = group.members.filter((member) => member.active);
  const cycleContributions = contributions.filter(
    (entry) => entry.groupId === group.id && entry.cycleNumber === cycleNumber
  );
  const paidMemberIds = new Set(cycleContributions.map((entry) => entry.memberId));
  const collected = cycleContributions.reduce((sum, entry) => sum + entry.amount, 0);
  const expected = activeMembers.length * group.contributionAmount;
  const payout = payouts.find(
    (entry) => entry.groupId === group.id && entry.cycleNumber === cycleNumber
  );
  return {
    activeMembers,
    cycleContributions,
    paidMemberIds,
    paidCount: paidMemberIds.size,
    pendingCount: activeMembers.filter((member) => !paidMemberIds.has(member.id)).length,
    collected,
    expected,
    payout,
  };
}

export function buildGroupStatement(
  group: ChilimbaGroup,
  cycleNumber: number,
  contributions: ChilimbaContribution[],
  payouts: ChilimbaPayout[],
  currency = "K"
) {
  const summary = groupCycleSummary(group, cycleNumber, contributions, payouts);
  const recipient = expectedRecipient(group, cycleNumber);
  const lines = [
    `*${group.name} — Cycle ${cycleNumber}*`,
    `Contribution: ${currency}${group.contributionAmount.toLocaleString()} per member`,
    `Collected: ${currency}${summary.collected.toLocaleString()} of ${currency}${summary.expected.toLocaleString()}`,
    "",
    ...summary.activeMembers.map(
      (member) => `${summary.paidMemberIds.has(member.id) ? "✅" : "⏳"} ${member.name}`
    ),
    "",
    `Next recipient: ${recipient?.name ?? "Not set"}`,
    summary.payout
      ? `Payout recorded: ${currency}${summary.payout.amount.toLocaleString()}`
      : "Payout: Not yet recorded",
    "",
    "Sunga only records this activity. It does not hold or transfer the money.",
  ];
  return lines.join("\n");
}

export function buildGroupCsv(
  group: ChilimbaGroup,
  cycleNumber: number,
  contributions: ChilimbaContribution[]
) {
  const summary = groupCycleSummary(group, cycleNumber, contributions, []);
  const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
  return [
    ["Group", "Cycle", "Member", "Status", "Amount", "Paid date"].map(escape).join(","),
    ...summary.activeMembers.map((member) => {
      const contribution = summary.cycleContributions.find((entry) => entry.memberId === member.id);
      return [
        group.name,
        cycleNumber,
        member.name,
        contribution ? "Paid" : "Pending",
        contribution?.amount ?? "",
        contribution?.paidAt ?? "",
      ].map(escape).join(",");
    }),
  ].join("\n");
}
