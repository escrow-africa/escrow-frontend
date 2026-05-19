// Lightweight cookie helpers for storing the auth token
export function setTokenCookie(token: string, days = 30) {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60; // seconds
  const secure = location.protocol === "https:" ? "; Secure" : "";
  const cookie = `token=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
  document.cookie = cookie;
}

export function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp('(^|; )' + 'token' + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function removeTokenCookie() {
  if (typeof document === "undefined") return;
  document.cookie = 'token=; Path=/; Max-Age=0; SameSite=Lax';
}

export default getTokenFromCookie;

export const getToken = getTokenFromCookie;
