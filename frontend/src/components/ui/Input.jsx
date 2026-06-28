import { forwardRef, useId } from "react";
import { cn } from "../../utils";

/**
 * Labeled text input with optional left icon, hint and error message.
 */
export const Input = forwardRef(function Input(
  { label, hint, error, leftIcon, className, id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy = error
    ? `${inputId}-error`
    : hint
      ? `${inputId}-hint`
      : undefined;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-10 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors",
            "focus:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-0",
            "dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500",
            leftIcon && "pl-10",
            error
              ? "border-rose-400 dark:border-rose-500/60"
              : "border-slate-200 dark:border-slate-700",
            className,
          )}
          {...props}
        />
      </div>
      {error ? (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 text-sm text-rose-600 dark:text-rose-400"
        >
          {error}
        </p>
      ) : hint ? (
        <p
          id={`${inputId}-hint`}
          className="mt-1.5 text-sm text-slate-400"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
});
