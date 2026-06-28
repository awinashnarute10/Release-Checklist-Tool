/**
 * Adapters between the backend's API contract and the shape the frontend
 * components expect.
 *
 *   backend                         frontend
 *   --------------------------------------------------
 *   releaseDate (datetime)     <->  date
 *   additionalInfo             <->  remarks
 *   completedSteps (array)     <->  steps (map of step -> boolean)
 *   { step, completed }        <->  { [step]: boolean }  (toggle)
 *
 * Keeping this here means the components and the mock layer stay unchanged —
 * only the real-API branch in releases.js passes through these functions.
 */
import { RELEASE_STEPS, emptyChecklist } from "../constants";

/** Convert an array of completed step names into a full {step: boolean} map. */
function stepsArrayToMap(completedSteps = []) {
  const steps = emptyChecklist();
  completedSteps.forEach((step) => {
    if (step in steps) steps[step] = true;
  });
  return steps;
}

/** A `ReleaseResponse` (full) -> frontend release. */
export function fromReleaseResponse(dto) {
  return {
    id: dto.id,
    name: dto.name,
    date: dto.releaseDate,
    status: dto.status,
    steps: stepsArrayToMap(dto.completedSteps),
    remarks: dto.additionalInfo ?? "",
    createdAt: dto.createdAt ?? null,
    updatedAt: dto.updatedAt ?? null,
  };
}

/**
 * A `ReleaseSummaryResponse` (list item) -> frontend release.
 *
 * The summary endpoint omits *which* steps are done (only the count), so we
 * synthesize a steps map that preserves the count — all the list/table UI needs
 * for its progress bar. The detail page fetches the full release, which carries
 * the exact steps.
 */
export function fromReleaseSummary(dto) {
  const steps = emptyChecklist();
  const count = Math.min(dto.completedStepCount ?? 0, RELEASE_STEPS.length);
  for (let i = 0; i < count; i++) {
    steps[RELEASE_STEPS[i]] = true;
  }
  return {
    id: dto.id,
    name: dto.name,
    date: dto.releaseDate,
    status: dto.status,
    steps,
    remarks: "",
    createdAt: dto.createdAt ?? null,
    updatedAt: dto.updatedAt ?? null,
  };
}

/** Frontend create input `{ name, date }` -> backend `CreateReleaseRequest`. */
export function toCreateRequest({ name, date, additionalInfo }) {
  return {
    name,
    releaseDate: toLocalDateTime(date),
    additionalInfo: additionalInfo ?? null,
  };
}

/**
 * Frontend single-key partial steps `{ STEP: boolean }` -> backend
 * `ToggleStepRequest` `{ step, completed }`.
 */
export function toToggleStepRequest(partialSteps) {
  const [step, completed] = Object.entries(partialSteps)[0] ?? [];
  return { step, completed: Boolean(completed) };
}

/**
 * The backend's releaseDate is a LocalDateTime. The create form provides a
 * date-only value ("2026-07-01"); add a midnight time component so Jackson can
 * parse it. Datetime values are passed through untouched.
 */
function toLocalDateTime(date) {
  if (!date) return date;
  return date.includes("T") ? date : `${date}T00:00:00`;
}
