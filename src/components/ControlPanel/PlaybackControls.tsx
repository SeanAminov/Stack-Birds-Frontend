import { useState } from 'react';
import { motion } from 'framer-motion';
import { useViewer } from '../../context/ViewerContext';

/* Bottom bar contents: Play | divider | menu | divider | eye-dim | input | send */

interface PlaybackControlsProps {
  isDimmed: boolean;
  onToggleDim: () => void;
}

/* Reusable 28x28 icon button */
function IconBtn({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="shrink-0 flex items-center justify-center rounded-[9px] cursor-pointer"
      style={{
        width: 28,
        height: 28,
        color: 'rgba(255,255,255,0.8)',
        backgroundColor: 'transparent',
        border: 'none',
      }}
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)', scale: 1.08 }}
      whileTap={{ scale: 0.9 }}
      title={title}
    >
      {children}
    </motion.button>
  );
}

/* Vertical divider */
function Divider() {
  return (
    <div
      className="shrink-0"
      style={{
        width: 1,
        height: 18,
        backgroundColor: 'rgba(255,255,255,0.10)',
        margin: '0 2px',
      }}
    />
  );
}

export function PlaybackControls({ isDimmed, onToggleDim }: PlaybackControlsProps) {
  const { isPlaying, togglePlay } = useViewer();
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="flex items-center gap-1 w-full">
      {/* ── Icon cluster ── */}
      <div style={{ pointerEvents: isDimmed ? 'none' : 'auto' }}>
        <IconBtn onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6 3 20 12 6 21" />
            </svg>
          )}
        </IconBtn>
      </div>

      <Divider />

      <div style={{ pointerEvents: isDimmed ? 'none' : 'auto' }}>
        <IconBtn title="Menu">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        </IconBtn>
      </div>

      <Divider />

      {/* Dim toggle — eye icon — always clickable */}
      <div style={{ pointerEvents: 'auto', position: 'relative', zIndex: isDimmed ? 20 : 'auto' }}>
        <IconBtn onClick={onToggleDim} title={isDimmed ? 'Restore opacity' : 'Dim bar'}>
          {isDimmed ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </IconBtn>
      </div>

      {/* Spacer before input */}
      <div style={{ width: 6 }} />

      {/* ── Input ── */}
      <div className="flex-1 min-w-0" style={{ pointerEvents: isDimmed ? 'none' : 'auto' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask anything..."
          className="w-full bg-transparent outline-none glass-input"
          style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.92)',
            caretColor: 'rgba(255,255,255,0.9)',
            fontFamily: "'Inter', sans-serif",
          }}
        />
      </div>

      {/* ── Round send button ── */}
      <motion.button
        className="shrink-0 flex items-center justify-center rounded-full cursor-pointer"
        style={{
          width: 34,
          height: 34,
          backgroundColor: inputValue.trim()
            ? 'rgba(255,255,255,0.18)'
            : 'rgba(255,255,255,0.10)',
          color: 'rgba(255,255,255,0.8)',
          border: 'none',
          pointerEvents: isDimmed ? 'none' : 'auto',
        }}
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.16)', scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </motion.button>
    </div>
  );
}
