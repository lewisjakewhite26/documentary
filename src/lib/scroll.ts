import type { WheelEvent } from 'react';

/** Route trackpad vertical scroll to the page when over horizontal rows or videos. */
export function forwardVerticalWheel(e: WheelEvent<HTMLElement>) {
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

  window.scrollBy({ top: e.deltaY, behavior: 'auto' });
  e.preventDefault();
  e.stopPropagation();
}
