import { forwardRef, useId } from "react";
import { cn } from "../../utils";

/**
 * Labeled multiline textarea with optional hint/error.
 */
export const Textarea = forwardRef(function Textarea(
  { label, hint, error, className, id, rows = 4, ...props },
  ref,
) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        aria-invalid={error ? "true" : undefined}
        className={cn(
          "w-full resize-y rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors",
          "focus:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-0",
          "dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500",
          error
            ? "border-rose-400 dark:border-rose-500/60"
            : "border-slate-200 dark:border-slate-700",
          className,
        )}
        {...props}
      />
      {error ? (
        <p className="mt-1.5 text-sm text-rose-600 dark:text-rose-400">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-sm text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
});
