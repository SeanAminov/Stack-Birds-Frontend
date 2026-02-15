import { useEffect, useRef, useCallback } from 'react';
import { useViewer } from '../context/ViewerContext';

/* Scroll + arrow key navigation for the carousel (one step per gesture) */

export function useScreenNavigation(containerRef: React.RefObject<HTMLElement | null>) {
  const { goNext, goPrev } = useViewer();

  // Track scroll state with refs to avoid re-renders
  const scrollAccumulator = useRef(0);
  const isOnCooldown = useRef(false);

  // Threshold: how much scroll delta triggers one step
  const SCROLL_THRESHOLD = 50;
  // Cooldown: prevent rapid-fire navigation (let animation settle)
  const COOLDOWN_MS = 400;

  // Handle wheel events — step-based, not continuous
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault(); // Stop the page from scrolling

      // Ignore events during cooldown (animation is still playing)
      if (isOnCooldown.current) return;

      // Accumulate scroll delta
      scrollAccumulator.current += e.deltaY;

      // Once we've scrolled enough, trigger one step
      if (Math.abs(scrollAccumulator.current) >= SCROLL_THRESHOLD) {
        if (scrollAccumulator.current > 0) {
          goNext();
        } else {
          goPrev();
        }

        // Reset and start cooldown
        scrollAccumulator.current = 0;
        isOnCooldown.current = true;

        setTimeout(() => {
          isOnCooldown.current = false;
        }, COOLDOWN_MS);
      }
    },
    [goNext, goPrev],
  );

  // Handle keyboard arrow keys
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goNext();
      } else if (e.key === 'ArrowLeft') {
        goPrev();
      }
    },
    [goNext, goPrev],
  );

  // Attach wheel listener to the container element
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // { passive: false } is required to call preventDefault on wheel
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [containerRef, handleWheel]);

  // Attach keyboard listener to the window
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
