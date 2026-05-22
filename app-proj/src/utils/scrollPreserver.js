// Utility to preserve scroll position across large rerenders / data refetches.
// Usage:
//   const restore = preserveScroll();
//   await onFetchData();
//   restore();

const SCROLL_SELECTORS = [
  // Main tab scroll container
  '.tab-panel',
  // Tables/Modules grid scroll container
  '.grid-scroll',
  // ERD internal board scroll container
  '.erd-board',
];

function getScrollCandidates() {
  const nodes = [];

  for (const sel of SCROLL_SELECTORS) {
    const found = document.querySelector(sel);
    if (found && found instanceof HTMLElement) nodes.push(found);
  }

  // De-dup by identity
  return [...new Set(nodes)];
}

export function preserveScroll() {
  const candidates = typeof document !== 'undefined' ? getScrollCandidates() : [];

  const snapshot = {
    // window/page scroll
    windowX: typeof window !== 'undefined' ? window.scrollX : 0,
    windowY: typeof window !== 'undefined' ? window.scrollY : 0,
    // per-container scrollTop
    containers: candidates.map((el) => ({
      id: el.id || null,
      className: el.className || null,
      // Using current scrollHeight as a hint; restore uses scrollTop directly.
      scrollTop: el.scrollTop,
      scrollLeft: el.scrollLeft,
    })),
    // We'll restore by selector again, so we need index ordering consistency.
    selectorOrder: SCROLL_SELECTORS,
  };

  return function restoreScroll() {
    if (typeof document === 'undefined') return;

    // Restore window scroll first
    if (typeof window !== 'undefined') {
      window.scrollTo(snapshot.windowX, snapshot.windowY);
    }

    // Restore containers (best-effort)
    for (let i = 0; i < snapshot.selectorOrder.length; i++) {
      const sel = snapshot.selectorOrder[i];
      const el = document.querySelector(sel);
      if (!(el instanceof HTMLElement)) continue;

      const snap = snapshot.containers[i];
      if (!snap) continue;

      el.scrollTop = snap.scrollTop;
      el.scrollLeft = snap.scrollLeft;
    }
  };
}

