import { useEffect, useState } from "react";
import { StatusBadge } from "./StatusBadge";
import { StepChecklist } from "./StepChecklist";
import { Textarea } from "./ui/Textarea";
import { Button } from "./ui/Button";
import { formatDateLong } from "../utils";

/**
 * Composes the release detail view: header (name/date/status), the checklist,
 * and the editable remarks panel with its own dirty-tracking Save button.
 */
export function ReleaseDetails({
  release,
  onToggleStep,
  togglingStep = false,
  onSaveRemarks,
  savingRemarks = false,
}) {
  const [remarks, setRemarks] = useState(release.remarks ?? "");

  // Keep local draft in sync if the underlying release changes (e.g. refetch).
  useEffect(() => {
    setRemarks(release.remarks ?? "");
  }, [release.id, release.remarks]);

  const dirty = remarks !== (release.remarks ?? "");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {release.name}
              </h1>
              <StatusBadge status={release.status} />
            </div>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Target date · {formatDateLong(release.date)}
            </p>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <StepChecklist
        steps={release.steps}
        onToggleStep={onToggleStep}
        disabled={togglingStep}
      />

      {/* Remarks */}
      <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-6">
        <Textarea
          label="Additional remarks"
          placeholder="Notes, blockers, links to the release ticket…"
          value={remarks}
          rows={4}
          onChange={(e) => setRemarks(e.target.value)}
        />
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            {dirty ? "Unsaved changes" : "All changes saved"}
          </p>
          <Button
            onClick={() => onSaveRemarks?.(remarks)}
            disabled={!dirty}
            loading={savingRemarks}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
