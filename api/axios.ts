import axios from "axios";
import { getTokenFromCookie } from "../utils/token";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// In-memory token cache — avoids re-parsing the cookie on every single request
let cachedToken: string | null = null;
let tokenCachedAt = 0;
const TOKEN_CACHE_TTL_MS = 30_000; // re-read cookie every 30 s

function getCachedToken(): string | null {
  if (cachedToken && Date.now() - tokenCachedAt < TOKEN_CACHE_TTL_MS) {
    return cachedToken;
  }
  cachedToken = getTokenFromCookie();
  tokenCachedAt = Date.now();
  return cachedToken;
}

export function invalidateTokenCache() {
  cachedToken = null;
  tokenCachedAt = 0;
}

// Attach Bearer token to every outgoing request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = getCachedToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally — clear token cache and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error?.response?.status === 401) {
      invalidateTokenCache();
      // Avoid redirect loop on the login/signup pages themselves
      const isAuthPage = window.location.pathname.startsWith("/login") || window.location.pathname.startsWith("/signup");
      if (!isAuthPage) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
