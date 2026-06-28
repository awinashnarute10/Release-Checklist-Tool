import { Button } from "./ui/Button";
import { AlertIcon } from "./icons";

/**
 * Inline error panel with a retry action.
 */
export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  onRetry,
}) {
  return (
    <div className="flex animate-fade-in flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/60 px-6 py-16 text-center dark:border-rose-500/30 dark:bg-rose-500/5">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-500 dark:bg-rose-500/15 dark:text-rose-300">
        <AlertIcon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
      {onRetry && (
        <Button variant="secondary" className="mt-6" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
