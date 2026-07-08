'use client';

import { NewsCategory } from '@/types/news';

interface Category {
  id: NewsCategory;
  label: string;
}

const CATEGORIES: Category[] = [
  { id: 'all',           label: 'All' },
  { id: 'webdev',        label: 'Web / App' },
  { id: 'trending',      label: 'Trending' },
  { id: 'devnews',       label: 'Dev News' },
  { id: 'bestpractices', label: 'Best Practices' },
  { id: 'aiml',          label: 'AI / ML' },
  { id: 'devops',        label: 'DevOps' },
];

interface CategoryFilterProps {
  active: NewsCategory;
  onChange: (c: NewsCategory) => void;
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <nav
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
      aria-label="Filter by category"
    >
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`
            flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium
            transition-all duration-200 border whitespace-nowrap
            ${
              active === cat.id
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-surface-card border-surface-border text-slate-400 hover:text-white hover:border-slate-500'
            }
          `}
          aria-pressed={active === cat.id}
        >
          {cat.label}
        </button>
      ))}
    </nav>
  );
}
