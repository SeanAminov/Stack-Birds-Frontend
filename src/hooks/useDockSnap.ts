import { useState, useCallback, useEffect } from 'react';

/* Dock snapping for the bottom bar (560x46 pill) */

export interface DockZone {
  id: string;
  label: string;
  x: number;
  y: number;
}

const SNAP_DISTANCE = 200;
const PANEL_WIDTH = 560;
const PANEL_HEIGHT = 46;

function calculateZones(): DockZone[] {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const pad = 24;

  return [
    {
      id: 'bottom-center',
      label: 'Bottom Center',
      x: vw / 2 - PANEL_WIDTH / 2,
      y: vh - PANEL_HEIGHT - pad,
    },
    {
      id: 'bottom-left',
      label: 'Bottom Left',
      x: pad,
      y: vh - PANEL_HEIGHT - pad,
    },
    {
      id: 'bottom-right',
      label: 'Bottom Right',
      x: vw - PANEL_WIDTH - pad,
      y: vh - PANEL_HEIGHT - pad,
    },
    {
      id: 'top-center',
      label: 'Top Center',
      x: vw / 2 - PANEL_WIDTH / 2,
      y: pad + 48,
    },
  ];
}

function findNearestZone(
  point: { x: number; y: number },
  zones: DockZone[],
): DockZone | null {
  let nearest: DockZone | null = null;
  let minDist = Infinity;

  for (const zone of zones) {
    const dx = point.x - (zone.x + PANEL_WIDTH / 2);
    const dy = point.y - (zone.y + PANEL_HEIGHT / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < minDist && dist < SNAP_DISTANCE) {
      minDist = dist;
      nearest = zone;
    }
  }

  return nearest;
}

export function useDockSnap() {
  const [zones, setZones] = useState<DockZone[]>(calculateZones);
  const [activeZone, setActiveZone] = useState<string>('bottom-center');

  useEffect(() => {
    const handleResize = () => setZones(calculateZones());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getSnapTarget = useCallback(
    (dropPoint: { x: number; y: number }): { x: number; y: number } => {
      const nearest = findNearestZone(dropPoint, zones);

      if (nearest) {
        setActiveZone(nearest.id);
        return { x: nearest.x, y: nearest.y };
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      return {
        x: Math.max(8, Math.min(dropPoint.x - PANEL_WIDTH / 2, vw - PANEL_WIDTH - 8)),
        y: Math.max(8, Math.min(dropPoint.y - PANEL_HEIGHT / 2, vh - PANEL_HEIGHT - 8)),
      };
    },
    [zones],
  );

  return { zones, activeZone, getSnapTarget };
}
