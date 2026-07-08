'use client';

import { useCallback, useEffect, useReducer } from 'react';
import { CACHE_KEY, CACHE_TTL_MS, FeedCache, NewsCategory, NewsItem, PAGE_SIZE } from '@/types/news';

// ── State ──────────────────────────────────────────────────────────────────

interface FeedState {
  allItems: NewsItem[];
  visibleItems: NewsItem[];
  page: number;
  hasMore: boolean;
  /** True only during the initial skeleton phase (no items yet) */
  loading: boolean;
  /** True while the full feed (HN + Reddit) loads in the background */
  backgroundLoading: boolean;
  error: string | null;
  fetchedAt: number | null;
  category: NewsCategory;
}

type FeedAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { items: NewsItem[]; fetchedAt: number } }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'BACKGROUND_START' }
  /** Merges the full dataset in without resetting what the user already sees */
  | { type: 'MERGE_FULL'; payload: { items: NewsItem[]; fetchedAt: number } }
  | { type: 'LOAD_MORE' }
  | { type: 'SET_CATEGORY'; payload: NewsCategory }
  | { type: 'REFRESH' };

// ── Pure helpers ───────────────────────────────────────────────────────────

function filterByCategory(items: NewsItem[], category: NewsCategory): NewsItem[] {
  if (category === 'all') return items;
  return items.filter((i) => i.category === category);
}

function deduplicateById(existing: NewsItem[], incoming: NewsItem[]): NewsItem[] {
  const seen = new Set(existing.map((i) => i.id));
  return incoming.filter((i) => !seen.has(i.id));
}

// ── Reducer ────────────────────────────────────────────────────────────────

function reducer(state: FeedState, action: FeedAction): FeedState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };

    case 'FETCH_SUCCESS': {
      const filtered = filterByCategory(action.payload.items, state.category);
      return {
        ...state,
        loading: false,
        allItems: action.payload.items,
        visibleItems: filtered.slice(0, PAGE_SIZE),
        page: 1,
        hasMore: filtered.length > PAGE_SIZE,
        fetchedAt: action.payload.fetchedAt,
        error: null,
      };
    }

    case 'FETCH_ERROR':
      return { ...state, loading: false, backgroundLoading: false, error: action.payload };

    case 'BACKGROUND_START':
      return { ...state, backgroundLoading: true };

    case 'MERGE_FULL': {
      // Combine existing items with net-new ones from the full fetch
      const fresh = deduplicateById(state.allItems, action.payload.items);
      const merged = [...state.allItems, ...fresh];

      const filtered = filterByCategory(merged, state.category);
      const currentVisible = state.visibleItems.length;

      return {
        ...state,
        backgroundLoading: false,
        allItems: merged,
        // Keep whatever the user already sees — just extend hasMore
        visibleItems: filtered.slice(0, Math.max(currentVisible, PAGE_SIZE)),
        hasMore: filtered.length > Math.max(currentVisible, PAGE_SIZE),
        fetchedAt: action.payload.fetchedAt,
      };
    }

    case 'LOAD_MORE': {
      const filtered = filterByCategory(state.allItems, state.category);
      const nextPage = state.page + 1;
      const nextVisible = filtered.slice(0, nextPage * PAGE_SIZE);
      return {
        ...state,
        visibleItems: nextVisible,
        page: nextPage,
        hasMore: nextVisible.length < filtered.length,
      };
    }

    case 'SET_CATEGORY': {
      const filtered = filterByCategory(state.allItems, action.payload);
      return {
        ...state,
        category: action.payload,
        visibleItems: filtered.slice(0, PAGE_SIZE),
        page: 1,
        hasMore: filtered.length > PAGE_SIZE,
      };
    }

    case 'REFRESH':
      return { ...state, fetchedAt: null };

    default:
      return state;
  }
}

const INITIAL_STATE: FeedState = {
  allItems: [],
  visibleItems: [],
  page: 1,
  hasMore: false,
  loading: true,
  backgroundLoading: false,
  error: null,
  fetchedAt: null,
  category: 'webdev',
};

// ── Cache helpers ───────────────────────────────────────────────────────────

function readCache(): FeedCache | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cache: FeedCache = JSON.parse(raw);
    if (Date.now() - cache.fetchedAt > CACHE_TTL_MS) return null;
    return cache;
  } catch {
    return null;
  }
}

function writeCache(items: NewsItem[], fetchedAt: number) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ items, fetchedAt }));
  } catch {
    // storage might be full — silently skip
  }
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useFeed() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const fetchFeed = useCallback(async (force = false) => {
    // --- Cached path: skip the network entirely ---
    if (!force) {
      const cached = readCache();
      if (cached) {
        dispatch({ type: 'FETCH_SUCCESS', payload: { items: cached.items, fetchedAt: cached.fetchedAt } });
        return;
      }
    }

    // --- Phase 1: web-only stories (Dev.to), shows up fast ---
    dispatch({ type: 'FETCH_START' });
    try {
      const webRes = await fetch('/api/feed/web');
      if (!webRes.ok) throw new Error(`Web API error ${webRes.status}`);
      const webData: { items: NewsItem[]; fetchedAt: number } = await webRes.json();
      dispatch({ type: 'FETCH_SUCCESS', payload: webData });
    } catch (err) {
      // Phase 1 failed — skip to phase 2 which has the full dataset
      dispatch({ type: 'FETCH_ERROR', payload: (err as Error).message });
    }

    // --- Phase 2: full feed (HN + Reddit + Dev.to) in the background ---
    dispatch({ type: 'BACKGROUND_START' });
    try {
      const fullRes = await fetch('/api/feed');
      if (!fullRes.ok) throw new Error(`Full feed API error ${fullRes.status}`);
      const fullData: { items: NewsItem[]; fetchedAt: number } = await fullRes.json();
      writeCache(fullData.items, fullData.fetchedAt);
      dispatch({ type: 'MERGE_FULL', payload: fullData });
    } catch (err) {
      // Background fetch failed — not catastrophic, we already have phase 1 content
      console.warn('[useFeed] background fetch failed:', err);
      dispatch({ type: 'MERGE_FULL', payload: { items: state.allItems, fetchedAt: Date.now() } });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CACHE_KEY);
    }
    fetchFeed(true);
  }, [fetchFeed]);

  const loadMore = useCallback(() => {
    if (!state.loading && state.hasMore) {
      dispatch({ type: 'LOAD_MORE' });
    }
  }, [state.loading, state.hasMore]);

  const setCategory = useCallback((category: NewsCategory) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  return {
    ...state,
    loadMore,
    setCategory,
    refresh,
  };
}
