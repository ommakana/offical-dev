export function SkeletonCard() {
  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-4 flex flex-col gap-3">
      {/* Badge + domain row */}
      <div className="flex items-center justify-between">
        <div className="h-5 w-12 rounded-full bg-slate-700 animate-pulse" />
        <div className="h-4 w-20 rounded bg-slate-700 animate-pulse" />
      </div>
      {/* Title */}
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-slate-700 animate-pulse" />
        <div className="h-4 w-5/6 rounded bg-slate-700 animate-pulse" />
        <div className="h-4 w-3/4 rounded bg-slate-700 animate-pulse" />
      </div>
      {/* Tags */}
      <div className="flex gap-1.5">
        <div className="h-5 w-14 rounded-md bg-slate-700 animate-pulse" />
        <div className="h-5 w-16 rounded-md bg-slate-700 animate-pulse" />
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between border-t border-surface-border pt-2">
        <div className="flex gap-3">
          <div className="h-3 w-8 rounded bg-slate-700 animate-pulse" />
          <div className="h-3 w-6 rounded bg-slate-700 animate-pulse" />
        </div>
        <div className="h-3 w-16 rounded bg-slate-700 animate-pulse" />
      </div>
    </div>
  );
}
