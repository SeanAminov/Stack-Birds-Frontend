import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

/* Theme context — dark/light mode + accent color, persisted to localStorage */

type ThemeMode = 'dark' | 'light';

interface ThemeState {
  mode: ThemeMode;
  accentColor: string;
}

interface ThemeContextValue extends ThemeState {
  toggleMode: () => void;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// Available accent colors (inspired by Chrome's appearance settings)
export const ACCENT_COLORS = [
  { name: 'Blue', value: '#4f8ff7' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Teal', value: '#14b8a6' },
];

// Read saved preferences from localStorage, or use defaults
function getInitialTheme(): ThemeState {
  try {
    const saved = localStorage.getItem('stackbirds-theme');
    if (saved) return JSON.parse(saved);
  } catch {
    // localStorage might be unavailable - use defaults
  }
  return { mode: 'light', accentColor: '#111111' };
}

// Apply theme to the DOM (CSS variables on <html>)
function applyThemeToDOM(mode: ThemeMode, accentColor: string) {
  const root = document.documentElement;

  // Set data attribute for dark mode CSS variable switching
  if (mode === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }

  // Override accent color CSS variables
  root.style.setProperty('--accent', accentColor);
  root.style.setProperty('--accent-hover', accentColor + 'cc');
  root.style.setProperty('--accent-glow', accentColor + '4d');
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeState>(getInitialTheme);

  // Apply theme to DOM whenever it changes
  useEffect(() => {
    applyThemeToDOM(theme.mode, theme.accentColor);
    localStorage.setItem('stackbirds-theme', JSON.stringify(theme));
  }, [theme]);

  const toggleMode = () => {
    setTheme((prev) => ({ ...prev, mode: prev.mode === 'dark' ? 'light' : 'dark' }));
  };

  const setAccentColor = (color: string) => {
    setTheme((prev) => ({ ...prev, accentColor: color }));
  };

  return (
    <ThemeContext.Provider value={{ ...theme, toggleMode, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to access theme - throws if used outside provider
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
