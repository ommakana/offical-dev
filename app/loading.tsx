function SkeletonPill() {
  return <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />;
}

function SkeletonCard() {
  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <SkeletonPill />
        <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-5 w-14 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
        <div className="h-5 w-16 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
      </div>
      <div className="flex items-center justify-between border-t border-surface-border pt-2">
        <div className="flex gap-3">
          <div className="h-3 w-8 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="h-3 w-6 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
        <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-10 bg-surface/90 backdrop-blur-md border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
              </div>
              <div>
                <p className="text-base font-bold text-slate-900 dark:text-white">Official Dev</p>
                <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-800 animate-pulse mt-1" />
              </div>
            </div>
            <div className="h-8 w-20 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex gap-2">
          {[80, 60, 72, 110, 60, 72, 64].map((w, i) => (
            <div
              key={i}
              className="h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse flex-shrink-0"
              style={{ width: `${w}px` }}
            />
          ))}
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
