import { clsx } from "clsx";
import { RELEASE_STEPS } from "../constants";

/**
 * Conditional className helper. Thin wrapper around clsx so components have a
 * single import for composing Tailwind classes.
 * @param {...any} inputs
 */
export const cn = (...inputs) => clsx(inputs);

/**
 * Format an ISO date string as e.g. "September 20, 2026".
 * Falls back to the raw value if it cannot be parsed.
 * @param {string} iso
 */
export const formatDateLong = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso ?? "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Compact date for tables, e.g. "Sep 20 2026".
 * @param {string} iso
 */
export const formatDateShort = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso ?? "";
  return d
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    })
    .replace(",", "");
};

/**
 * Count how many checklist steps are complete.
 * @param {Record<string, boolean>} steps
 */
export const countCompleted = (steps = {}) =>
  RELEASE_STEPS.reduce((n, step) => n + (steps[step] ? 1 : 0), 0);

/**
 * Derive a status from the checklist progress. The backend is authoritative,
 * but this is used for optimistic UI and the mock layer.
 * @param {Record<string, boolean>} steps
 * @returns {"PLANNED" | "ONGOING" | "DONE"}
 */
export const deriveStatus = (steps = {}) => {
  const done = countCompleted(steps);
  if (done === 0) return "PLANNED";
  if (done === RELEASE_STEPS.length) return "DONE";
  return "ONGOING";
};

/** Progress as a 0–100 percentage. */
export const progressPercent = (steps = {}) =>
  Math.round((countCompleted(steps) / RELEASE_STEPS.length) * 100);

/** Tiny non-crypto id generator for the mock layer. */
export const makeId = () =>
  `rel_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;

/**
 * Normalize unknown errors (Axios or otherwise) into a friendly message.
 * @param {unknown} error
 */
export const getErrorMessage = (error) => {
  if (!error) return "Something went wrong.";
  if (typeof error === "string") return error;
  const res = error.response;
  if (res?.data?.message) return res.data.message;
  if (res?.status === 404) return "We couldn't find what you were looking for.";
  if (res?.status >= 500) return "The server ran into a problem. Please try again.";
  if (error.message) return error.message;
  return "Something went wrong.";
};
