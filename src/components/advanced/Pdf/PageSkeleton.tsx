export function PageSkeleton({ index }: { index: number }) {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col items-center gap-1.5 p-2 rounded-md border border-(--border-default) bg-(--surface-secondary) animate-pulse"
    >
      {/* A4-ish aspect ratio placeholder */}
      <div className="w-full aspect-3/4 rounded-sm bg-(--surface-elevated)" />
      <span className="text-xs text-(--text-tertiary) opacity-50">{index + 1}</span>
    </div>
  );
}