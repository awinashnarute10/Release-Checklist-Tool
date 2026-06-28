package com.releasecheck.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * Payload for creating a release.
 *
 * <p>A {@code record} is ideal for DTOs: it is immutable, generates the
 * constructor/accessors/equals/hashCode for us, and Bean Validation
 * annotations work directly on its components.
 */
public record CreateReleaseRequest(
        @NotBlank(message = "name is required")
        @Size(max = 255, message = "name must be at most 255 characters")
        String name,

        @NotNull(message = "releaseDate is required")
        LocalDateTime releaseDate,

        @Size(max = 5000, message = "additionalInfo must be at most 5000 characters")
        String additionalInfo) {
}
