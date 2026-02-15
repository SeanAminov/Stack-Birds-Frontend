import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { screens } from '../data/screens';

/* Carousel state — active screen index, auto-play, navigation */

interface ViewerState {
  activeIndex: number;
  totalScreens: number;
  isPlaying: boolean;
}

type ViewerAction =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'GO_TO'; index: number }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'STOP_PLAY' };

interface ViewerContextValue extends ViewerState {
  dispatch: React.Dispatch<ViewerAction>;
  goNext: () => void;
  goPrev: () => void;
  goTo: (index: number) => void;
  togglePlay: () => void;
}

const ViewerContext = createContext<ViewerContextValue | null>(null);

function viewerReducer(state: ViewerState, action: ViewerAction): ViewerState {
  switch (action.type) {
    case 'NEXT': {
      // Clamp to last screen - no wrapping (workflow order matters)
      const nextIndex = Math.min(state.activeIndex + 1, state.totalScreens - 1);
      // Auto-stop playing when we reach the last screen
      const shouldStopPlaying = state.isPlaying && nextIndex === state.totalScreens - 1;
      return {
        ...state,
        activeIndex: nextIndex,
        isPlaying: shouldStopPlaying ? false : state.isPlaying,
      };
    }

    case 'PREV':
      // Clamp to first screen
      return {
        ...state,
        activeIndex: Math.max(state.activeIndex - 1, 0),
      };

    case 'GO_TO':
      // Jump to a specific screen (clamped to valid range)
      return {
        ...state,
        activeIndex: Math.max(0, Math.min(action.index, state.totalScreens - 1)),
      };

    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };

    case 'STOP_PLAY':
      return { ...state, isPlaying: false };

    default:
      return state;
  }
}

export function ViewerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(viewerReducer, {
    activeIndex: 0,
    totalScreens: screens.length,
    isPlaying: false,
  });

  // Convenience functions so components don't need to know action shapes
  const goNext = () => dispatch({ type: 'NEXT' });
  const goPrev = () => dispatch({ type: 'PREV' });
  const goTo = (index: number) => dispatch({ type: 'GO_TO', index });
  const togglePlay = () => dispatch({ type: 'TOGGLE_PLAY' });

  // Auto-play: advance to next screen every 2 seconds when playing
  useEffect(() => {
    if (!state.isPlaying) return;

    const interval = setInterval(() => {
      dispatch({ type: 'NEXT' });
    }, 2000);

    return () => clearInterval(interval);
  }, [state.isPlaying]);

  return (
    <ViewerContext.Provider value={{ ...state, dispatch, goNext, goPrev, goTo, togglePlay }}>
      {children}
    </ViewerContext.Provider>
  );
}

// Hook to access viewer state - throws if used outside provider
export function useViewer() {
  const ctx = useContext(ViewerContext);
  if (!ctx) throw new Error('useViewer must be used within ViewerProvider');
  return ctx;
}
