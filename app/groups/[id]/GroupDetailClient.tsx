"use client";

import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Copy, Download, Share2 } from "lucide-react";
import { Card, Chip, PrimaryButton, ScreenBody, ScreenHeader, SecondaryButton, TipBanner } from "@/components/ui";
import { useRouteId } from "@/lib/useRouteId";
import { useSungaStore } from "@/lib/store";
import { formatMoney } from "@/lib/currency";
import { todayISO } from "@/lib/dates";
import {
  buildGroupCsv,
  buildGroupStatement,
  expectedRecipient,
  getCurrentCycleNumber,
  groupCycleSummary,
} from "@/lib/chilimba";

export default function GroupDetailClient() {
  const id = useRouteId();
  const profile = useSungaStore((state) => state.profile);
  const group = useSungaStore((state) => state.chilimbaGroups.find((entry) => entry.id === id));
  const contributions = useSungaStore((state) => state.chilimbaContributions);
  const payouts = useSungaStore((state) => state.chilimbaPayouts);
  const recordContribution = useSungaStore((state) => state.recordChilimbaContribution);
  const recordPayout = useSungaStore((state) => state.recordChilimbaPayout);
  const removeContribution = useSungaStore((state) => state.removeChilimbaContribution);
  const removePayout = useSungaStore((state) => state.removeChilimbaPayout);
  const initialCycle = group ? getCurrentCycleNumber(group.cycleStartDate, group.frequency) : 1;
  const [cycleNumber, setCycleNumber] = useState(initialCycle);
  const [payoutMemberId, setPayoutMemberId] = useState("");
  const [message, setMessage] = useState("");
  const currency = profile?.currency ?? "ZMW";

  const summary = useMemo(
    () => (group ? groupCycleSummary(group, cycleNumber, contributions, payouts) : null),
    [group, cycleNumber, contributions, payouts]
  );
  const scheduledRecipient = group ? expectedRecipient(group, cycleNumber) : null;
  const selectedRecipientId = payoutMemberId || scheduledRecipient?.id || "";

  if (!group || !summary) {
    return (
      <div>
        <ScreenHeader title="Chilimba group" backHref="/groups" />
        <ScreenBody><p className="text-sm text-sunga-muted">This group could not be found.</p></ScreenBody>
      </div>
    );
  }

  function markPaid(memberId: string) {
    recordContribution({
      groupId: group!.id,
      memberId,
      cycleNumber,
      amount: group!.contributionAmount,
      paidAt: todayISO(),
    });
  }

  function undoPaid(memberId: string, memberName: string) {
    if (!window.confirm(`Mark ${memberName} as pending again for cycle ${cycleNumber}?`)) return;
    removeContribution(group!.id, memberId, cycleNumber);
  }

  function savePayout() {
    if (!selectedRecipientId || summary!.collected <= 0) return;
    recordPayout({
      groupId: group!.id,
      memberId: selectedRecipientId,
      cycleNumber,
      amount: summary!.collected,
      paidAt: todayISO(),
    });
    setMessage("Payout recorded for this cycle.");
  }

  function statement() {
    return buildGroupStatement(group!, cycleNumber, contributions, payouts, currency === "ZMW" ? "K" : currency);
  }

  async function copyStatement() {
    try {
      await navigator.clipboard.writeText(statement());
      setMessage("Statement copied. You can paste it into WhatsApp.");
    } catch {
      setMessage("Copy was blocked by the browser. Try the Share button.");
    }
  }

  async function shareStatement() {
    if (!navigator.share) return copyStatement();
    try {
      await navigator.share({ title: `${group!.name} cycle ${cycleNumber}`, text: statement() });
    } catch {
      // Closing the native share sheet does not require an error message.
    }
  }

  function exportCsv() {
    const blob = new Blob([buildGroupCsv(group!, cycleNumber, contributions)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${group!.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-cycle-${cycleNumber}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const payoutRecipient = summary.payout
    ? group.members.find((member) => member.id === summary.payout?.memberId)
    : null;

  return (
    <div>
      <ScreenHeader title={group.name} backHref="/groups" />
      <ScreenBody>
        <div className="flex items-center justify-between rounded-2xl bg-sunga-green p-4 text-sunga-cream">
          <button aria-label="Previous cycle" disabled={cycleNumber <= 1} onClick={() => setCycleNumber((value) => Math.max(1, value - 1))} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 disabled:opacity-30"><ChevronLeft size={19} /></button>
          <div className="text-center">
            <p className="text-xs text-sunga-cream/70">Contribution cycle</p>
            <p className="font-display text-xl font-semibold">Cycle {cycleNumber}</p>
          </div>
          <button aria-label="Next cycle" onClick={() => setCycleNumber((value) => value + 1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"><ChevronRight size={19} /></button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center"><p className="text-xs text-sunga-muted">Collected</p><p className="font-display text-lg font-semibold text-sunga-green">{formatMoney(summary.collected, currency)}</p></Card>
          <Card className="text-center"><p className="text-xs text-sunga-muted">Expected</p><p className="font-display text-lg font-semibold text-sunga-green">{formatMoney(summary.expected, currency)}</p></Card>
        </div>

        <Card>
          <div className="flex items-center justify-between">
            <div><h2 className="font-display font-semibold text-sunga-green">Contributions</h2><p className="text-xs text-sunga-muted">Tap pending members when payment is confirmed.</p></div>
            <Chip active>{summary.paidCount}/{summary.activeMembers.length} paid</Chip>
          </div>
          <div className="mt-3 divide-y divide-sunga-border">
            {summary.activeMembers.map((member) => {
              const paid = summary.paidMemberIds.has(member.id);
              return (
                <div key={member.id} className="flex items-center gap-3 py-3">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full ${paid ? "bg-sunga-green text-white" : "bg-sunga-cream-soft text-sunga-muted"}`}>{paid ? <Check size={18} /> : member.name.charAt(0).toUpperCase()}</span>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-sunga-green">{member.name}</p><p className="text-xs text-sunga-muted">{paid ? "Paid" : "Pending"}</p></div>
                  {paid ? <button onClick={() => undoPaid(member.id, member.name)} className="text-right text-sm font-semibold text-sunga-green"><span className="block">{formatMoney(group.contributionAmount, currency)}</span><span className="block text-[10px] font-medium text-sunga-muted">Tap to undo</span></button> : <button onClick={() => markPaid(member.id)} className="rounded-full border border-sunga-green/30 px-3 py-2 text-xs font-semibold text-sunga-green">Mark paid</button>}
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="space-y-3">
          <div><h2 className="font-display font-semibold text-sunga-green">Payout</h2><p className="text-sm text-sunga-muted">Scheduled recipient: {scheduledRecipient?.name ?? "Not set"}</p></div>
          {summary.payout ? (
            <>
              <TipBanner>Paid {formatMoney(summary.payout.amount, currency)} to {payoutRecipient?.name ?? "recipient"}.</TipBanner>
              <button
                onClick={() => {
                  if (window.confirm(`Remove the cycle ${cycleNumber} payout record?`)) removePayout(group.id, cycleNumber);
                }}
                className="text-sm font-semibold text-sunga-danger underline underline-offset-2"
              >
                Correct payout record
              </button>
            </>
          ) : (
            <>
              <select value={selectedRecipientId} onChange={(event) => setPayoutMemberId(event.target.value)} className="w-full rounded-xl border border-sunga-border bg-white px-3.5 py-3 text-sm outline-none">
                {group.members.filter((member) => member.active).map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
              </select>
              <PrimaryButton disabled={!selectedRecipientId || summary.collected <= 0} onClick={savePayout}>Record payout of {formatMoney(summary.collected, currency)}</PrimaryButton>
            </>
          )}
        </Card>

        <Card className="space-y-3">
          <h2 className="font-display font-semibold text-sunga-green">Share records</h2>
          <div className="grid grid-cols-2 gap-2">
            <SecondaryButton onClick={copyStatement}><span className="flex items-center justify-center gap-2"><Copy size={17} />Copy</span></SecondaryButton>
            <SecondaryButton onClick={shareStatement}><span className="flex items-center justify-center gap-2"><Share2 size={17} />Share</span></SecondaryButton>
          </div>
          <SecondaryButton onClick={exportCsv}><span className="flex items-center justify-center gap-2"><Download size={17} />Export CSV</span></SecondaryButton>
        </Card>

        {message && <TipBanner tone={message.includes("blocked") ? "orange" : "green"}>{message}</TipBanner>}
        <p className="text-center text-xs text-sunga-muted">Sunga records this activity. It does not receive, hold or transfer group money.</p>
      </ScreenBody>
    </div>
  );
}
