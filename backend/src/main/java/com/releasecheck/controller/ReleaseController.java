package com.releasecheck.controller;

import com.releasecheck.dto.CreateReleaseRequest;
import com.releasecheck.dto.ReleaseResponse;
import com.releasecheck.dto.ReleaseSummaryResponse;
import com.releasecheck.dto.ToggleStepRequest;
import com.releasecheck.dto.UpdateInfoRequest;
import com.releasecheck.service.ReleaseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST API for releases.
 *
 * <p>The controller is a thin HTTP adapter: it binds/validates the request,
 * delegates to {@link ReleaseService}, and maps the result to an HTTP response.
 * It contains no business logic — that lives in the service.
 */
@RestController
@RequestMapping("/api/releases")
@RequiredArgsConstructor
@Tag(name = "Releases", description = "Manage software releases and their checklists")
public class ReleaseController {

    private final ReleaseService releaseService;

    @GetMapping
    @Operation(summary = "List all releases")
    public List<ReleaseSummaryResponse> getAll() {
        return releaseService.getAllReleases();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a release by id")
    public ReleaseResponse getOne(@PathVariable Long id) {
        return releaseService.getRelease(id);
    }

    @PostMapping
    @Operation(summary = "Create a release")
    public ResponseEntity<ReleaseResponse> create(
            @Valid @RequestBody CreateReleaseRequest request) {
        ReleaseResponse created = releaseService.createRelease(request);
        return ResponseEntity
                .created(URI.create("/api/releases/" + created.id()))
                .body(created);
    }

    @PatchMapping("/{id}/info")
    @Operation(summary = "Update a release's additional information")
    public ReleaseResponse updateInfo(
            @PathVariable Long id, @Valid @RequestBody UpdateInfoRequest request) {
        return releaseService.updateInfo(id, request);
    }

    @PatchMapping("/{id}/steps")
    @Operation(summary = "Toggle a checklist step on or off")
    public ReleaseResponse toggleStep(
            @PathVariable Long id, @Valid @RequestBody ToggleStepRequest request) {
        return releaseService.toggleStep(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a release")
    public void delete(@PathVariable Long id) {
        releaseService.deleteRelease(id);
    }
}
