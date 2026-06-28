package com.releasecheck.dto;

import jakarta.validation.constraints.Size;

/**
 * Payload for updating a release's additional information.
 * The field is optional (may be blank or null to clear it).
 */
public record UpdateInfoRequest(
        @Size(max = 5000, message = "additionalInfo must be at most 5000 characters")
        String additionalInfo) {
}
