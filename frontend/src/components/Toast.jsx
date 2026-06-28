import { createPortal } from "react-dom";
import { cn } from "../utils";
import { AlertIcon, CheckIcon, CloseIcon } from "./icons";

const VARIANTS = {
  success: {
    ring: "ring-emerald-200 dark:ring-emerald-500/30",
    icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300",
    Icon: CheckIcon,
  },
  error: {
    ring: "ring-rose-200 dark:ring-rose-500/30",
    icon: "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300",
    Icon: AlertIcon,
  },
  info: {
    ring: "ring-brand-200 dark:ring-brand-500/30",
    icon: "bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300",
    Icon: AlertIcon,
  },
};

function ToastItem({ toast, onDismiss }) {
  const cfg = VARIANTS[toast.variant] ?? VARIANTS.info;
  const Icon = cfg.Icon;
  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex w-full items-start gap-3 rounded-xl bg-white p-3.5 shadow-soft-lg ring-1 animate-slide-in-right dark:bg-slate-900",
        cfg.ring,
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-lg",
          cfg.icon,
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <p className="flex-1 pt-0.5 text-sm font-medium text-slate-700 dark:text-slate-200">
        {toast.message}
      </p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

/** Fixed viewport that stacks active toasts (top-right on desktop). */
export function ToastViewport({ toasts, onDismiss }) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end sm:p-6">
      <div className="flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </div>
    </div>,
    document.body,
  );
}
