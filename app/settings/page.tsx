"use client";

import { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, LockKeyhole, RotateCcw, Upload } from "lucide-react";
import { ScreenBody, ScreenHeader, Card, PrimaryButton, SecondaryButton, TipBanner } from "@/components/ui";
import { getBackupData, useSungaStore } from "@/lib/store";
import { createEncryptedBackup, downloadTextFile, openEncryptedBackup } from "@/lib/backup";

export default function SettingsPage() {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const replaceLocalData = useSungaStore((state) => state.replaceLocalData);
  const resetLocalData = useSungaStore((state) => state.resetLocalData);
  const [passphrase, setPassphrase] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleExport() {
    try {
      setBusy(true);
      setMessage("");
      const backup = await createEncryptedBackup(
        getBackupData(useSungaStore.getState()),
        passphrase
      );
      downloadTextFile(backup, `sunga-backup-${new Date().toISOString().slice(0, 10)}.sunga.json`);
      setMessage("Encrypted backup downloaded. Keep its passphrase somewhere safe.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Backup could not be created.");
    } finally {
      setBusy(false);
    }
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setBusy(true);
      setMessage("");
      const restored = await openEncryptedBackup(await file.text(), passphrase);
      if (!window.confirm("Replace all current Sunga records with this backup?")) return;
      replaceLocalData(restored);
      setMessage("Backup restored successfully.");
      router.replace("/home");
    } catch {
      setMessage("The backup could not be opened. Check the file and passphrase.");
    } finally {
      event.target.value = "";
      setBusy(false);
    }
  }

  function handleReset() {
    if (!window.confirm("Delete every Sunga record stored on this device? This cannot be undone.")) return;
    if (!window.confirm("Are you completely sure? Export a backup first if you may need these records.")) return;
    resetLocalData();
    router.replace("/onboarding");
  }

  return (
    <div>
      <ScreenHeader title="Data & privacy" backHref="/home" />
      <ScreenBody>
        <TipBanner icon={LockKeyhole}>
          Your records stay in this browser. Sunga does not upload or hold your money.
          Clearing browser data will remove records unless you create a backup.
        </TipBanner>

        <Card className="space-y-4">
          <div>
            <h2 className="font-display font-semibold text-sunga-green">Encrypted backup</h2>
            <p className="mt-1 text-sm text-sunga-muted">
              Use the same passphrase when restoring. Sunga cannot recover a forgotten passphrase.
            </p>
          </div>
          <input
            type="password"
            value={passphrase}
            onChange={(event) => setPassphrase(event.target.value)}
            placeholder="Backup passphrase (8+ characters)"
            autoComplete="new-password"
            className="w-full rounded-xl border border-sunga-border bg-white px-3.5 py-3 text-sm outline-none focus:border-sunga-green"
          />
          <PrimaryButton disabled={busy || passphrase.length < 8} onClick={handleExport}>
            <span className="flex items-center justify-center gap-2"><Download size={18} />Export backup</span>
          </PrimaryButton>
          <SecondaryButton disabled={busy || passphrase.length < 8} onClick={() => fileInput.current?.click()}>
            <span className="flex items-center justify-center gap-2"><Upload size={18} />Restore backup</span>
          </SecondaryButton>
          <input ref={fileInput} type="file" accept=".json,application/json" onChange={handleImport} className="hidden" />
        </Card>

        {message && <TipBanner tone={message.includes("could not") ? "orange" : "green"}>{message}</TipBanner>}

        <Card className="space-y-3">
          <div>
            <h2 className="font-display font-semibold text-sunga-danger">Reset Sunga</h2>
            <p className="mt-1 text-sm text-sunga-muted">Permanently removes local personal and Chilimba records from this browser.</p>
          </div>
          <SecondaryButton className="border-red-200 text-sunga-danger" onClick={handleReset}>
            <span className="flex items-center justify-center gap-2"><RotateCcw size={18} />Delete all local data</span>
          </SecondaryButton>
        </Card>
      </ScreenBody>
    </div>
  );
}
