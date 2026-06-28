import { useState } from "react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";

const todayIso = () => new Date().toISOString().slice(0, 10);

/**
 * Create-release form rendered inside a modal. Validates name + date before
 * submitting. `submitting` drives the loading state of the submit button.
 */
export function ReleaseForm({ open, onClose, onSubmit, submitting = false }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState(todayIso());
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [errors, setErrors] = useState({});

  const reset = () => {
    setName("");
    setDate(todayIso());
    setAdditionalInfo("");
    setErrors({});
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose?.();
  };

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = "Give your release a name.";
    else if (name.trim().length > 80) next.name = "Keep it under 80 characters.";
    if (!date) next.date = "Pick a target date.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit?.({
      name: name.trim(),
      date,
      additionalInfo: additionalInfo.trim() || null,
    });
    reset();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="New release"
      description="Start a fresh checklist for your next version."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Release name"
          placeholder="e.g. Version 2.1"
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <Input
          label="Target date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
        />
        <Textarea
          label="Additional information"
          hint="Optional"
          placeholder="Notes, links to the release ticket…"
          value={additionalInfo}
          rows={3}
          onChange={(e) => setAdditionalInfo(e.target.value)}
        />
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Create release
          </Button>
        </div>
      </form>
    </Modal>
  );
}
