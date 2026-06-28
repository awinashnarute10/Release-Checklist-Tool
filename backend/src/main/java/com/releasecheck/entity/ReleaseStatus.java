package com.releasecheck.entity;

/**
 * The lifecycle status of a release.
 *
 * <p>This value is <strong>never persisted</strong> — it is always computed
 * from how many checklist steps are completed (see
 * {@link com.releasecheck.util.ReleaseStatusCalculator}). Keeping it derived
 * means the status can never drift out of sync with the underlying data.
 */
public enum ReleaseStatus {
    PLANNED,
    ONGOING,
    DONE
}
