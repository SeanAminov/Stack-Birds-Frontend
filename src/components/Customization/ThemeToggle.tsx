import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

/* Animated pill toggle for dark/light mode */

export function ThemeToggle() {
  const { mode, toggleMode } = useTheme();
  const isDark = mode === 'dark';

  return (
    <div className="flex items-center justify-between">
      <span
        className="text-sm font-medium"
        style={{ color: 'var(--text-primary)' }}
      >
        Dark Mode
      </span>

      <button
        onClick={toggleMode}
        className="relative w-11 h-6 rounded-full cursor-pointer transition-colors duration-200"
        style={{
          backgroundColor: isDark ? 'var(--accent)' : 'var(--border)',
        }}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {/* Sliding circle */}
        <motion.div
          className="absolute top-1 w-4 h-4 rounded-full"
          style={{ backgroundColor: '#ffffff' }}
          animate={{ left: isDark ? 24 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}
