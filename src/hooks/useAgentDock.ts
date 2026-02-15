import { useState, useCallback, useEffect } from 'react';

/* Dock snapping for the agent panel — 8 edge zones, flush to edges */

export interface AgentDockZone {
  id: string;
  x: number;
  y: number;
}

const SNAP_DISTANCE = 200;

function calculateZones(pw: number, ph: number): AgentDockZone[] {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  return [
    // Right side — flush to edge
    { id: 'right-middle',  x: vw - pw,  y: vh / 2 - ph / 2 },
    { id: 'right-top',     x: vw - pw,  y: 0 },
    { id: 'right-bottom',  x: vw - pw,  y: vh - ph },

    // Left side — flush to edge
    { id: 'left-middle',   x: 0,         y: vh / 2 - ph / 2 },
    { id: 'left-top',      x: 0,         y: 0 },
    { id: 'left-bottom',   x: 0,         y: vh - ph },

    // Top/bottom center
    { id: 'top-center',    x: vw / 2 - pw / 2, y: 0 },
    { id: 'bottom-center', x: vw / 2 - pw / 2, y: vh - ph },
  ];
}

export function useAgentDock(
  initialZone = 'right-middle',
  panelWidth = 320,
  panelHeight = 400,
) {
  const [zones, setZones] = useState<AgentDockZone[]>(() =>
    calculateZones(panelWidth, panelHeight),
  );
  const [activeZone, setActiveZone] = useState(initialZone);

  // Recalculate when window resizes or panel dimensions change
  useEffect(() => {
    const recalc = () => setZones(calculateZones(panelWidth, panelHeight));
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [panelWidth, panelHeight]);

  const getSnapTarget = useCallback(
    (dropPoint: { x: number; y: number }) => {
      let nearest: AgentDockZone | null = null;
      let minDist = Infinity;

      for (const zone of zones) {
        const dx = dropPoint.x - (zone.x + panelWidth / 2);
        const dy = dropPoint.y - (zone.y + panelHeight / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist && dist < SNAP_DISTANCE) {
          minDist = dist;
          nearest = zone;
        }
      }

      if (nearest) {
        setActiveZone(nearest.id);
        return { x: nearest.x, y: nearest.y };
      }

      // Free position — clamp to viewport so it's not lost
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      return {
        x: Math.max(0, Math.min(dropPoint.x - panelWidth / 2, vw - panelWidth)),
        y: Math.max(0, Math.min(dropPoint.y - panelHeight / 2, vh - panelHeight)),
      };
    },
    [zones, panelWidth, panelHeight],
  );

  const getInitialPosition = useCallback(() => {
    const zone = zones.find((z) => z.id === initialZone);
    return zone ? { x: zone.x, y: zone.y } : { x: 0, y: 0 };
  }, [zones, initialZone]);

  return { zones, activeZone, getSnapTarget, getInitialPosition };
}
