/**
 * Releases API service.
 *
 * Each function maps 1:1 to a backend endpoint. When USE_MOCK is on calls are
 * routed to the localStorage mock so the app is fully functional with no
 * server. With VITE_USE_MOCK=false they hit the real Spring Boot backend, and
 * requests/responses are translated by the adapters so the components don't
 * need to know about the backend's field names.
 *
 *   GET    /api/releases
 *   GET    /api/releases/:id
 *   POST   /api/releases
 *   PATCH  /api/releases/:id/steps
 *   PATCH  /api/releases/:id/info
 *   DELETE /api/releases/:id
 */
import { apiClient, USE_MOCK } from "./client";
import { mockApi } from "./mock";
import {
  fromReleaseResponse,
  fromReleaseSummary,
  toCreateRequest,
  toToggleStepRequest,
} from "./adapters";

export const releasesApi = {
  /** GET /releases */
  list: () =>
    USE_MOCK
      ? mockApi.list()
      : apiClient.get("/releases").then((r) => r.data.map(fromReleaseSummary)),

  /** GET /releases/:id */
  get: (id) =>
    USE_MOCK
      ? mockApi.get(id)
      : apiClient.get(`/releases/${id}`).then((r) => fromReleaseResponse(r.data)),

  /** POST /releases */
  create: (input) =>
    USE_MOCK
      ? mockApi.create(input)
      : apiClient
          .post("/releases", toCreateRequest(input))
          .then((r) => fromReleaseResponse(r.data)),

  /** PATCH /releases/:id/steps — frontend passes a single-key {step: bool}. */
  updateSteps: (id, partialSteps) =>
    USE_MOCK
      ? mockApi.updateSteps(id, partialSteps)
      : apiClient
          .patch(`/releases/${id}/steps`, toToggleStepRequest(partialSteps))
          .then((r) => fromReleaseResponse(r.data)),

  /** PATCH /releases/:id/info */
  updateInfo: (id, remarks) =>
    USE_MOCK
      ? mockApi.updateInfo(id, remarks)
      : apiClient
          .patch(`/releases/${id}/info`, { additionalInfo: remarks })
          .then((r) => fromReleaseResponse(r.data)),

  /** DELETE /releases/:id (204 No Content) */
  remove: (id) =>
    USE_MOCK ? mockApi.remove(id) : apiClient.delete(`/releases/${id}`).then(() => ({ id })),
};
