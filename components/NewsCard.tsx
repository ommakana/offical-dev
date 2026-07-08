import { formatDistanceToNowStrict } from 'date-fns';
import { NewsItem } from '@/types/news';
import { SourceBadge } from './SourceBadge';

interface NewsCardProps {
  item: NewsItem;
  index: number;
}

function ScoreIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15,3 21,3 21,9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  );
}

export function NewsCard({ item, index }: NewsCardProps) {
  const timeAgo = formatDistanceToNowStrict(new Date(item.publishedAt), {
    addSuffix: true,
  });

  // Staggered animation delay so cards cascade in nicely
  const delayMs = Math.min(index % 15, 8) * 40;

  return (
    <article
      className="group relative bg-surface-card border border-surface-border rounded-xl p-4
                 hover:border-indigo-500/40 hover:bg-surface-hover
                 transition-all duration-200 animate-slide-up
                 flex flex-col gap-3"
      style={{ animationDelay: `${delayMs}ms`, animationFillMode: 'both' }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <SourceBadge source={item.source} />
        {item.domain && (
          <span className="text-xs text-slate-500 truncate max-w-[120px]" title={item.domain}>
            {item.domain}
          </span>
        )}
      </div>

      {/* Title — the main clickable */}
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-sm sm:text-base font-semibold text-slate-100 leading-snug
                   group-hover:text-indigo-300 transition-colors duration-150 line-clamp-3"
      >
        {item.title}
      </a>

      {/* Description — devto only */}
      {item.description && (
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      )}

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md text-xs bg-slate-800 text-slate-400 border border-slate-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer row */}
      <div className="flex items-center justify-between gap-2 pt-1 mt-auto border-t border-surface-border">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {/* Score */}
          <span className="flex items-center gap-1">
            <ScoreIcon />
            {item.score.toLocaleString()}
          </span>

          {/* Comments */}
          {item.commentUrl ? (
            <a
              href={item.commentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-slate-300 transition-colors"
              aria-label={`${item.commentCount} comments`}
            >
              <CommentIcon />
              {item.commentCount}
            </a>
          ) : (
            <span className="flex items-center gap-1">
              <CommentIcon />
              {item.commentCount}
            </span>
          )}

          {/* Read time — devto only */}
          {item.readTime !== undefined && (
            <span className="flex items-center gap-1">
              <ClockIcon />
              {item.readTime}m read
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span title={new Date(item.publishedAt).toLocaleString()}>{timeAgo}</span>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-indigo-400 transition-colors"
            aria-label="Open article"
          >
            <ExternalLinkIcon />
          </a>
        </div>
      </div>
    </article>
  );
}
