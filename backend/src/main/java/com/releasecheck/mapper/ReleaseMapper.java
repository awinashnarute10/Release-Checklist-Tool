package com.releasecheck.mapper;

import com.releasecheck.dto.CreateReleaseRequest;
import com.releasecheck.dto.ReleaseResponse;
import com.releasecheck.dto.ReleaseSummaryResponse;
import com.releasecheck.entity.Release;
import com.releasecheck.entity.ReleaseStep;
import com.releasecheck.util.ReleaseStatusCalculator;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.Set;
import org.springframework.stereotype.Component;

/**
 * Translates between persistence entities and API DTOs.
 *
 * <p>Registered as a {@code @Component} so it can be dependency-injected into
 * the service (and easily swapped/mocked in tests). Keeping mapping logic here
 * keeps controllers and services free of conversion boilerplate.
 */
@Component
public class ReleaseMapper {

    /** Build a new entity from a create request. */
    public Release toEntity(CreateReleaseRequest request) {
        return Release.builder()
                .name(request.name())
                .releaseDate(request.releaseDate())
                .additionalInfo(request.additionalInfo())
                .completedSteps(new HashSet<>())
                .build();
    }

    /** Full response, including derived status and progress counts. */
    public ReleaseResponse toResponse(Release release) {
        Set<ReleaseStep> steps = orderedCopy(release.getCompletedSteps());
        return new ReleaseResponse(
                release.getId(),
                release.getName(),
                release.getReleaseDate(),
                release.getAdditionalInfo(),
                release.getStatus(),
                steps,
                steps.size(),
                ReleaseStatusCalculator.TOTAL_STEPS,
                release.getCreatedAt(),
                release.getUpdatedAt());
    }

    /** Compact response for list endpoints. */
    public ReleaseSummaryResponse toSummary(Release release) {
        int completed = release.getCompletedSteps() == null
                ? 0
                : release.getCompletedSteps().size();
        return new ReleaseSummaryResponse(
                release.getId(),
                release.getName(),
                release.getReleaseDate(),
                release.getStatus(),
                completed,
                ReleaseStatusCalculator.TOTAL_STEPS);
    }

    /**
     * Return the steps in their natural enum order for stable, predictable JSON
     * output. {@link EnumSet#copyOf} requires a non-empty source, so guard it.
     */
    private Set<ReleaseStep> orderedCopy(Set<ReleaseStep> steps) {
        if (steps == null || steps.isEmpty()) {
            return EnumSet.noneOf(ReleaseStep.class);
        }
        return EnumSet.copyOf(steps);
    }
}
