import { motion } from 'framer-motion';
import type { ScreenData } from '../../data/screens';

interface ScreenCardProps {
  screen: ScreenData;
  offset: number;
  index: number;
  total: number;
}

function getCardTransform(offset: number) {
  return {
    x: offset * 200,
    scale: 1 - Math.abs(offset) * 0.1,
    rotateY: offset * -5,
    opacity: Math.max(1 - Math.abs(offset) * 0.4, 0),
  };
}

const springTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 28,
  mass: 0.8,
};

export function ScreenCard({ screen, offset }: ScreenCardProps) {
  const transform = getCardTransform(offset);
  const isActive = offset === 0;

  return (
    <motion.div
      className="absolute"
      style={{
        width: 260,
        height: 160,
        zIndex: 10 - Math.abs(offset),
        top: '50%',
        left: '50%',
        marginLeft: -130,
        marginTop: -80,
      }}
      animate={transform}
      transition={springTransition}
    >
      <div
        className="w-full h-full rounded-xl flex items-center justify-center"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: isActive ? '1.5px solid var(--accent)' : '1px solid var(--border-subtle)',
          boxShadow: isActive
            ? '0 12px 32px var(--shadow-lg)'
            : '0 4px 12px var(--shadow)',
        }}
      >
        <span
          className="text-base font-medium tracking-wide"
          style={{
            color: 'var(--card-text)',
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '0.04em',
          }}
        >
          {screen.title}
        </span>
      </div>
    </motion.div>
  );
}
