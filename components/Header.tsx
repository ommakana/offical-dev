'use client';

interface HeaderProps {
  fetchedAt: number | null;
  loading: boolean;
  onRefresh: () => void;
  totalCount: number;
}

function RefreshIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`transition-transform ${spinning ? 'animate-spin' : ''}`}
      aria-hidden="true"
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

export function Header({ fetchedAt, loading, onRefresh, totalCount }: HeaderProps) {
  const cacheAge = fetchedAt
    ? Math.floor((Date.now() - fetchedAt) / 60000)
    : null;

  return (
    <header className="sticky top-0 z-10 bg-surface/90 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-white truncate leading-none">
                Developer Feed
              </h1>
              {totalCount > 0 && (
                <p className="text-xs text-slate-500 mt-0.5">
                  {totalCount} stories
                  {cacheAge !== null && cacheAge < 60 && (
                    <> &middot; cached {cacheAge === 0 ? 'just now' : `${cacheAge}m ago`}</>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              border border-surface-border transition-all duration-200
              ${
                loading
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-400 hover:text-white hover:border-slate-500'
              }
            `}
            aria-label="Refresh feed"
          >
            <RefreshIcon spinning={loading} />
            <span className="hidden sm:inline">{loading ? 'Loading...' : 'Refresh'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
