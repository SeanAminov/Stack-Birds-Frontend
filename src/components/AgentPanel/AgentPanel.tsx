import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useAgentDock } from '../../hooks/useAgentDock';
import { useTheme } from '../../context/ThemeContext';

/* Floating agent panel — draggable, resizable, theme-aware, dimmable */

interface AgentPanelProps {
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}

interface Step {
  title: string;
  subtitle?: string;
  status: 'done' | 'active' | 'pending';
}

const STEPS: Step[] = [
  { title: 'Opened target page', subtitle: 'app.stackbirds.io/dashboard', status: 'done' },
  { title: 'Located form elements', subtitle: '3 inputs detected', status: 'done' },
  { title: 'Filled email field', subtitle: 'test@example.com', status: 'done' },
  { title: 'Clicked submit button', status: 'active' },
  { title: 'Waiting for confirmation', status: 'pending' },
];

const MIN_W = 240;
const MAX_W = 520;
const MIN_H = 200;
const MAX_H = 600;
const DEFAULT_W = 320;
const DEFAULT_H = 380;

/* ── Theme token sets ── */
const LIGHT = {
  shell: '#FFFFFF',
  shellBorder: 'rgba(16, 24, 40, 0.10)',
  header: 'linear-gradient(90deg, #1A8FBD 0%, #1C84C3 100%)',
  headerText: '#fff',
  headerBtnIdle: 'rgba(255,255,255,0.55)',
  headerBtnHover: 'rgba(255,255,255,0.12)',
  rowBg: '#FFFFFF',
  rowBorder: '#E6EDF4',
  titleColor: '#1A1D24',
  titleMuted: '#A0A7B2',
  subtitle: '#8C939E',
  calloutBg: '#FFF4E8',
  calloutBorder: '#F6D2B1',
  calloutText: '#C25B1B',
  footerBg: '#F7F9FB',
  footerBorder: '#E6EDF4',
  inputBg: '#FFFFFF',
  inputBorder: '#E6EDF4',
  inputText: '#1A1D24',
  checkBg: '#EAF6FF',
  checkStroke: '#1A8FBD',
  activeBg: '#FFF4E8',
  activeStroke: '#C25B1B',
  pendingBg: '#F4F6F8',
  pendingDot: '#C8CDD4',
  gripColor: '#C8CDD4',
};

const DARK = {
  shell: '#1a1a1e',
  shellBorder: 'rgba(255,255,255,0.08)',
  header: 'linear-gradient(90deg, #155a7a 0%, #164f7a 100%)',
  headerText: '#e0e0e0',
  headerBtnIdle: 'rgba(255,255,255,0.45)',
  headerBtnHover: 'rgba(255,255,255,0.10)',
  rowBg: '#242428',
  rowBorder: '#333338',
  titleColor: '#e0e0e0',
  titleMuted: '#666670',
  subtitle: '#88888e',
  calloutBg: '#3a2a18',
  calloutBorder: '#5a3a1a',
  calloutText: '#e8a060',
  footerBg: '#1e1e22',
  footerBorder: '#333338',
  inputBg: '#2a2a2e',
  inputBorder: '#3a3a3e',
  inputText: '#e0e0e0',
  checkBg: '#1a3040',
  checkStroke: '#4fb8e8',
  activeBg: '#3a2a18',
  activeStroke: '#e8a060',
  pendingBg: '#2a2a2e',
  pendingDot: '#555560',
  gripColor: '#555560',
};

function StepGlyph({ status, t }: { status: Step['status']; t: typeof LIGHT }) {
  if (status === 'done') {
    return (
      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: t.checkBg }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={t.checkStroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    );
  }
  if (status === 'active') {
    return (
      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: t.activeBg }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={t.activeStroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: t.pendingBg }}>
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.pendingDot }} />
    </div>
  );
}

