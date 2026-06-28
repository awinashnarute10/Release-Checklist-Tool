package com.releasecheck.entity;

import com.releasecheck.util.ReleaseStatusCalculator;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A software release and its checklist progress.
 *
 * <p>Note that {@code status} is <em>not</em> a persisted column — it is
 * computed on demand by {@link #getStatus()} from {@link #completedSteps}.
 */
@Entity
@Table(name = "releases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Release {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "release_date", nullable = false)
    private LocalDateTime releaseDate;

    @Column(name = "additional_info", length = 5000)
    private String additionalInfo;

    /**
     * The completed steps, stored in the {@code release_completed_steps} table.
     *
     * <p>{@code @ElementCollection} models a collection of <em>value</em>
     * objects (here, enum values) owned by this entity — no separate entity or
     * repository is needed. {@code EnumType.STRING} persists the readable enum
     * name ("TESTS_PASSING") rather than a brittle ordinal index. We fetch
     * eagerly because the set is small and always needed to compute status.
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "release_completed_steps",
            joinColumns = @JoinColumn(name = "release_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "step", length = 64, nullable = false)
    @Builder.Default
    private Set<ReleaseStep> completedSteps = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * Computes the status from the checklist progress. Marked
     * {@code @Transient} so JPA never tries to map it to a column.
     */
    @Transient
    public ReleaseStatus getStatus() {
        return ReleaseStatusCalculator.compute(completedSteps);
    }

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
