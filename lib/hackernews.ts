import { NewsItem } from '@/types/news';

const HN_BASE = 'https://hacker-news.firebaseio.com/v0';
const STORY_BATCH = 30;

interface HNStory {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants?: number;
  type: string;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

async function fetchStoryIds(): Promise<number[]> {
  const res = await fetch(`${HN_BASE}/topstories.json`, {
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error('HN topstories fetch failed');
  const ids: number[] = await res.json();
  return ids.slice(0, STORY_BATCH * 2); // fetch 2x, filter duds below
}

async function fetchStory(id: number): Promise<HNStory | null> {
  try {
    const res = await fetch(`${HN_BASE}/item/${id}.json`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchHackerNews(): Promise<NewsItem[]> {
  const ids = await fetchStoryIds();

  // Parallel fetch in batches of 10 to avoid hammering
  const results: HNStory[] = [];
  for (let i = 0; i < ids.length; i += 10) {
    const batch = await Promise.all(ids.slice(i, i + 10).map(fetchStory));
    results.push(...(batch.filter(Boolean) as HNStory[]));
    if (results.length >= STORY_BATCH) break;
  }

  return results
    .filter((s) => s.type === 'story' && s.url && s.title)
    .slice(0, STORY_BATCH)
    .map((s): NewsItem => ({
      id: `hn-${s.id}`,
      title: s.title,
      url: s.url!,
      source: 'hackernews',
      score: s.score,
      commentCount: s.descendants ?? 0,
      commentUrl: `https://news.ycombinator.com/item?id=${s.id}`,
      author: s.by,
      publishedAt: new Date(s.time * 1000).toISOString(),
      tags: [],
      domain: extractDomain(s.url!),
      category: 'trending',
    }));
}
