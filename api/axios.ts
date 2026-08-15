import axios from "axios";
import { getTokenFromCookie, removeTokenCookie } from "../utils/token";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = getTokenFromCookie();
      if (token) {
        config.headers = config.headers ?? axios.AxiosHeaders.from({});
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers = config.headers ?? axios.AxiosHeaders.from({});
        config.headers.delete("Authorization");
      }
    }
    // The client default forces Content-Type: application/json on every request. For a
    // FormData body (file uploads) that overrides the browser's automatic multipart boundary
    // header, so the server can't parse any file parts - let the browser set it instead.
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      config.headers = config.headers ?? axios.AxiosHeaders.from({});
      config.headers.delete("Content-Type");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      removeTokenCookie();
    }
    return Promise.reject(error);
  }
);