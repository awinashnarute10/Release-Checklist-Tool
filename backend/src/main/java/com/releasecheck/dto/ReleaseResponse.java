package com.releasecheck.dto;

import com.releasecheck.entity.ReleaseStatus;
import com.releasecheck.entity.ReleaseStep;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * Full representation of a release returned to clients. Includes the derived
 * {@code status} and the completed steps. This is a DTO (not the entity) so the
 * API contract is decoupled from the persistence model.
 */
public record ReleaseResponse(
        Long id,
        String name,
        LocalDateTime releaseDate,
        String additionalInfo,
        ReleaseStatus status,
        Set<ReleaseStep> completedSteps,
        int completedStepCount,
        int totalStepCount,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
