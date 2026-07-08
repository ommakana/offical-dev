import { NewsSource } from '@/types/news';

const SOURCE_CONFIG: Record<
  NewsSource,
  { label: string; bg: string; dot: string }
> = {
  hackernews: {
    label: 'HN',
    bg: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    dot: 'bg-orange-400',
  },
  devto: {
    label: 'DEV',
    bg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    dot: 'bg-indigo-400',
  },
  reddit: {
    label: 'Reddit',
    bg: 'bg-red-500/10 text-red-400 border border-red-500/20',
    dot: 'bg-red-400',
  },
};

export function SourceBadge({ source }: { source: NewsSource }) {
  const cfg = SOURCE_CONFIG[source];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
