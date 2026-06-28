import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";

/**
 * Confirmation modal for destructive deletes.
 */
export function DeleteDialog({
  open,
  onClose,
  onConfirm,
  loading = false,
  releaseName,
}) {
  return (
    <Modal
      open={open}
      onClose={loading ? undefined : onClose}
      size="sm"
      title="Delete release"
      description={
        releaseName
          ? `“${releaseName}” and its checklist will be permanently removed. This can’t be undone.`
          : "This release will be permanently removed. This can’t be undone."
      }
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            Delete
          </Button>
        </>
      }
    />
  );
}
