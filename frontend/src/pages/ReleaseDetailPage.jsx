import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRelease } from "../hooks/useRelease";
import {
  useDeleteRelease,
  useUpdateInfo,
  useUpdateSteps,
} from "../hooks/useReleaseMutations";
import { useToast } from "../hooks/useToast";
import { ReleaseDetails } from "../components/ReleaseDetails";
import { DeleteDialog } from "../components/DeleteDialog";
import { ErrorState } from "../components/ErrorState";
import { ReleaseDetailSkeleton } from "../components/LoadingSkeleton";
import { Button } from "../components/ui/Button";
import { ArrowLeftIcon, TrashIcon } from "../components/icons";
import { getErrorMessage } from "../utils";

export function ReleaseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: release, isLoading, isError, refetch } = useRelease(id);
  const updateSteps = useUpdateSteps(id);
  const updateInfo = useUpdateInfo(id);
  const deleteMutation = useDeleteRelease();

  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleToggleStep = (step, value) => {
    updateSteps.mutate(
      { [step]: value },
      { onError: (err) => toast.error(getErrorMessage(err)) },
    );
  };

  const handleSaveRemarks = async (remarks) => {
    try {
      await updateInfo.mutateAsync(remarks);
      toast.success("Remarks saved.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`“${release?.name ?? "Release"}” deleted.`);
      navigate("/");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Back + actions bar */}
      <div className="flex items-center justify-between">
        <Button as={Link} to="/" variant="ghost" size="sm">
          <ArrowLeftIcon /> All releases
        </Button>
        {release && (
          <Button
            variant="danger-ghost"
            size="sm"
            onClick={() => setConfirmOpen(true)}
          >
            <TrashIcon /> Delete
          </Button>
        )}
      </div>

      {isLoading ? (
        <ReleaseDetailSkeleton />
      ) : isError || !release ? (
        <ErrorState
          title="Release not found"
          description="This release may have been deleted or the link is incorrect."
          onRetry={refetch}
        />
      ) : (
        <ReleaseDetails
          release={release}
          onToggleStep={handleToggleStep}
          togglingStep={updateSteps.isPending}
          onSaveRemarks={handleSaveRemarks}
          savingRemarks={updateInfo.isPending}
        />
      )}

      <DeleteDialog
        open={confirmOpen}
        releaseName={release?.name}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
