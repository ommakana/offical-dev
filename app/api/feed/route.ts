import { NextResponse } from 'next/server';
import { fetchHackerNews } from '@/lib/hackernews';
import { fetchDevTo } from '@/lib/devto';
import { fetchReddit } from '@/lib/reddit';
import { NewsItem } from '@/types/news';

export const revalidate = 600; // 10-minute ISR cache server-side

// Keywords that signal a story is fullstack / web / mobile relevant
const FULLSTACK_KEYWORDS = [
  'react', 'next.js', 'nextjs', 'vue', 'angular', 'svelte', 'nuxt',
  'node', 'node.js', 'express', 'fastify', 'hono',
  'typescript', 'javascript', 'css', 'html', 'tailwind',
  'flutter', 'react native', 'swift', 'kotlin', 'dart',
  'graphql', 'rest api', 'websocket', 'trpc',
  'vercel', 'netlify', 'cloudflare',
  'fullstack', 'full-stack', 'full stack',
  'frontend', 'front-end', 'backend', 'back-end',
  'web app', 'mobile app', 'pwa', 'spa',
  'bun', 'deno', 'vite', 'webpack', 'turbopack',
  'prisma', 'drizzle', 'supabase',
];

function isFullstackStory(item: NewsItem): boolean {
  if (item.category === 'webdev') return true;
  const haystack = `${item.title} ${item.tags.join(' ')} ${item.description ?? ''}`.toLowerCase();
  return FULLSTACK_KEYWORDS.some((kw) => haystack.includes(kw));
}

function deduplicate(items: NewsItem[]): NewsItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

export async function GET() {
  try {
    const [hn, devto, reddit] = await Promise.allSettled([
      fetchHackerNews(),
      fetchDevTo(),
      fetchReddit(),
    ]);

    const raw: NewsItem[] = [
      ...(hn.status === 'fulfilled' ? hn.value : []),
      ...(devto.status === 'fulfilled' ? devto.value : []),
      ...(reddit.status === 'fulfilled' ? reddit.value : []),
    ];

    const unique = deduplicate(raw);

    // Split into two buckets — fullstack/web/app first, then everything else
    const fullstack: NewsItem[] = [];
    const general: NewsItem[] = [];

    for (const item of unique) {
      if (isFullstackStory(item)) {
        fullstack.push(item);
      } else {
        general.push(item);
      }
    }

    // Sort each bucket by score descending
    const byScore = (a: NewsItem, b: NewsItem) => b.score - a.score;
    fullstack.sort(byScore);
    general.sort(byScore);

    // Fullstack stories always appear first in the feed
    const items = [...fullstack, ...general];

    return NextResponse.json(
      { items, fetchedAt: Date.now() },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=60',
        },
      }
    );
  } catch (err) {
    console.error('[feed/api] aggregation error:', err);
    return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 });
  }
}
