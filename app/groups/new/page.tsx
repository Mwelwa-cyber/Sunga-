"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Chip, PrimaryButton, ScreenBody, ScreenHeader, TipBanner } from "@/components/ui";
import { useSungaStore } from "@/lib/store";
import type { ChilimbaFrequency } from "@/lib/types";
import { cleanMoneyInput, parseMoney } from "@/lib/money";
import { CURRENCY_SYMBOLS } from "@/lib/currency";
import { todayISO } from "@/lib/dates";

export default function NewGroupPage() {
  const router = useRouter();
  const profile = useSungaStore((state) => state.profile);
  const addGroup = useSungaStore((state) => state.addChilimbaGroup);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<ChilimbaFrequency>("monthly");
  const [cycleStartDate, setCycleStartDate] = useState(todayISO());
  const [membersText, setMembersText] = useState("");
  const members = useMemo(
    () => [...new Set(membersText.split("\n").map((value) => value.trim()).filter(Boolean))],
    [membersText]
  );
  const numericAmount = parseMoney(amount) ?? 0;
  const symbol = CURRENCY_SYMBOLS[profile?.currency ?? "ZMW"];
  const valid = name.trim().length >= 2 && numericAmount > 0 && members.length >= 2;

  function handleSubmit() {
    if (!valid) return;
    const id = addGroup({
      name: name.trim(),
      contributionAmount: numericAmount,
      frequency,
      cycleStartDate,
      memberNames: members,
    });
    router.push(`/groups/${id}`);
  }

  return (
    <div>
      <ScreenHeader title="Create group" backHref="/groups" />
      <ScreenBody>
        <Card>
          <label className="block text-sm font-medium text-sunga-muted">Group name</label>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Family Chilimba" className="mt-2 w-full rounded-xl border border-sunga-border bg-white px-3.5 py-3 outline-none focus:border-sunga-green" />
        </Card>

        <Card>
          <label className="block text-sm font-medium text-sunga-muted">Contribution per member</label>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-sunga-border bg-white px-3.5 py-3">
            <span className="font-semibold text-sunga-green">{symbol}</span>
            <input inputMode="decimal" value={amount} onChange={(event) => setAmount(cleanMoneyInput(event.target.value))} placeholder="0" className="w-full bg-transparent outline-none" />
          </div>
        </Card>

        <div>
          <p className="mb-2 text-sm font-medium text-sunga-muted">Contribution schedule</p>
          <div className="flex gap-2">
            <Chip active={frequency === "weekly"} onClick={() => setFrequency("weekly")}>Weekly</Chip>
            <Chip active={frequency === "monthly"} onClick={() => setFrequency("monthly")}>Monthly</Chip>
          </div>
        </div>

        <Card>
          <label className="block text-sm font-medium text-sunga-muted">First cycle starts</label>
          <input type="date" value={cycleStartDate} onChange={(event) => setCycleStartDate(event.target.value)} className="mt-2 w-full rounded-xl border border-sunga-border bg-white px-3.5 py-3 outline-none" />
        </Card>

        <Card>
          <label className="block text-sm font-medium text-sunga-muted">Members — one name per line</label>
          <textarea value={membersText} onChange={(event) => setMembersText(event.target.value)} rows={7} placeholder={"Mutale Banda\nRuth Phiri\nChanda Mwila"} className="mt-2 w-full resize-none rounded-xl border border-sunga-border bg-white px-3.5 py-3 outline-none focus:border-sunga-green" />
          <p className="mt-2 text-xs text-sunga-muted">{members.length} unique member{members.length === 1 ? "" : "s"}</p>
        </Card>

        {members.length === 1 && <TipBanner tone="orange">Add at least two members.</TipBanner>}
        <PrimaryButton disabled={!valid} onClick={handleSubmit}>Create local group record</PrimaryButton>
      </ScreenBody>
    </div>
  );
}
