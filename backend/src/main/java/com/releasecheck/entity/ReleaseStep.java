package com.releasecheck.entity;

/**
 * The fixed set of steps that make up a release checklist.
 *
 * <p>Using an enum (instead of free-text strings) gives us a closed,
 * type-safe vocabulary: the compiler guarantees only valid steps can ever be
 * referenced, and the database stores their names as strings via
 * {@code @Enumerated(EnumType.STRING)}.
 */
public enum ReleaseStep {
    PRS_MERGED,
    CHANGELOG_UPDATED,
    TESTS_PASSING,
    GITHUB_RELEASE_CREATED,
    STAGING_DEPLOYED,
    QA_VERIFIED,
    PRODUCTION_DEPLOYED,
    SMOKE_TESTED
}
