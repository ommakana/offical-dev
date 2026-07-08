import { NextResponse } from 'next/server';
import { fetchHackerNews } from '@/lib/hackernews';
import { fetchDevTo } from '@/lib/devto';
import { fetchReddit } from '@/lib/reddit';
import { NewsItem } from '@/types/news';

export const revalidate = 600; // 10-minute ISR cache server-side

export async function GET() {
  try {
    const [hn, devto, reddit] = await Promise.allSettled([
      fetchHackerNews(),
      fetchDevTo(),
      fetchReddit(),
    ]);

    const items: NewsItem[] = [
      ...(hn.status === 'fulfilled' ? hn.value : []),
      ...(devto.status === 'fulfilled' ? devto.value : []),
      ...(reddit.status === 'fulfilled' ? reddit.value : []),
    ];

    // Deduplicate by URL (different sources sometimes share stories)
    const seen = new Set<string>();
    const unique = items.filter((item) => {
      const key = item.url;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort by score descending — most relevant first
    unique.sort((a, b) => b.score - a.score);

    return NextResponse.json(
      { items: unique, fetchedAt: Date.now() },
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
