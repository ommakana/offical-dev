export type NewsSource = 'hackernews' | 'devto' | 'reddit';

export type NewsCategory =
  | 'all'
  | 'webdev'
  | 'trending'
  | 'devnews'
  | 'bestpractices'
  | 'aiml'
  | 'devops';

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: NewsSource;
  score: number;
  commentCount: number;
  commentUrl?: string;
  author: string;
  publishedAt: string; // ISO string
  tags: string[];
  domain?: string;
  description?: string;
  category: NewsCategory;
  readTime?: number; // minutes, devto only
}

export interface FeedCache {
  items: NewsItem[];
  fetchedAt: number; // Date.now()
}

export interface PaginatedFeed {
  items: NewsItem[];
  page: number;
  hasMore: boolean;
  totalCount: number;
}

export const CACHE_KEY = 'dev_feed_cache_v1';
export const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
export const PAGE_SIZE = 15;
