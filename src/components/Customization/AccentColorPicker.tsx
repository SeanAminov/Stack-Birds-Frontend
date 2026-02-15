import { motion } from 'framer-motion';
import { useTheme, ACCENT_COLORS } from '../../context/ThemeContext';

/* Color swatch grid — pick an accent color */

export function AccentColorPicker() {
  const { accentColor, setAccentColor } = useTheme();

  return (
    <div>
      <span
        className="text-sm font-medium block mb-3"
        style={{ color: 'var(--text-primary)' }}
      >
        Accent Color
      </span>

      <div className="grid grid-cols-4 gap-3">
        {ACCENT_COLORS.map((color) => {
          const isSelected = accentColor === color.value;

          return (
            <motion.button
              key={color.value}
              onClick={() => setAccentColor(color.value)}
              className="w-10 h-10 rounded-full cursor-pointer relative"
              style={{ backgroundColor: color.value }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`${color.name} accent color`}
            >
              {/* Selection ring */}
              {isSelected && (
                <motion.div
                  className="absolute inset-[-3px] rounded-full"
                  style={{
                    border: '2px solid var(--text-primary)',
                  }}
                  layoutId="accent-ring"
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              )}

              {/* Checkmark on selected */}
              {isSelected && (
                <svg
                  className="absolute inset-0 m-auto"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
