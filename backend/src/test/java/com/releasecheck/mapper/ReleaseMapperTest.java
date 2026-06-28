package com.releasecheck.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import com.releasecheck.dto.CreateReleaseRequest;
import com.releasecheck.dto.ReleaseResponse;
import com.releasecheck.dto.ReleaseSummaryResponse;
import com.releasecheck.entity.Release;
import com.releasecheck.entity.ReleaseStatus;
import com.releasecheck.entity.ReleaseStep;
import java.time.LocalDateTime;
import java.util.EnumSet;
import org.junit.jupiter.api.Test;

class ReleaseMapperTest {

    private final ReleaseMapper mapper = new ReleaseMapper();

    @Test
    void toEntity_copiesFieldsAndStartsWithNoSteps() {
        CreateReleaseRequest request = new CreateReleaseRequest(
                "Version 2.0", LocalDateTime.parse("2026-07-01T10:00:00"), "Production release");

        Release entity = mapper.toEntity(request);

        assertThat(entity.getName()).isEqualTo("Version 2.0");
        assertThat(entity.getReleaseDate()).isEqualTo(LocalDateTime.parse("2026-07-01T10:00:00"));
        assertThat(entity.getAdditionalInfo()).isEqualTo("Production release");
        assertThat(entity.getCompletedSteps()).isEmpty();
    }

    @Test
    void toResponse_includesDerivedStatusAndCounts() {
        Release release = Release.builder()
                .id(1L)
                .name("Version 1.1")
                .releaseDate(LocalDateTime.parse("2026-09-28T09:00:00"))
                .additionalInfo("notes")
                .completedSteps(EnumSet.of(ReleaseStep.PRS_MERGED, ReleaseStep.TESTS_PASSING))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        ReleaseResponse response = mapper.toResponse(release);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.status()).isEqualTo(ReleaseStatus.ONGOING);
        assertThat(response.completedStepCount()).isEqualTo(2);
        assertThat(response.totalStepCount()).isEqualTo(ReleaseStep.values().length);
        assertThat(response.completedSteps())
                .containsExactlyInAnyOrder(ReleaseStep.PRS_MERGED, ReleaseStep.TESTS_PASSING);
    }

    @Test
    void toSummary_isPlannedWhenNoSteps() {
        Release release = Release.builder()
                .id(2L)
                .name("Version 2.0")
                .releaseDate(LocalDateTime.parse("2026-10-10T09:00:00"))
                .completedSteps(EnumSet.noneOf(ReleaseStep.class))
                .build();

        ReleaseSummaryResponse summary = mapper.toSummary(release);

        assertThat(summary.status()).isEqualTo(ReleaseStatus.PLANNED);
        assertThat(summary.completedStepCount()).isZero();
    }
}
