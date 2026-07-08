'use client';

import { useCallback } from 'react';
import { useFeed } from '@/hooks/useFeed';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Header } from './Header';
import { CategoryFilter } from './CategoryFilter';
import { NewsCard } from './NewsCard';
import { SkeletonCard } from './SkeletonCard';
import { QuoteBar } from './QuoteBar';

const SKELETON_COUNT = 9;

export function NewsFeed() {
  const {
    visibleItems,
    allItems,
    loading,
    backgroundLoading,
    error,
    hasMore,
    fetchedAt,
    category,
    loadMore,
    setCategory,
    refresh,
  } = useFeed();

  // Stable callback so the observer ref doesn't thrash
  const handleIntersect = useCallback(() => {
    if (hasMore && !loading) loadMore();
  }, [hasMore, loading, loadMore]);

  const sentinelRef = useIntersectionObserver({
    onIntersect: handleIntersect,
    rootMargin: '300px',
    enabled: hasMore && !loading,
  });

  return (
    <div className="min-h-screen bg-surface text-slate-900 dark:text-slate-100">
      <Header
        fetchedAt={fetchedAt}
        loading={loading}
        onRefresh={refresh}
        totalCount={allItems.length}
      />
      <QuoteBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Category filter */}
        <CategoryFilter active={category} onChange={setCategory} />

        {/* Background loading pill — visible while HN + Reddit stream in */}
        {backgroundLoading && !loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500"
               role="status" aria-live="polite">
            <div className="w-3 h-3 rounded-full border border-indigo-400 border-t-transparent animate-spin" />
            <span>Loading more sources&hellip;</span>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
            <p className="text-red-400 text-sm mb-3">{error}</p>
            <button
              onClick={refresh}
              className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20
                         text-sm hover:bg-red-500/20 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* Initial loading skeleton */}
        {loading && visibleItems.length === 0 && (
          <div
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            aria-busy="true"
            aria-label="Loading news"
          >
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && visibleItems.length === 0 && !error && (
          <div className="text-center py-20">
            <p className="text-slate-500 text-sm">No stories in this category yet.</p>
          </div>
        )}

        {/* News grid */}
        {visibleItems.length > 0 && (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map((item, i) => (
              <NewsCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-1" aria-hidden="true" />

        {/* Inline loading spinner when fetching more */}
        {loading && visibleItems.length > 0 && (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          </div>
        )}

        {/* End of feed */}
        {!hasMore && visibleItems.length > 0 && (
          <div className="text-center py-8 text-slate-600 text-xs border-t border-surface-border">
            All caught up &mdash; refresh for new stories.
          </div>
        )}
      </main>
    </div>
  );
}
