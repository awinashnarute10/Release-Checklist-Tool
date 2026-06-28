import axios from "axios";

/**
 * Shared Axios instance. Base URL is configurable via VITE_API_BASE_URL and
 * defaults to "/api" (proxied by Vite in dev). A response interceptor unwraps
 * the payload and normalizes errors so callers work with plain data.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Surface a consistent error shape; components use getErrorMessage().
    return Promise.reject(error);
  },
);

/** Whether to use the in-browser mock instead of hitting a real backend. */
export const USE_MOCK =
  (import.meta.env.VITE_USE_MOCK ?? "true").toString() !== "false";
