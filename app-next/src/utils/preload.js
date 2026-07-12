import { pathToLoader } from '../config/loaders';

// Track which pages have already been preloaded to avoid duplicate fetches
const preloaded = new Set();

/**
 * Preload a page chunk by path. Calling this starts fetching the
 * module early — when React.lazy eventually calls the same import(),
 * Vite serves it from the browser's module cache instantly.
 *
 * Returns the promise so callers can await if needed.
 */
export function preloadPage(path) {
  if (preloaded.has(path)) return;
  preloaded.add(path);

  const loader = pathToLoader[path];
  if (loader) {
    loader().catch(() => {
      // Silently ignore — if preload fails, the real navigation import will retry
    });
  }
}

/**
 * Preload multiple pages in parallel.
 */
export function preloadPages(paths) {
  paths.forEach(preloadPage);
}

/**
 * Priority-based preload: pages that are most likely to be visited next.
 */
export function preloadPriority(pathsByPriority) {
  // Preload first-priority pages immediately, delay the rest
  const [first, ...rest] = pathsByPriority;
  if (first) preloadPages(first);
  if (rest.length > 0) {
    // Use requestIdleCallback so preloading happens during browser idle time,
    // not competing with user interactions. Falls back to setTimeout if unavailable.
    const scheduleIdle = window.requestIdleCallback || ((cb) => setTimeout(cb, 2000));
    scheduleIdle(() => preloadPages(rest.flat()), { timeout: 3000 });
  }
}
