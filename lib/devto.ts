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
  // Fullstack / web / app
  javascript: 'webdev',
  typescript: 'webdev',
  react: 'webdev',
  nextjs: 'webdev',
  vue: 'webdev',
  angular: 'webdev',
  svelte: 'webdev',
  webdev: 'webdev',
  fullstack: 'webdev',
  frontend: 'webdev',
  backend: 'webdev',
  nodejs: 'webdev',
  flutter: 'webdev',
  mobile: 'webdev',
  ios: 'webdev',
  android: 'webdev',
  reactnative: 'webdev',
  css: 'webdev',
  html: 'webdev',
  api: 'webdev',
  graphql: 'webdev',
  // AI / ML
  ai: 'aiml',
  ml: 'aiml',
  machinelearning: 'aiml',
  openai: 'aiml',
  llm: 'aiml',
  // DevOps
  devops: 'devops',
  docker: 'devops',
  kubernetes: 'devops',
  cicd: 'devops',
  // Best Practices
  bestpractices: 'bestpractices',
  architecture: 'bestpractices',
  performance: 'bestpractices',
  security: 'bestpractices',
  testing: 'bestpractices',
  cleancode: 'bestpractices',
};

function inferCategory(tags: string[]): NewsCategory {
  for (const tag of tags) {
    const mapped = TAG_CATEGORY_MAP[tag.toLowerCase().replace(/[- ]/g, '')];
    if (mapped) return mapped;
  }
  return 'devnews';
}

async function fetchArticlesByTag(tag: string, perPage = 8): Promise<DevToArticle[]> {
  const res = await fetch(
    `${DEVTO_BASE}/articles?tag=${tag}&per_page=${perPage}&top=7`,
    {
      headers: { 'User-Agent': 'official-dev-news/1.0' },
      next: { revalidate: 600 },
    }
  );
  if (!res.ok) return [];
  return res.json();
}

async function fetchArticles(params: URLSearchParams): Promise<DevToArticle[]> {
  const res = await fetch(`${DEVTO_BASE}/articles?${params}`, {
    headers: { 'User-Agent': 'official-dev-news/1.0' },
    next: { revalidate: 600 },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchDevTo(): Promise<NewsItem[]> {
  const [trending, rising, jsTag, tsTag, reactTag] = await Promise.all([
    fetchArticles(new URLSearchParams({ top: '7', per_page: '12' })),
    fetchArticles(new URLSearchParams({ per_page: '10', state: 'rising' })),
    fetchArticlesByTag('javascript', 6),
    fetchArticlesByTag('typescript', 6),
    fetchArticlesByTag('react', 6),
  ]);

  // Deduplicate by id — trending may overlap with tag results
  const seen = new Set<number>();
  const combined = [...trending, ...rising, ...jsTag, ...tsTag, ...reactTag].filter(
    (a) => {
      if (seen.has(a.id)) return false;
      seen.add(a.id);
      return true;
    }
  );

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
