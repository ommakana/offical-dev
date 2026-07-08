'use client';

import { useCallback, useEffect, useReducer } from 'react';
import { CACHE_KEY, CACHE_TTL_MS, FeedCache, NewsCategory, NewsItem, PAGE_SIZE } from '@/types/news';

// ── State ──────────────────────────────────────────────────────────────────

interface FeedState {
  allItems: NewsItem[];
  visibleItems: NewsItem[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  fetchedAt: number | null;
  category: NewsCategory;
}

type FeedAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { items: NewsItem[]; fetchedAt: number } }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'LOAD_MORE' }
  | { type: 'SET_CATEGORY'; payload: NewsCategory }
  | { type: 'REFRESH' };

function filterByCategory(items: NewsItem[], category: NewsCategory): NewsItem[] {
  if (category === 'all') return items;
  return items.filter((i) => i.category === category);
}

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
      return { ...state, loading: false, error: action.payload };

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
  error: null,
  fetchedAt: null,
  category: 'webdev', // Web / App tab is the home base
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
    if (!force) {
      const cached = readCache();
      if (cached) {
        dispatch({ type: 'FETCH_SUCCESS', payload: { items: cached.items, fetchedAt: cached.fetchedAt } });
        return;
      }
    }

    dispatch({ type: 'FETCH_START' });
    try {
      const res = await fetch('/api/feed');
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data: { items: NewsItem[]; fetchedAt: number } = await res.json();
      writeCache(data.items, data.fetchedAt);
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: (err as Error).message });
    }
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
