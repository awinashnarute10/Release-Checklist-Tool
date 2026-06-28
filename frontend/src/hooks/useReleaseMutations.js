import { useMutation, useQueryClient } from "@tanstack/react-query";
import { releasesApi } from "../api/releases";
import { queryKeys } from "../constants";
import { deriveStatus } from "../utils";

/**
 * Create a release. Invalidates the list on success.
 */
export function useCreateRelease() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input) => releasesApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.releases });
    },
  });
}

/**
 * Delete a release with an optimistic removal from the cached list.
 */
export function useDeleteRelease() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => releasesApi.remove(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: queryKeys.releases });
      const previous = qc.getQueryData(queryKeys.releases);
      qc.setQueryData(queryKeys.releases, (old) =>
        Array.isArray(old) ? old.filter((r) => r.id !== id) : old,
      );
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(queryKeys.releases, ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.releases });
    },
  });
}

/**
 * Toggle/patch checklist steps with optimistic updates on both the detail
 * and list caches, including the derived status badge.
 */
export function useUpdateSteps(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (partialSteps) => releasesApi.updateSteps(id, partialSteps),
    onMutate: async (partialSteps) => {
      await qc.cancelQueries({ queryKey: queryKeys.release(id) });
      await qc.cancelQueries({ queryKey: queryKeys.releases });

      const prevDetail = qc.getQueryData(queryKeys.release(id));
      const prevList = qc.getQueryData(queryKeys.releases);

      const applyTo = (release) => {
        if (!release) return release;
        const steps = { ...release.steps, ...partialSteps };
        return { ...release, steps, status: deriveStatus(steps) };
      };

      qc.setQueryData(queryKeys.release(id), applyTo);
      qc.setQueryData(queryKeys.releases, (old) =>
        Array.isArray(old)
          ? old.map((r) => (r.id === id ? applyTo(r) : r))
          : old,
      );

      return { prevDetail, prevList };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prevDetail !== undefined)
        qc.setQueryData(queryKeys.release(id), ctx.prevDetail);
      if (ctx?.prevList !== undefined)
        qc.setQueryData(queryKeys.releases, ctx.prevList);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.release(id) });
      qc.invalidateQueries({ queryKey: queryKeys.releases });
    },
  });
}

/**
 * Update the free-text remarks for a release.
 */
export function useUpdateInfo(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (remarks) => releasesApi.updateInfo(id, remarks),
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.release(id), updated);
      qc.invalidateQueries({ queryKey: queryKeys.releases });
    },
  });
}
