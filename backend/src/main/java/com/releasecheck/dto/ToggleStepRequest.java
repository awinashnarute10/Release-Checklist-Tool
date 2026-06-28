package com.releasecheck.dto;

import com.releasecheck.entity.ReleaseStep;
import jakarta.validation.constraints.NotNull;

/**
 * Payload for toggling a single checklist step on or off.
 *
 * <p>{@code step} is bound to the {@link ReleaseStep} enum — an unknown value
 * is rejected during JSON deserialization and surfaced as a 400.
 */
public record ToggleStepRequest(
        @NotNull(message = "step is required")
        ReleaseStep step,

        @NotNull(message = "completed is required")
        Boolean completed) {
}
