import { Link } from "react-router-dom";
import { StatusBadge } from "./StatusBadge";
import { Button } from "./ui/Button";
import { ReleaseCard } from "./ReleaseCard";
import { ChevronDownIcon, EyeIcon, TrashIcon } from "./icons";
import {
  countCompleted,
  formatDateShort,
  progressPercent,
} from "../utils";
import { RELEASE_STEPS } from "../constants";
import { cn } from "../utils";

function SortHeader({ label, active, direction, onClick, className }) {
  return (
    <th className={cn("px-6 py-3.5 text-left font-semibold", className)}>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1 transition-colors hover:text-slate-700 dark:hover:text-slate-200"
      >
        {label}
        <ChevronDownIcon
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            active ? "opacity-100" : "opacity-0 group-hover:opacity-50",
            active && direction === "asc" && "rotate-180",
          )}
        />
      </button>
    </th>
  );
}

/**
 * Responsive release listing:
 * - Desktop (md+): full data table with sortable Date column
 * - Tablet/Mobile: stacked cards
 */
export function ReleaseTable({ releases, onDelete, sort, onSortChange }) {
  const toggleSort = (key) => {
    if (!onSortChange) return;
    if (sort?.key === key) {
      onSortChange({
        key,
        direction: sort.direction === "asc" ? "desc" : "asc",
      });
    } else {
      onSortChange({ key, direction: "asc" });
    }
  };

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 md:block">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800 dark:bg-slate-900/40">
            <tr className="group">
              <th className="px-6 py-3.5 text-left font-semibold">Release</th>
              <SortHeader
                label="Date"
                active={sort?.key === "date"}
                direction={sort?.direction}
                onClick={() => toggleSort("date")}
              />
              <th className="px-6 py-3.5 text-left font-semibold">Status</th>
              <th className="px-6 py-3.5 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {releases.map((release) => {
              const done = countCompleted(release.steps);
              const pct = progressPercent(release.steps);
              return (
                <tr
                  key={release.id}
                  className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                >
                  <td className="px-6 py-4">
                    <Link
                      to={`/releases/${release.id}`}
                      className="font-semibold text-slate-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-400"
                    >
                      {release.name}
                    </Link>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-brand-500 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">
                        {done}/{RELEASE_STEPS.length}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {formatDateShort(release.date)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={release.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        as={Link}
                        to={`/releases/${release.id}`}
                        variant="ghost"
                        size="sm"
                      >
                        <EyeIcon /> View
                      </Button>
                      <Button
                        variant="danger-ghost"
                        size="sm"
                        onClick={() => onDelete?.(release)}
                      >
                        <TrashIcon /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile / tablet cards */}
      <div className="grid gap-4 md:hidden">
        {releases.map((release) => (
          <ReleaseCard
            key={release.id}
            release={release}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
}
