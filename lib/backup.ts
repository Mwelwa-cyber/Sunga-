import type { SungaBackupData } from "./store";

const BACKUP_VERSION = 1;
const ITERATIONS = 210_000;

interface EncryptedBackup {
  product: "sunga";
  version: number;
  createdAt: string;
  encryption: "AES-GCM";
  iterations: number;
  salt: string;
  iv: string;
  payload: string;
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value: string) {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function deriveKey(passphrase: string, salt: Uint8Array, iterations: number) {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function createEncryptedBackup(data: SungaBackupData, passphrase: string) {
  if (passphrase.length < 8) throw new Error("Use a passphrase with at least 8 characters.");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt, ITERATIONS);
  const plaintext = new TextEncoder().encode(JSON.stringify(data));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    key,
    plaintext
  );
  const backup: EncryptedBackup = {
    product: "sunga",
    version: BACKUP_VERSION,
    createdAt: new Date().toISOString(),
    encryption: "AES-GCM",
    iterations: ITERATIONS,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    payload: bytesToBase64(new Uint8Array(encrypted)),
  };
  return JSON.stringify(backup, null, 2);
}

export async function openEncryptedBackup(contents: string, passphrase: string) {
  const backup = JSON.parse(contents) as EncryptedBackup;
  if (
    backup.product !== "sunga" ||
    backup.version !== BACKUP_VERSION ||
    backup.encryption !== "AES-GCM"
  ) {
    throw new Error("This is not a supported Sunga backup.");
  }
  const salt = base64ToBytes(backup.salt);
  const iv = base64ToBytes(backup.iv);
  const key = await deriveKey(passphrase, salt, backup.iterations);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    key,
    base64ToBytes(backup.payload) as BufferSource
  );
  const data = JSON.parse(new TextDecoder().decode(decrypted)) as Partial<SungaBackupData>;
  if (!data.profile || !Array.isArray(data.transactions) || !Array.isArray(data.goals)) {
    throw new Error("The backup is incomplete or damaged.");
  }
  return {
    profile: data.profile,
    transactions: data.transactions,
    goals: data.goals,
    goalEntries: data.goalEntries ?? [],
    plans: data.plans ?? [],
    bills: data.bills ?? [],
    chilimbaGroups: data.chilimbaGroups ?? [],
    chilimbaContributions: data.chilimbaContributions ?? [],
    chilimbaPayouts: data.chilimbaPayouts ?? [],
  } satisfies SungaBackupData;
}

export function downloadTextFile(contents: string, filename: string) {
  const blob = new Blob([contents], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
