import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from 'react';

const DRAG_THRESHOLD_PX = 8;

export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const didDrag = useRef(false);

  const onPointerDown = useCallback((e: ReactPointerEvent) => {
    const el = ref.current;
    if (!el || e.button !== 0) return;

    // Let video cards receive taps/clicks without starting a drag
    if ((e.target as HTMLElement).closest('[data-video-card]')) return;

    isDragging.current = true;
    didDrag.current = false;
    startX.current = e.clientX;
    scrollLeftStart.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';
  }, []);

  const onPointerMove = useCallback((e: ReactPointerEvent) => {
    const el = ref.current;
    if (!isDragging.current || !el) return;

    const delta = e.clientX - startX.current;
    if (Math.abs(delta) > DRAG_THRESHOLD_PX) {
      didDrag.current = true;
    }
    el.scrollLeft = scrollLeftStart.current - delta;
  }, []);

  const endDrag = useCallback((e: ReactPointerEvent) => {
    const el = ref.current;
    if (!el || !isDragging.current) return;

    isDragging.current = false;
    if (el.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }
    el.style.cursor = '';
    el.style.userSelect = '';
  }, []);

  return {
    ref,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
  };
}
