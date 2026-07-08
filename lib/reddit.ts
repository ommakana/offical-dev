import { NewsCategory, NewsItem } from '@/types/news';

const SUBREDDITS: { name: string; category: NewsCategory }[] = [
  { name: 'programming',      category: 'devnews' },
  { name: 'technology',       category: 'trending' },
  { name: 'devops',           category: 'devops' },
  { name: 'MachineLearning',  category: 'aiml' },
  { name: 'ExperiencedDevs',  category: 'bestpractices' },
];

interface RedditChild {
  data: {
    id: string;
    title: string;
    url: string;
    selftext: string;
    score: number;
    author: string;
    created_utc: number;
    num_comments: number;
    permalink: string;
    is_self: boolean;
    domain: string;
    link_flair_text: string | null;
  };
}

async function fetchSubreddit(
  subreddit: string,
  limit = 10
): Promise<RedditChild[]> {
  try {
    const res = await fetch(
      `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`,
      {
        headers: { 'User-Agent': 'developer-feed/1.0 (personal news aggregator)' },
        next: { revalidate: 600 },
      }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.children ?? [];
  } catch {
    return [];
  }
}

export async function fetchReddit(): Promise<NewsItem[]> {
  const fetches = await Promise.all(
    SUBREDDITS.map(({ name, category }) =>
      fetchSubreddit(name).then((children) =>
        children
          .filter((c) => !c.data.is_self || c.data.selftext.length > 100)
          .map((c): NewsItem => ({
            id: `reddit-${c.data.id}`,
            title: c.data.title,
            url: c.data.is_self
              ? `https://reddit.com${c.data.permalink}`
              : c.data.url,
            source: 'reddit',
            score: c.data.score,
            commentCount: c.data.num_comments,
            commentUrl: `https://reddit.com${c.data.permalink}`,
            author: c.data.author,
            publishedAt: new Date(c.data.created_utc * 1000).toISOString(),
            tags: [name, ...(c.data.link_flair_text ? [c.data.link_flair_text] : [])].slice(0, 3),
            domain: c.data.is_self ? `r/${name}` : c.data.domain,
            category,
          }))
      )
    )
  );

  return fetches.flat();
}
