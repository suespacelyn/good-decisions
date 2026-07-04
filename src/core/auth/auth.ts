/**
 * Device-local auth for the prototype.
 *
 * Friends log in with a username + password from the list below (edit it to
 * add or remove people — just hand each friend their line). Password changes
 * are stored per device in localStorage, so they apply only on that phone
 * until a real backend (Supabase Auth) replaces this.
 *
 * NOTE: this is prototype-grade access control, not security — everything
 * lives in the browser. Don't reuse real passwords here.
 */

export interface Account {
  username: string;
  /** Default password — used until the friend changes it on their device. */
  password: string;
}

// ── Edit this list to manage who can log in ─────────────────────────
export const ACCOUNTS: Account[] = [
  { username: "sue", password: "gooddecisions" },
  { username: "priya", password: "kaya-toast" },
  { username: "sueling", password: "teh-c-peng" },
];

const SESSION_KEY = "fff:auth";
const OVERRIDES_KEY = "fff:passwords";

function normalize(username: string): string {
  return username.trim().toLowerCase();
}

function readOverrides(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(OVERRIDES_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function findAccount(username: string): Account | undefined {
  const u = normalize(username);
  return ACCOUNTS.find((a) => a.username === u);
}

/** The password currently in effect for a user (override beats default). */
function effectivePassword(username: string): string | undefined {
  const account = findAccount(username);
  if (!account) return undefined;
  return readOverrides()[account.username] ?? account.password;
}

/** Username of the logged-in user on this device, or null. */
export function getCurrentUser(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_KEY);
}

/** Try to log in. Returns true and starts a session on success. */
export function login(username: string, password: string): boolean {
  const account = findAccount(username);
  if (!account || effectivePassword(account.username) !== password) {
    return false;
  }
  window.localStorage.setItem(SESSION_KEY, account.username);
  return true;
}

export function logout(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

/**
 * Change the logged-in user's password (this device only).
 * Returns an error message, or null on success.
 */
export function changePassword(current: string, next: string): string | null {
  const username = getCurrentUser();
  if (!username) return "You're not logged in.";
  if (effectivePassword(username) !== current) {
    return "Current password doesn't match.";
  }
  const trimmed = next.trim();
  if (trimmed.length < 6) return "New password needs at least 6 characters.";
  const overrides = readOverrides();
  overrides[username] = trimmed;
  window.localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
  return null;
}
