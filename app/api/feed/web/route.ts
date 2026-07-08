import { NextResponse } from 'next/server';
import { fetchDevTo } from '@/lib/devto';

export const revalidate = 600; // same TTL as the full feed

/**
 * Priority web feed — Dev.to only.
 *
 * This endpoint is intentionally lean: a handful of parallel Dev.to fetches
 * complete in ~400ms, letting the client render web/app stories immediately
 * while the heavier /api/feed (HN + Reddit) loads in the background.
 */
export async function GET() {
  try {
    const items = await fetchDevTo();

    return NextResponse.json(
      { items, fetchedAt: Date.now() },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=60',
        },
      }
    );
  } catch (err) {
    console.error('[feed/web] fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch web feed' }, { status: 500 });
  }
}
