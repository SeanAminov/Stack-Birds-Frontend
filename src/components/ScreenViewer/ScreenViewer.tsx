import { useRef } from 'react';
import { motion } from 'framer-motion';
import { screens } from '../../data/screens';
import { useViewer } from '../../context/ViewerContext';
import { useScreenNavigation } from '../../hooks/useScreenNavigation';
import { ScreenCard } from './ScreenCard';

/* 3D carousel with nav arrows and dot indicators */

export function ScreenViewer() {
  const { activeIndex, totalScreens, goNext, goPrev } = useViewer();
  const containerRef = useRef<HTMLDivElement>(null);

  useScreenNavigation(containerRef);

  const isFirst = activeIndex === 0;
  const isLast = activeIndex === totalScreens - 1;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center"
      style={{ paddingBottom: 140 }} /* Make room for the chat bar below */
    >
      {/* 3D perspective container */}
      <div
        className="relative"
        style={{ perspective: '1200px', perspectiveOrigin: 'center center' }}
      >
        {screens.map((screen, index) => {
          const offset = index - activeIndex;
          if (Math.abs(offset) > 2) return null;
          return (
            <ScreenCard
              key={screen.id}
              screen={screen}
              offset={offset}
              index={index}
              total={totalScreens}
            />
          );
        })}
      </div>

      {/* Nav arrows — small and subtle */}
      <motion.button
        onClick={goPrev}
        disabled={isFirst}
        className="absolute left-4 p-1.5 rounded-md cursor-pointer disabled:cursor-default"
        style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          color: isFirst ? 'var(--text-muted)' : 'var(--text-primary)',
        }}
        whileHover={!isFirst ? { scale: 1.15 } : {}}
        whileTap={!isFirst ? { scale: 0.9 } : {}}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </motion.button>

      <motion.button
        onClick={goNext}
        disabled={isLast}
        className="absolute right-4 p-1.5 rounded-md cursor-pointer disabled:cursor-default"
        style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          color: isLast ? 'var(--text-muted)' : 'var(--text-primary)',
        }}
        whileHover={!isLast ? { scale: 1.15 } : {}}
        whileTap={!isLast ? { scale: 0.9 } : {}}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </motion.button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {screens.map((_, index) => (
          <div
            key={index}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: index === activeIndex ? '#111' : '#ccc',
              opacity: index === activeIndex ? 1 : 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
}
