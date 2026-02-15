import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PlaybackControls } from './PlaybackControls';
import { useDockSnap } from '../../hooks/useDockSnap';

/* Dark glass pill bar — draggable, docks to edges, can be dimmed */

const BAR_W = 560;
const BAR_H = 46;

export function ControlPanel() {
  const { getSnapTarget } = useDockSnap();
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [isDimmed, setIsDimmed] = useState(false);

  const [position, setPosition] = useState(() => ({
    x: window.innerWidth / 2 - BAR_W / 2,
    y: window.innerHeight - BAR_H - 24,
  }));

  const handleDragEnd = useCallback(
    (_: unknown, info: { point: { x: number; y: number } }) => {
      const target = getSnapTarget(info.point);
      setPosition(target);
    },
    [getSnapTarget],
  );

  return (
    <>
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-30" />

      <motion.div
        className="fixed z-40 cursor-grab active:cursor-grabbing"
        style={{
          width: BAR_W,
          height: BAR_H,
          borderRadius: 15,
          backgroundColor: 'rgba(17, 20, 26, 0.72)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 14px 40px rgba(0,0,0,0.55)',
          opacity: isDimmed ? 0.15 : 1,
          transition: 'opacity 0.3s ease',
        }}
        drag={!isDimmed}
        dragConstraints={constraintsRef}
        dragElastic={0.06}
        dragMomentum={false}
        animate={position}
        onDragEnd={handleDragEnd}
        transition={{
          type: 'tween',
          duration: 0.22,
          ease: [0.2, 0.8, 0.2, 1],
        }}
      >
        <div
          className="flex items-center h-full"
          style={{ padding: '0 12px' }}
        >
          <PlaybackControls isDimmed={isDimmed} onToggleDim={() => setIsDimmed(!isDimmed)} />
        </div>
      </motion.div>
    </>
  );
}
