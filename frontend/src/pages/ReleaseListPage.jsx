import { useMemo, useState } from "react";
import { useReleases } from "../hooks/useReleases";
import {
  useCreateRelease,
  useDeleteRelease,
} from "../hooks/useReleaseMutations";
import { useToast } from "../hooks/useToast";
import { ReleaseTable } from "../components/ReleaseTable";
import { ReleaseForm } from "../components/ReleaseForm";
import { DeleteDialog } from "../components/DeleteDialog";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import {
  ReleaseCardsSkeleton,
  ReleaseTableSkeleton,
} from "../components/LoadingSkeleton";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { PlusIcon, RocketIcon, SearchIcon } from "../components/icons";
import { getErrorMessage } from "../utils";

export function ReleaseListPage() {
  const toast = useToast();
  const { data: releases, isLoading, isError, refetch } = useReleases();

  const createMutation = useCreateRelease();
  const deleteMutation = useDeleteRelease();

  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "date", direction: "desc" });

  const visible = useMemo(() => {
    if (!releases) return [];
    const q = search.trim().toLowerCase();
    const filtered = q
      ? releases.filter((r) => r.name.toLowerCase().includes(q))
      : releases.slice();
    filtered.sort((a, b) => {
      const diff = new Date(a.date) - new Date(b.date);
      return sort.direction === "asc" ? diff : -diff;
    });
    return filtered;
  }, [releases, search, sort]);

  const handleCreate = async (input) => {
    try {
      const created = await createMutation.mutateAsync(input);
      toast.success(`“${created.name}” created.`);
      setFormOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    const name = pendingDelete.name;
    try {
      await deleteMutation.mutateAsync(pendingDelete.id);
      toast.success(`“${name}” deleted.`);
      setPendingDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const hasReleases = Boolean(releases && releases.length > 0);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Releases
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track every release from planning to production.
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="w-full sm:w-auto">
          <PlusIcon /> New Release
        </Button>
      </div>

      {/* Search — only useful once there's data */}
      {hasReleases && (
        <div className="max-w-xs">
          <Input
            placeholder="Search releases…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<SearchIcon className="h-4 w-4" />}
            aria-label="Search releases"
          />
        </div>
      )}

      {/* Content states */}
      {isLoading ? (
        <>
          <ReleaseTableSkeleton />
          <ReleaseCardsSkeleton />
        </>
      ) : isError ? (
        <ErrorState
          title="Couldn't load releases"
          description="There was a problem fetching your releases."
          onRetry={refetch}
        />
      ) : !hasReleases ? (
        <EmptyState
          icon={<RocketIcon className="h-7 w-7" />}
          title="No releases yet"
          description="Create your first release to start tracking its checklist."
          action={
            <Button onClick={() => setFormOpen(true)}>
              <PlusIcon /> New Release
            </Button>
          }
        />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<SearchIcon className="h-7 w-7" />}
          title="No matches"
          description={`No releases match “${search}”.`}
          action={
            <Button variant="secondary" onClick={() => setSearch("")}>
              Clear search
            </Button>
          }
        />
      ) : (
        <ReleaseTable
          releases={visible}
          onDelete={setPendingDelete}
          sort={sort}
          onSortChange={setSort}
        />
      )}

      {/* Create modal */}
      <ReleaseForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        submitting={createMutation.isPending}
      />

      {/* Delete confirmation */}
      <DeleteDialog
        open={Boolean(pendingDelete)}
        releaseName={pendingDelete?.name}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
