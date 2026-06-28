import { StepItem } from "./StepItem";
import { RELEASE_STEPS, STEP_LABELS } from "../constants";
import { countCompleted, progressPercent } from "../utils";

/**
 * Renders the full ordered checklist. Each toggle calls onToggleStep(step,
 * nextValue); the parent owns persistence (optimistic mutation).
 */
export function StepChecklist({ steps = {}, onToggleStep, disabled = false }) {
  const done = countCompleted(steps);
  const pct = progressPercent(steps);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Checklist
          </h2>
          <p className="text-sm text-slate-400">
            {done} of {RELEASE_STEPS.length} complete
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden h-2 w-32 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 sm:block">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
            {pct}%
          </span>
        </div>
      </div>

      <div className="grid gap-2.5">
        {RELEASE_STEPS.map((step) => (
          <StepItem
            key={step}
            label={STEP_LABELS[step]}
            checked={Boolean(steps[step])}
            disabled={disabled}
            onToggle={() => onToggleStep?.(step, !steps[step])}
          />
        ))}
      </div>
    </div>
  );
}
