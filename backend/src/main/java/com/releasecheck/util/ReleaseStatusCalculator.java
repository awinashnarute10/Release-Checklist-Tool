package com.releasecheck.util;

import com.releasecheck.entity.ReleaseStatus;
import com.releasecheck.entity.ReleaseStep;
import java.util.Set;

/**
 * Pure, stateless logic for deriving a {@link ReleaseStatus} from the set of
 * completed steps.
 *
 * <p>The rules:
 * <pre>
 *   0 completed steps        -> PLANNED
 *   1..(total-1) completed   -> ONGOING
 *   all steps completed      -> DONE
 * </pre>
 *
 * <p>This lives in its own class (rather than inline in the entity) so it can
 * be unit-tested in isolation with no database or Spring context.
 */
public final class ReleaseStatusCalculator {

    /** Total number of steps in a complete checklist. */
    public static final int TOTAL_STEPS = ReleaseStep.values().length;

    private ReleaseStatusCalculator() {
        // utility class — no instances
    }

    /**
     * @param completedSteps the steps marked complete (may be {@code null})
     * @return the derived status
     */
    public static ReleaseStatus compute(Set<ReleaseStep> completedSteps) {
        int completed = completedSteps == null ? 0 : completedSteps.size();
        if (completed == 0) {
            return ReleaseStatus.PLANNED;
        }
        if (completed >= TOTAL_STEPS) {
            return ReleaseStatus.DONE;
        }
        return ReleaseStatus.ONGOING;
    }
}
