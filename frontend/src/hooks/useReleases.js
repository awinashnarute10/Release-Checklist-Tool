import { useQuery } from "@tanstack/react-query";
import { releasesApi } from "../api/releases";
import { queryKeys } from "../constants";

/** Fetch the full list of releases. */
export function useReleases() {
  return useQuery({
    queryKey: queryKeys.releases,
    queryFn: releasesApi.list,
  });
}
