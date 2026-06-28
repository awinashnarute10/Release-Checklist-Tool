import { Link } from "react-router-dom";
import { StatusBadge } from "./StatusBadge";
import { Button } from "./ui/Button";
import { EyeIcon, TrashIcon } from "./icons";
import {
  countCompleted,
  formatDateShort,
  progressPercent,
} from "../utils";
import { RELEASE_STEPS } from "../constants";

/**
 * Mobile/tablet card representation of a release. Buttons stack on the
 * narrowest screens for easy tapping.
 */
export function ReleaseCard({ release, onDelete }) {
  const done = countCompleted(release.steps);
  const pct = progressPercent(release.steps);

  return (
    <div className="animate-slide-up rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-200 transition-shadow hover:shadow-soft-lg dark:bg-slate-900 dark:ring-slate-800">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={`/releases/${release.id}`}
            className="block truncate text-base font-bold text-slate-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-400"
          >
            {release.name}
          </Link>
          <p className="mt-0.5 text-sm text-slate-400">
            {formatDateShort(release.date)}
          </p>
        </div>
        <StatusBadge status={release.status} />
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-400">
          <span>Checklist</span>
          <span>
            {done}/{RELEASE_STEPS.length}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          as={Link}
          to={`/releases/${release.id}`}
          variant="secondary"
          size="sm"
          className="flex-1 justify-center"
        >
          <EyeIcon /> View
        </Button>
        <Button
          variant="danger-ghost"
          size="sm"
          className="flex-1 justify-center"
          onClick={() => onDelete?.(release)}
        >
          <TrashIcon /> Delete
        </Button>
      </div>
    </div>
  );
}
