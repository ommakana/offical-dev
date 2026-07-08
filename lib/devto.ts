import { NewsCategory, NewsItem } from '@/types/news';

const DEVTO_BASE = 'https://dev.to/api';

interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  published_at: string;
  user: { username: string; name: string };
  reading_time_minutes: number;
  public_reactions_count: number;
  comments_count: number;
  tag_list: string[];
}

const TAG_CATEGORY_MAP: Record<string, NewsCategory> = {
  ai: 'aiml',
  ml: 'aiml',
  machinelearning: 'aiml',
  openai: 'aiml',
  llm: 'aiml',
  devops: 'devops',
  docker: 'devops',
  kubernetes: 'devops',
  cicd: 'devops',
  bestpractices: 'bestpractices',
  architecture: 'bestpractices',
  design: 'bestpractices',
  performance: 'bestpractices',
  security: 'bestpractices',
};

function inferCategory(tags: string[]): NewsCategory {
  for (const tag of tags) {
    const mapped = TAG_CATEGORY_MAP[tag.toLowerCase()];
    if (mapped) return mapped;
  }
  return 'devnews';
}

async function fetchArticles(params: URLSearchParams): Promise<DevToArticle[]> {
  const res = await fetch(`${DEVTO_BASE}/articles?${params}`, {
    headers: { 'User-Agent': 'developer-feed/1.0' },
    next: { revalidate: 600 },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchDevTo(): Promise<NewsItem[]> {
  const [trending, latest] = await Promise.all([
    fetchArticles(new URLSearchParams({ top: '7', per_page: '15' })),
    fetchArticles(new URLSearchParams({ per_page: '15', state: 'rising' })),
  ]);

  // Deduplicate by id
  const seen = new Set<number>();
  const combined = [...trending, ...latest].filter((a) => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });

  return combined.map((a): NewsItem => ({
    id: `devto-${a.id}`,
    title: a.title,
    url: a.url,
    source: 'devto',
    score: a.public_reactions_count,
    commentCount: a.comments_count,
    commentUrl: `${a.url}#comments`,
    author: a.user.username,
    publishedAt: a.published_at,
    tags: a.tag_list.slice(0, 4),
    description: a.description,
    category: inferCategory(a.tag_list),
    readTime: a.reading_time_minutes,
  }));
}
