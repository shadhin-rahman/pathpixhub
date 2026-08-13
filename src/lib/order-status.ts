export const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  in_progress: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  revision_requested: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  delivered: "bg-[rgb(var(--accent-500)/15%)] text-[rgb(var(--accent-text))] border-[rgb(var(--accent-500)/25%)]",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  revision_requested: "Revision Requested",
  completed: "Completed",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}