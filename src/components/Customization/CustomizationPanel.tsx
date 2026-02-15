import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { AccentColorPicker } from './AccentColorPicker';

/* Settings drawer — slides in from right, theme + accent color */

interface CustomizationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomizationPanel({ isOpen, onClose }: CustomizationPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — click to close */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer panel — slides in from right */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-50 w-80 overflow-y-auto"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderLeft: '1px solid var(--border)',
              boxShadow: '-8px 0 32px var(--shadow)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <h2
                className="text-base font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                Appearance
              </h2>

              <motion.button
                onClick={onClose}
                className="p-1.5 rounded-lg cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
                whileHover={{ scale: 1.1, backgroundColor: 'var(--bg-hover)' }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close settings"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>
            </div>

            {/* Settings sections */}
            <div className="px-6 py-5 flex flex-col gap-6">
              {/* Mode toggle */}
              <section>
                <ThemeToggle />
              </section>

              {/* Divider */}
              <hr style={{ borderColor: 'var(--border)', borderTopWidth: '1px' }} />

              {/* Accent color picker */}
              <section>
                <AccentColorPicker />
              </section>

              {/* Info text */}
              <p
                className="text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                Theme preferences are saved automatically and will persist across sessions.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
