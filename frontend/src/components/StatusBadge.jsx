import { STATUS_LABELS, STATUS_STYLES } from "../constants";
import { cn } from "../utils";

/**
 * Pill showing release status with the spec'd colors:
 * Planned → gray, Ongoing → orange, Done → green.
 */
export function StatusBadge({ status, className }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.PLANNED;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        style.badge,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
