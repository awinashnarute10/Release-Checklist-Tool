package com.releasecheck.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Consistent error body returned by {@code GlobalExceptionHandler} for every
 * failure. A single, predictable shape makes client-side error handling simple.
 *
 * @param timestamp   when the error occurred
 * @param status      HTTP status code
 * @param error       HTTP status reason phrase (e.g. "Not Found")
 * @param message     human-readable summary
 * @param path        request path that produced the error
 * @param fieldErrors per-field validation messages (null for non-validation errors)
 */
public record ErrorResponse(
        LocalDateTime timestamp,
        int status,
        String error,
        String message,
        String path,
        List<FieldValidationError> fieldErrors) {

    /** A single field-level validation failure. */
    public record FieldValidationError(String field, String message) {
    }

    /** Convenience factory for errors without field-level detail. */
    public static ErrorResponse of(int status, String error, String message, String path) {
        return new ErrorResponse(LocalDateTime.now(), status, error, message, path, null);
    }
}
