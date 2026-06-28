package com.releasecheck.util;

import static org.assertj.core.api.Assertions.assertThat;

import com.releasecheck.entity.ReleaseStatus;
import com.releasecheck.entity.ReleaseStep;
import java.util.EnumSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ReleaseStatusCalculatorTest {

    @Test
    void noStepsCompleted_isPlanned() {
        assertThat(ReleaseStatusCalculator.compute(EnumSet.noneOf(ReleaseStep.class)))
                .isEqualTo(ReleaseStatus.PLANNED);
    }

    @Test
    void nullSteps_isPlanned() {
        assertThat(ReleaseStatusCalculator.compute(null)).isEqualTo(ReleaseStatus.PLANNED);
    }

    @Test
    void someStepsCompleted_isOngoing() {
        Set<ReleaseStep> steps = EnumSet.of(ReleaseStep.PRS_MERGED, ReleaseStep.TESTS_PASSING);
        assertThat(ReleaseStatusCalculator.compute(steps)).isEqualTo(ReleaseStatus.ONGOING);
    }

    @Test
    void allStepsCompleted_isDone() {
        Set<ReleaseStep> steps = EnumSet.allOf(ReleaseStep.class);
        assertThat(ReleaseStatusCalculator.compute(steps)).isEqualTo(ReleaseStatus.DONE);
    }

    @Test
    void totalSteps_matchesEnumSize() {
        assertThat(ReleaseStatusCalculator.TOTAL_STEPS).isEqualTo(ReleaseStep.values().length);
    }
}
