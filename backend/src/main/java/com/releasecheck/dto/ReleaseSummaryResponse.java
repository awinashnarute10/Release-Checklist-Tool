package com.releasecheck.dto;

import com.releasecheck.entity.ReleaseStatus;
import java.time.LocalDateTime;

/**
 * Lightweight representation for list views — omits the full step set and
 * remarks to keep list payloads small, while still exposing the derived status
 * and a progress count for rendering badges/progress bars.
 */
public record ReleaseSummaryResponse(
        Long id,
        String name,
        LocalDateTime releaseDate,
        ReleaseStatus status,
        int completedStepCount,
        int totalStepCount) {
}
