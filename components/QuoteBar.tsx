'use client';

import { useEffect, useState } from 'react';
import { getRandomQuote, Quote } from '@/lib/quotes';

function QuoteIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="flex-shrink-0 text-indigo-500 dark:text-indigo-400"
    >
      <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.956.76-3.022.66-1.065 1.515-1.867 2.558-2.403L9.373 5c-.8.396-1.56.898-2.26 1.505-.71.607-1.34 1.305-1.9 2.094s-.98 1.68-1.25 2.69-.346 2.04-.217 3.1c.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002.003zm9.124 0c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.692-1.327-.817-.56-.124-1.074-.13-1.54-.022-.16-.94.09-1.95.75-3.02.66-1.06 1.514-1.86 2.557-2.4L18.49 5c-.8.396-1.555.898-2.26 1.505-.708.607-1.34 1.305-1.894 2.094-.556.79-.97 1.68-1.24 2.69-.273 1.01-.345 2.04-.217 3.1.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002.003z" />
    </svg>
  );
}

export function QuoteBar() {
  // null until hydrated — avoids server/client mismatch from Math.random()
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  return (
    <div
      className="border-b border-indigo-100 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-950/30"
      role="complementary"
      aria-label="Quote of the day"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 min-h-[44px] flex items-center">
        {quote ? (
          <p className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-200 italic leading-relaxed animate-fade-in">
            <QuoteIcon />
            <span>
              {quote.text}
              {quote.author && (
                <span className="not-italic font-semibold text-indigo-600 dark:text-indigo-400 ml-1.5">
                  — {quote.author}
                </span>
              )}
            </span>
          </p>
        ) : (
          // Placeholder keeps the bar height stable before hydration
          <div className="h-4 w-2/3 rounded bg-indigo-100 dark:bg-indigo-900/40 animate-pulse" />
        )}
      </div>
    </div>
  );
}
