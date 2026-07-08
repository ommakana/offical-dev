'use client';

import { useCallback, useRef } from 'react';

interface UseIntersectionObserverOptions {
  onIntersect: () => void;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

/**
 * Returns a ref to attach to the sentinel element.
 * Uses IntersectionObserver — no scroll listeners, no jitter.
 */
export function useIntersectionObserver({
  onIntersect,
  threshold = 0,
  rootMargin = '200px',
  enabled = true,
}: UseIntersectionObserverOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (!node || !enabled) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            onIntersect();
          }
        },
        { threshold, rootMargin }
      );

      observerRef.current.observe(node);
    },
    [onIntersect, threshold, rootMargin, enabled]
  );

  return sentinelRef;
}
