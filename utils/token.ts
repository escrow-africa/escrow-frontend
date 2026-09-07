const TOKEN_COOKIE_NAME = "token";
const TOKEN_STORAGE_KEY = "escrow_token";

function getDocument() {
  if (typeof document === "undefined") return null;
  return document;
}

// Lightweight cookie helpers for storing the auth token
export function setTokenCookie(token: string, days = 30) {
  const doc = getDocument();
  if (!doc) return;

  const maxAge = days * 24 * 60 * 60; // seconds
  const secure = doc.location.protocol === "https:" ? "; Secure" : "";
  const cookie = `${TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
  doc.cookie = cookie;

  try {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // Ignore storage failures in private browsing or unavailable storage.
  }
}

export function getTokenFromCookie(): string | null {
  const doc = getDocument();
  if (!doc) return null;

  const match = doc.cookie.match(new RegExp(`(^|; )${TOKEN_COOKIE_NAME}=([^;]+)`));
  if (match) {
    return decodeURIComponent(match[2]);
  }

  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function removeTokenCookie() {
  const doc = getDocument();
  if (!doc) return;

  doc.cookie = `${TOKEN_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;

  try {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Ignore storage failures in private browsing or unavailable storage.
  }
}

export default getTokenFromCookie;

export const getToken = getTokenFromCookie;
