import { useState, useCallback, useEffect } from 'react';

export interface UseCarouselOptions {
  total: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function useCarousel({
  total,
  autoPlay = false,
  autoPlayInterval = 4000,
}: UseCarouselOptions) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 'forward' : 'backward');
      setCurrent(index);
    },
    [current],
  );

  const next = useCallback(() => {
    setDirection('forward');
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setDirection('backward');
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  const isFirst = current === 0;
  const isLast = current === total - 1;

  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(next, autoPlayInterval);
    return () => clearInterval(id);
  }, [autoPlay, autoPlayInterval, next]);

  return { current, direction, goTo, next, prev, isFirst, isLast };
}
