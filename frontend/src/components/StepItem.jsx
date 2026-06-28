import { cn } from "../utils";
import { CheckIcon } from "./icons";

/**
 * A single checklist row: a large, tappable toggle with an animated checkbox.
 * Implemented as a button for full keyboard + screen-reader support.
 */
export function StepItem({ label, checked, disabled, onToggle }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-150",
        "disabled:cursor-not-allowed disabled:opacity-60",
        checked
          ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10"
          : "border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/40 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-brand-500/40 dark:hover:bg-slate-800/60",
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 flex-none items-center justify-center rounded-md border transition-all duration-150",
          checked
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-slate-300 bg-transparent text-transparent group-hover:border-brand-400 dark:border-slate-600",
        )}
      >
        <CheckIcon
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-150",
            checked ? "scale-100" : "scale-0",
          )}
        />
      </span>
      <span
        className={cn(
          "text-sm font-medium transition-colors",
          checked
            ? "text-slate-500 line-through dark:text-slate-400"
            : "text-slate-700 dark:text-slate-200",
        )}
      >
        {label}
      </span>
    </button>
  );
}
