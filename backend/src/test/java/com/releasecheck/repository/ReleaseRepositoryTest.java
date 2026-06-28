package com.releasecheck.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.releasecheck.entity.Release;
import com.releasecheck.entity.ReleaseStep;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
class ReleaseRepositoryTest {

    @Autowired
    private ReleaseRepository releaseRepository;

    private Release newRelease(String name, LocalDateTime date, Set<ReleaseStep> steps) {
        return Release.builder()
                .name(name)
                .releaseDate(date)
                .completedSteps(steps)
                .build();
    }

    @Test
    void savesAndLoadsCompletedSteps() {
        Set<ReleaseStep> steps = new HashSet<>(Set.of(
                ReleaseStep.PRS_MERGED, ReleaseStep.TESTS_PASSING));
        Release saved = releaseRepository.save(
                newRelease("Version 1.0", LocalDateTime.parse("2026-09-20T10:00:00"), steps));

        Release found = releaseRepository.findById(saved.getId()).orElseThrow();

        assertThat(found.getId()).isNotNull();
        assertThat(found.getCreatedAt()).isNotNull();
        assertThat(found.getUpdatedAt()).isNotNull();
        assertThat(found.getCompletedSteps())
                .containsExactlyInAnyOrder(ReleaseStep.PRS_MERGED, ReleaseStep.TESTS_PASSING);
    }

    @Test
    void findAllByOrderByReleaseDateDesc_ordersNewestFirst() {
        releaseRepository.save(
                newRelease("Old", LocalDateTime.parse("2026-01-01T10:00:00"), new HashSet<>()));
        releaseRepository.save(
                newRelease("New", LocalDateTime.parse("2026-12-01T10:00:00"), new HashSet<>()));

        List<Release> all = releaseRepository.findAllByOrderByReleaseDateDesc();

        assertThat(all).extracting(Release::getName).containsExactly("New", "Old");
    }

    @Test
    void deleteRemovesRelease() {
        Release saved = releaseRepository.save(
                newRelease("Temp", LocalDateTime.parse("2026-05-01T10:00:00"), new HashSet<>()));

        releaseRepository.delete(saved);

        assertThat(releaseRepository.findById(saved.getId())).isEmpty();
    }
}
