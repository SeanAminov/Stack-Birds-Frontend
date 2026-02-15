import { useRef, type ReactNode } from 'react';

/* Root layout — full viewport, no scroll */

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden no-select"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {children}
    </div>
  );
}
