package com.releasecheck.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.releasecheck.dto.CreateReleaseRequest;
import com.releasecheck.dto.ToggleStepRequest;
import com.releasecheck.dto.UpdateInfoRequest;
import com.releasecheck.entity.Release;
import com.releasecheck.entity.ReleaseStep;
import com.releasecheck.exception.ResourceNotFoundException;
import com.releasecheck.mapper.ReleaseMapper;
import com.releasecheck.repository.ReleaseRepository;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ReleaseServiceTest {

    @Mock
    private ReleaseRepository releaseRepository;

    // The real mapper is simple/pure, but we mock it here to keep the service
    // test focused purely on service behavior.
    @Mock
    private ReleaseMapper releaseMapper;

    @InjectMocks
    private ReleaseService releaseService;

    private Release sampleRelease() {
        return Release.builder()
                .id(1L)
                .name("Version 1.0")
                .releaseDate(LocalDateTime.parse("2026-09-20T10:00:00"))
                .completedSteps(new HashSet<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void createRelease_savesMappedEntity() {
        CreateReleaseRequest request = new CreateReleaseRequest(
                "Version 1.0", LocalDateTime.parse("2026-09-20T10:00:00"), null);
        Release entity = sampleRelease();
        when(releaseMapper.toEntity(request)).thenReturn(entity);
        when(releaseRepository.save(entity)).thenReturn(entity);

        releaseService.createRelease(request);

        verify(releaseRepository).save(entity);
        verify(releaseMapper).toResponse(entity);
    }

    @Test
    void getRelease_whenMissing_throwsNotFound() {
        when(releaseRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> releaseService.getRelease(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void toggleStep_completedTrue_addsStep() {
        Release entity = sampleRelease();
        when(releaseRepository.findById(1L)).thenReturn(Optional.of(entity));
        when(releaseRepository.saveAndFlush(any(Release.class))).thenAnswer(inv -> inv.getArgument(0));

        releaseService.toggleStep(1L, new ToggleStepRequest(ReleaseStep.TESTS_PASSING, true));

        assertThat(entity.getCompletedSteps()).contains(ReleaseStep.TESTS_PASSING);
    }

    @Test
    void toggleStep_completedFalse_removesStep() {
        Release entity = sampleRelease();
        entity.getCompletedSteps().add(ReleaseStep.TESTS_PASSING);
        when(releaseRepository.findById(1L)).thenReturn(Optional.of(entity));
        when(releaseRepository.saveAndFlush(any(Release.class))).thenAnswer(inv -> inv.getArgument(0));

        releaseService.toggleStep(1L, new ToggleStepRequest(ReleaseStep.TESTS_PASSING, false));

        assertThat(entity.getCompletedSteps()).doesNotContain(ReleaseStep.TESTS_PASSING);
    }

    @Test
    void updateInfo_setsAdditionalInfo() {
        Release entity = sampleRelease();
        when(releaseRepository.findById(1L)).thenReturn(Optional.of(entity));
        when(releaseRepository.saveAndFlush(any(Release.class))).thenAnswer(inv -> inv.getArgument(0));

        releaseService.updateInfo(1L, new UpdateInfoRequest("Updated remarks"));

        ArgumentCaptor<Release> captor = ArgumentCaptor.forClass(Release.class);
        verify(releaseRepository).saveAndFlush(captor.capture());
        assertThat(captor.getValue().getAdditionalInfo()).isEqualTo("Updated remarks");
    }

    @Test
    void deleteRelease_whenMissing_throwsAndDoesNotDelete() {
        when(releaseRepository.findById(5L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> releaseService.deleteRelease(5L))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(releaseRepository, never()).delete(any());
    }
}
