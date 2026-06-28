/**
 * App-wide constants: domain enums, human-readable labels, status styling
 * and TanStack Query cache keys. Keeping these centralized means the UI and
 * the data layer never disagree about valid values.
 */

/** @typedef {"PLANNED" | "ONGOING" | "DONE"} ReleaseStatus */
/**
 * @typedef {"PRS_MERGED" | "CHANGELOG_UPDATED" | "TESTS_PASSING"
 *   | "GITHUB_RELEASE_CREATED" | "STAGING_DEPLOYED" | "QA_VERIFIED"
 *   | "PRODUCTION_DEPLOYED" | "SMOKE_TESTED"} ReleaseStep
 */

export const RELEASE_STATUSES = ["PLANNED", "ONGOING", "DONE"];

/** Ordered list of steps — drives checklist rendering order. */
export const RELEASE_STEPS = [
  "PRS_MERGED",
  "CHANGELOG_UPDATED",
  "TESTS_PASSING",
  "GITHUB_RELEASE_CREATED",
  "STAGING_DEPLOYED",
  "QA_VERIFIED",
  "PRODUCTION_DEPLOYED",
  "SMOKE_TESTED",
];

/** Human-readable labels matching the wireframe copy. */
export const STEP_LABELS = {
  PRS_MERGED: "Pull requests merged",
  CHANGELOG_UPDATED: "Changelog updated",
  TESTS_PASSING: "Tests passing",
  GITHUB_RELEASE_CREATED: "Github release created",
  STAGING_DEPLOYED: "Deployed to staging",
  QA_VERIFIED: "QA verified",
  PRODUCTION_DEPLOYED: "Production deployed",
  SMOKE_TESTED: "Smoke testing complete",
};

export const STATUS_LABELS = {
  PLANNED: "Planned",
  ONGOING: "Ongoing",
  DONE: "Done",
};

/**
 * Status → Tailwind classes. Gray / Orange / Green per the spec.
 * Each entry carries badge styling and an accent dot color.
 */
export const STATUS_STYLES = {
  PLANNED: {
    badge:
      "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
    dot: "bg-slate-400",
  },
  ONGOING: {
    badge:
      "bg-orange-100 text-orange-700 ring-orange-200 dark:bg-orange-500/15 dark:text-orange-300 dark:ring-orange-500/30",
    dot: "bg-orange-500",
  },
  DONE: {
    badge:
      "bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30",
    dot: "bg-emerald-500",
  },
};

/** Returns an empty checklist with every step set to false. */
export const emptyChecklist = () =>
  RELEASE_STEPS.reduce((acc, step) => {
    acc[step] = false;
    return acc;
  }, {});

/** Centralized query keys for cache reads/invalidations. */
export const queryKeys = {
  releases: ["releases"],
  release: (id) => ["releases", id],
};

export const THEME_STORAGE_KEY = "rc-theme";
