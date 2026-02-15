# Stackbirds Workflow Viewer

A React frontend for viewing browser automation workflows as a 3D card carousel, with a floating agent panel and a draggable control bar.

**Stack:** React 19 + TypeScript + Vite + Tailwind CSS 4 + Framer Motion

```bash
npm install
npm run dev
```

---

## How It Works

### Rolodex Scroll + Snap

The carousel lives in `ScreenViewer.tsx`. Each screen is a `ScreenCard` positioned with CSS `perspective: 1200px` on the parent container. Cards are absolutely positioned and only rendered if they're within ±2 of the active index.

The 3D effect comes from `getCardTransform(offset)` in `ScreenCard.tsx`:

```
x:       offset * 200px        (slide left/right)
scale:   1 - |offset| * 0.1    (shrink as they recede)
rotateY: offset * -5deg        (tilt into the page)
opacity: 1 - |offset| * 0.4    (fade out)
```

Framer Motion animates between these values with a spring (`stiffness: 300, damping: 28`). When the active index changes, every visible card smoothly transitions to its new offset position.

**Navigation inputs** are handled by `useScreenNavigation.ts`:

- **Scroll wheel:** Accumulates `deltaY` until it crosses a 50px threshold, then fires one step. A 400ms cooldown prevents rapid-fire navigation during the spring animation.
- **Arrow keys:** Left/Right fire `goPrev`/`goNext` directly.
- **Play button:** Auto-advances every 2 seconds via `setInterval` in `ViewerContext`. Stops at the last screen.

All navigation goes through `ViewerContext` (a `useReducer`) which clamps the index to `[0, totalScreens - 1]` — no wrapping, because workflow order matters.

### Drag + Dock Snapping

Both the bottom bar and agent panel use the same pattern:

1. **Define snap zones** — an array of `{id, x, y}` positions calculated from viewport dimensions. The bottom bar has 4 zones (bottom-center, bottom-left, bottom-right, top-center). The agent panel has 8 (left/right x top/middle/bottom + top-center + bottom-center).

2. **On drag end**, find the nearest zone using Euclidean distance from the drop point to each zone's center. If the nearest zone is within 200px (`SNAP_DISTANCE`), snap to it. Otherwise, keep the panel wherever it was dropped (clamped to viewport bounds).

3. **Animate the snap** with Framer Motion's `controls.start()` using a tween (220ms, custom cubic-bezier easing).

The agent panel's snap zones are **dynamic** — they recalculate when the panel is resized (via `useEffect` on `panelWidth`/`panelHeight`). Resizing uses pointer capture on a corner handle so mouse events don't get stolen by the drag handler.

### Dimming

Both panels have an eye icon toggle. When dimmed:
- Opacity drops to 15%
- `pointer-events: none` on all children except the eye button
- Dragging is disabled (`drag={false}`)
- The eye button keeps `pointer-events: auto` and `z-index: 20` so it's always clickable

### Theming

CSS variables on `:root` define all colors. Toggling dark mode sets `data-theme="dark"` on `<html>`, which swaps the variable values — zero React re-renders needed for the color change. The agent panel has its own LIGHT/DARK token objects for more granular control (header gradient, step glyphs, callout card, etc).

---

## Tradeoffs + What I'd Improve

**What's working well:**
- CSS variables for theming = instant, flicker-free mode switching
- `useReducer` for carousel state = single source of truth for all navigation inputs
- Pointer capture for resize = clean separation from drag events

**Tradeoffs made:**
- **Hardcoded snap zones** — zones are computed from viewport dimensions with fixed padding values. A more flexible system would let users configure zones or use a grid-based approach.
- **No virtualization** — with only 5 screens, rendering all visible cards is fine. At 50+ screens this would need windowing.
- **Inline styles** — used heavily for dynamic values (theme tokens, computed positions). A CSS-in-JS library or more CSS variables would be cleaner at scale.
- **No persistence for panel positions** — panels reset to defaults on refresh. Could save dock zone IDs to localStorage.

**Next improvements:**
- Persist panel positions and sizes to localStorage
- Add actual screenshot images to the cards instead of placeholder text
- Keyboard shortcuts for dimming and panel focus
- Animate the dot indicators (scale pulse on active dot)
- Snap zone visual hints — ghost outlines that appear while dragging
- Mobile/touch support for the carousel (swipe gestures)
- Connect the "Ask anything..." input and agent footer to a real backend
