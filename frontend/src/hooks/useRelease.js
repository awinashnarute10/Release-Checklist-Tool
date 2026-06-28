import { useQuery } from "@tanstack/react-query";
import { releasesApi } from "../api/releases";
import { queryKeys } from "../constants";

/**
 * Fetch a single release by id.
 * @param {string} id
 */
export function useRelease(id) {
  return useQuery({
    queryKey: queryKeys.release(id),
    queryFn: () => releasesApi.get(id),
    enabled: Boolean(id),
  });
}
