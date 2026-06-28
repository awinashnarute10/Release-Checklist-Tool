package com.releasecheck.repository;

import com.releasecheck.entity.Release;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Data-access layer for {@link Release}.
 *
 * <p>By extending {@link JpaRepository} we inherit a full set of CRUD
 * operations (save, findById, findAll, delete, ...) with zero implementation
 * code — Spring Data generates the implementation at runtime. We only declare
 * the extra query we need; Spring derives the SQL from the method name.
 */
@Repository
public interface ReleaseRepository extends JpaRepository<Release, Long> {

    /** All releases, newest target date first. */
    List<Release> findAllByOrderByReleaseDateDesc();
}
