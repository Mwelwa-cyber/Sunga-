"use client";

import Link from "next/link";
import { Plus, UsersRound, ChevronRight, ShieldCheck } from "lucide-react";
import { Card, ScreenBody, ScreenHeader, TipBanner } from "@/components/ui";
import { useSungaStore } from "@/lib/store";
import { formatMoney } from "@/lib/currency";
import { getCurrentCycleNumber, groupCycleSummary } from "@/lib/chilimba";

export default function GroupsPage() {
  const profile = useSungaStore((state) => state.profile);
  const groups = useSungaStore((state) => state.chilimbaGroups);
  const contributions = useSungaStore((state) => state.chilimbaContributions);
  const payouts = useSungaStore((state) => state.chilimbaPayouts);
  const currency = profile?.currency ?? "ZMW";

  return (
    <div>
      <ScreenHeader
        title="Chilimba groups"
        right={
          <Link href="/groups/new" aria-label="Create group" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
            <Plus size={20} />
          </Link>
        }
      />
      <ScreenBody>
        <TipBanner icon={ShieldCheck}>
          Sunga records contributions and payouts. Money remains with the group and its chosen payment method.
        </TipBanner>

        {groups.length === 0 ? (
          <Card className="flex flex-col items-center gap-4 py-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sunga-green-tint text-sunga-green">
              <UsersRound size={26} />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold text-sunga-green">Start with one real group</h2>
              <p className="mt-1 text-sm text-sunga-muted">Add members, record who has paid and share a clear cycle statement.</p>
            </div>
            <Link href="/groups/new" className="rounded-full bg-sunga-orange px-5 py-3 font-semibold text-white">Create a group</Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {groups.map((group) => {
              const cycle = getCurrentCycleNumber(group.cycleStartDate, group.frequency);
              const summary = groupCycleSummary(group, cycle, contributions, payouts);
              return (
                <Link key={group.id} href={`/groups/${group.id}`}>
                  <Card className="mb-3">
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sunga-green-tint text-sunga-green"><UsersRound size={20} /></span>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-display font-semibold text-sunga-green">{group.name}</h2>
                        <p className="text-sm text-sunga-muted">Cycle {cycle} · {group.members.length} members</p>
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <span className="text-sunga-muted">{summary.paidCount} paid · {summary.pendingCount} pending</span>
                          <span className="font-semibold text-sunga-green">{formatMoney(summary.collected, currency)}</span>
                        </div>
                      </div>
                      <ChevronRight size={18} className="mt-1 text-sunga-muted" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </ScreenBody>
    </div>
  );
}
