/**
 * Releases API service.
 *
 * Each function maps 1:1 to a backend endpoint. When USE_MOCK is on (default)
 * calls are routed to the localStorage mock so the app is fully functional
 * with no server. Flip VITE_USE_MOCK=false to talk to the real backend:
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

export const releasesApi = {
  /** GET /releases */
  list: () =>
    USE_MOCK
      ? mockApi.list()
      : apiClient.get("/releases").then((r) => r.data),

  /** GET /releases/:id */
  get: (id) =>
    USE_MOCK
      ? mockApi.get(id)
      : apiClient.get(`/releases/${id}`).then((r) => r.data),

  /** POST /releases */
  create: (input) =>
    USE_MOCK
      ? mockApi.create(input)
      : apiClient.post("/releases", input).then((r) => r.data),

  /** PATCH /releases/:id/steps */
  updateSteps: (id, steps) =>
    USE_MOCK
      ? mockApi.updateSteps(id, steps)
      : apiClient.patch(`/releases/${id}/steps`, { steps }).then((r) => r.data),

  /** PATCH /releases/:id/info */
  updateInfo: (id, remarks) =>
    USE_MOCK
      ? mockApi.updateInfo(id, remarks)
      : apiClient.patch(`/releases/${id}/info`, { remarks }).then((r) => r.data),

  /** DELETE /releases/:id */
  remove: (id) =>
    USE_MOCK
      ? mockApi.remove(id)
      : apiClient.delete(`/releases/${id}`).then((r) => r.data),
};