export function AgentPanel({ isDragging, onDragStart, onDragEnd }: AgentPanelProps) {
  const { mode } = useTheme();
  const t = mode === 'dark' ? DARK : LIGHT;

  const controls = useAnimationControls();
  const [size, setSize] = useState({ w: DEFAULT_W, h: DEFAULT_H });
  const { getSnapTarget, getInitialPosition } = useAgentDock('right-middle', size.w, size.h);
  const [isReady, setIsReady] = useState(false);
  const [footerInput, setFooterInput] = useState('');
  const [isResizing, setIsResizing] = useState(false);
  const [isDimmed, setIsDimmed] = useState(false);
  const resizeRef = useRef<{ startX: number; startY: number; startW: number; startH: number } | null>(null);

  useEffect(() => {
    const pos = getInitialPosition();
    controls.set({ x: pos.x, y: pos.y });
    setIsReady(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDragEnd = (_: unknown, info: { point: { x: number; y: number } }) => {
    const target = getSnapTarget(info.point);
    controls.start({
      x: target.x,
      y: target.y,
      transition: { type: 'tween', duration: 0.22, ease: [0.2, 0.8, 0.2, 1] },
    });
    onDragEnd();
  };

  const handleResizeStart = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setIsResizing(true);
      resizeRef.current = { startX: e.clientX, startY: e.clientY, startW: size.w, startH: size.h };
    },
    [size],
  );

  const handleResizeMove = useCallback((e: React.PointerEvent) => {
    if (!resizeRef.current) return;
    const dx = e.clientX - resizeRef.current.startX;
    const dy = e.clientY - resizeRef.current.startY;
    setSize({
      w: Math.max(MIN_W, Math.min(MAX_W, resizeRef.current.startW + dx)),
      h: Math.max(MIN_H, Math.min(MAX_H, resizeRef.current.startH + dy)),
    });
  }, []);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    resizeRef.current = null;
  }, []);

  return (
    <motion.div
      drag={!isResizing && !isDimmed}
      dragMomentum={false}
      dragElastic={0.05}
      onDragStart={onDragStart}
      onDragEnd={handleDragEnd}
      animate={controls}
      className="fixed z-30"
      style={{
        top: 0,
        left: 0,
        width: size.w,
        opacity: isReady ? (isDimmed ? 0.15 : 1) : 0,
        transition: 'opacity 0.3s ease',
        cursor: isDimmed ? 'default' : 'grab',
      }}
      whileDrag={{ scale: 1.015 }}
    >
      {/* ── Outer shell ── */}
      <div
        className="overflow-hidden flex flex-col relative"
        style={{
          borderRadius: 16,
          backgroundColor: t.shell,
          border: `1px solid ${t.shellBorder}`,
          boxShadow: isDragging
            ? '0 20px 56px rgba(0,0,0,0.30)'
            : '0 16px 48px rgba(0,0,0,0.25)',
          transition: 'box-shadow 0.2s, background-color 0.3s, border-color 0.3s',
          height: size.h,
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center gap-2 px-3 shrink-0"
          style={{ height: 40, background: t.header }}
        >
          <div className="flex flex-col gap-[2px] shrink-0 opacity-40" style={{ pointerEvents: isDimmed ? 'none' : 'auto' }}>
            {[0, 1, 2].map((r) => (
              <div key={r} className="flex gap-[2px]">
                <div className="w-[3px] h-[3px] rounded-full bg-white/60" />
                <div className="w-[3px] h-[3px] rounded-full bg-white/60" />
              </div>
            ))}
          </div>

          <span
            className="flex-1 text-[13px] font-semibold truncate"
            style={{ color: t.headerText, fontFamily: "'Inter', sans-serif", pointerEvents: isDimmed ? 'none' : 'auto' }}
          >
            Stackbirds Agent
          </span>

          {/* Dim toggle — always clickable */}
          <motion.button
            onClick={(e) => { e.stopPropagation(); setIsDimmed(!isDimmed); }}
            className="flex items-center justify-center rounded-md cursor-pointer"
            style={{
              width: 26,
              height: 26,
              color: isDimmed ? 'rgba(255,255,255,1)' : t.headerBtnIdle,
              pointerEvents: 'auto',
              position: 'relative',
              zIndex: 20,
            }}
            whileHover={{ backgroundColor: t.headerBtnHover, scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            title={isDimmed ? 'Restore' : 'Dim panel'}
          >
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
          </motion.button>

          {/* Close button */}
          <motion.button
            className="flex items-center justify-center rounded-md cursor-pointer"
            style={{
              width: 26,
              height: 26,
              color: t.headerBtnIdle,
              pointerEvents: isDimmed ? 'none' : 'auto',
            }}
            whileHover={{ backgroundColor: t.headerBtnHover, scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.button>
        </div>

        {/* ── Body ── */}
        <div
          className="flex-1 overflow-y-auto scrollbar-hidden"
          style={{ padding: 10, pointerEvents: isDimmed ? 'none' : 'auto' }}
        >
          <div className="flex flex-col" style={{ gap: 8 }}>
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5"
                style={{
                  borderRadius: 10,
                  border: `1px solid ${t.rowBorder}`,
                  backgroundColor: t.rowBg,
                  padding: '8px 10px',
                  minHeight: 36,
                  transition: 'background-color 0.3s, border-color 0.3s',
                }}
              >
                <StepGlyph status={step.status} t={t} />
                <div className="flex-1 min-w-0">
                  <div
                    className="text-[12px] font-semibold truncate"
                    style={{
                      color: step.status === 'pending' ? t.titleMuted : t.titleColor,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {step.title}
                  </div>
                  {step.subtitle && (
                    <div
                      className="text-[10px] mt-0.5 truncate"
                      style={{ color: t.subtitle, fontFamily: "'Inter', sans-serif" }}
                    >
                      {step.subtitle}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Callout */}
            <div
              style={{
                borderRadius: 10,
                backgroundColor: t.calloutBg,
                border: `1px solid ${t.calloutBorder}`,
                padding: '8px 10px',
                transition: 'background-color 0.3s, border-color 0.3s',
              }}
            >
              <div className="text-[11px] font-medium" style={{ color: t.calloutText, fontFamily: "'Inter', sans-serif" }}>
                Added context to Step 2
              </div>
              <div className="text-[10px] mt-1" style={{ color: t.calloutText, opacity: 0.75, fontFamily: "'Inter', sans-serif", lineHeight: 1.55 }}>
                "Located 3 input fields: email, password, and confirm password on the registration form."
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div
          className="shrink-0 flex items-center gap-2"
          style={{
            backgroundColor: t.footerBg,
            borderTop: `1px solid ${t.footerBorder}`,
            padding: '8px 10px',
            pointerEvents: isDimmed ? 'none' : 'auto',
            transition: 'background-color 0.3s, border-color 0.3s',
          }}
        >
          <input
            type="text"
            value={footerInput}
            onChange={(e) => setFooterInput(e.target.value)}
            placeholder="Add a note..."
            className="flex-1 min-w-0 text-[11px] outline-none"
            style={{
              borderRadius: 10,
              border: `1px solid ${t.inputBorder}`,
              padding: '6px 10px',
              color: t.inputText,
              backgroundColor: t.inputBg,
              fontFamily: "'Inter', sans-serif",
              transition: 'background-color 0.3s, border-color 0.3s, color 0.3s',
            }}
          />
          <motion.button
            className="shrink-0 flex items-center justify-center cursor-pointer"
            style={{
              borderRadius: 8,
              backgroundColor: '#1D7FF2',
              color: '#fff',
              padding: '6px 12px',
              border: 'none',
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
          >
            Send
          </motion.button>
        </div>

        {/* ── Resize handle ── */}
        <div
          onPointerDown={isDimmed ? undefined : handleResizeStart}
          onPointerMove={isDimmed ? undefined : handleResizeMove}
          onPointerUp={isDimmed ? undefined : handleResizeEnd}
          className="absolute bottom-0 right-0"
          style={{
            width: 20,
            height: 20,
            zIndex: 10,
            touchAction: 'none',
            cursor: isDimmed ? 'default' : 'nwse-resize',
            pointerEvents: isDimmed ? 'none' : 'auto',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" style={{ position: 'absolute', bottom: 4, right: 4 }}>
            <line x1="9" y1="1" x2="1" y2="9" stroke={t.gripColor} strokeWidth="1" />
            <line x1="9" y1="4" x2="4" y2="9" stroke={t.gripColor} strokeWidth="1" />
            <line x1="9" y1="7" x2="7" y2="9" stroke={t.gripColor} strokeWidth="1" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
