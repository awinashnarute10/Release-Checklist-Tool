package com.releasecheck.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.releasecheck.dto.ReleaseResponse;
import com.releasecheck.dto.ReleaseSummaryResponse;
import com.releasecheck.entity.ReleaseStatus;
import com.releasecheck.entity.ReleaseStep;
import com.releasecheck.exception.ResourceNotFoundException;
import com.releasecheck.service.ReleaseService;
import java.time.LocalDateTime;
import java.util.EnumSet;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ReleaseController.class)
class ReleaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ReleaseService releaseService;

    private ReleaseResponse sampleResponse() {
        return new ReleaseResponse(
                1L,
                "Version 1.0",
                LocalDateTime.parse("2026-09-20T10:00:00"),
                "info",
                ReleaseStatus.ONGOING,
                EnumSet.of(ReleaseStep.PRS_MERGED),
                1,
                8,
                LocalDateTime.parse("2026-09-01T08:00:00"),
                LocalDateTime.parse("2026-09-01T08:00:00"));
    }

    @Test
    void getAll_returnsSummaries() throws Exception {
        when(releaseService.getAllReleases()).thenReturn(List.of(new ReleaseSummaryResponse(
                1L, "Version 1.0", LocalDateTime.parse("2026-09-20T10:00:00"),
                ReleaseStatus.PLANNED, 0, 8)));

        mockMvc.perform(get("/api/releases"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Version 1.0"))
                .andExpect(jsonPath("$[0].status").value("PLANNED"));
    }

    @Test
    void getOne_returnsRelease() throws Exception {
        when(releaseService.getRelease(1L)).thenReturn(sampleResponse());

        mockMvc.perform(get("/api/releases/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.status").value("ONGOING"));
    }

    @Test
    void getOne_whenMissing_returns404() throws Exception {
        when(releaseService.getRelease(99L))
                .thenThrow(new ResourceNotFoundException("Release", 99L));

        mockMvc.perform(get("/api/releases/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Release not found with id: 99"));
    }

    @Test
    void create_withValidBody_returns201() throws Exception {
        when(releaseService.createRelease(any())).thenReturn(sampleResponse());

        String body = """
                {"name":"Version 2.0","releaseDate":"2026-07-01T10:00:00","additionalInfo":"Production release"}
                """;

        mockMvc.perform(post("/api/releases")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void create_withBlankName_returns400WithFieldErrors() throws Exception {
        String body = """
                {"name":"","releaseDate":"2026-07-01T10:00:00"}
                """;

        mockMvc.perform(post("/api/releases")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors[0].field").value("name"));
    }

    @Test
    void create_withMissingDate_returns400() throws Exception {
        String body = """
                {"name":"Version 2.0"}
                """;

        mockMvc.perform(post("/api/releases")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void toggleStep_returnsUpdatedRelease() throws Exception {
        when(releaseService.toggleStep(eq(1L), any())).thenReturn(sampleResponse());

        String body = """
                {"step":"TESTS_PASSING","completed":true}
                """;

        mockMvc.perform(patch("/api/releases/1/steps")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void toggleStep_withInvalidStep_returns400() throws Exception {
        String body = """
                {"step":"NOT_A_STEP","completed":true}
                """;

        mockMvc.perform(patch("/api/releases/1/steps")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateInfo_returnsUpdatedRelease() throws Exception {
        when(releaseService.updateInfo(eq(1L), any())).thenReturn(sampleResponse());

        String body = """
                {"additionalInfo":"new notes"}
                """;

        mockMvc.perform(patch("/api/releases/1/info")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk());
    }

    @Test
    void delete_returns204() throws Exception {
        mockMvc.perform(delete("/api/releases/1"))
                .andExpect(status().isNoContent());
        verify(releaseService).deleteRelease(1L);
    }
}
