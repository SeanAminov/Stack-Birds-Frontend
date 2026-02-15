import { motion } from 'framer-motion';
import type { DockZone as DockZoneType } from '../../hooks/useDockSnap';

/* ============================================
   DockZone

   Visual indicator for a snap target zone.
   Hidden by default, becomes visible with a
   glowing border when the panel is being dragged.
   ============================================ */

interface DockZoneProps {
  zone: DockZoneType;
  isVisible: boolean; // true when panel is being dragged
  isActive: boolean;  // true when this is the currently docked zone
}

export function DockZone({ zone, isVisible, isActive }: DockZoneProps) {
  return (
    <motion.div
      className="fixed pointer-events-none rounded-2xl"
      style={{
        left: zone.x,
        top: zone.y,
        width: 480,
        height: 44,
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.95,
      }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="w-full h-full rounded-2xl"
        style={{
          border: `2px dashed ${isActive ? 'var(--accent)' : 'var(--text-muted)'}`,
          backgroundColor: isActive ? 'var(--accent-glow)' : 'transparent',
          opacity: 0.5,
          transition: 'all 0.2s',
        }}
      />
    </motion.div>
  );
}
