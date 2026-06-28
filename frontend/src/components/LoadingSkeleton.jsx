import { cn } from "../utils";

/** Single shimmering block. */
export function Skeleton({ className }) {
  return <div className={cn("skeleton", className)} />;
}

/** Table-shaped skeleton for the release list on desktop. */
export function ReleaseTableSkeleton({ rows = 4 }) {
  return (
    <div className="hidden overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 md:block">
      <div className="grid grid-cols-12 gap-4 border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <Skeleton className="col-span-4 h-4" />
        <Skeleton className="col-span-3 h-4" />
        <Skeleton className="col-span-2 h-4" />
        <Skeleton className="col-span-3 h-4" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-12 items-center gap-4 border-b border-slate-50 px-6 py-5 last:border-0 dark:border-slate-800/50"
        >
          <div className="col-span-4 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-2.5 w-40" />
          </div>
          <Skeleton className="col-span-3 h-4 w-24" />
          <Skeleton className="col-span-2 h-6 w-20 rounded-full" />
          <div className="col-span-3 flex justify-end gap-2">
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Card-shaped skeletons for tablet/mobile. */
export function ReleaseCardsSkeleton({ count = 3 }) {
  return (
    <div className="grid gap-4 md:hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="space-y-4 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-3 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-9 flex-1 rounded-lg" />
            <Skeleton className="h-9 flex-1 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Detail-page skeleton (header + checklist rows). */
export function ReleaseDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      <div className="space-y-3 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
