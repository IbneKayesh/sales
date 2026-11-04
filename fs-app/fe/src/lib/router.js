export const DEFAULT_PATH = "/dashboard";

const listeners = new Set();

export function normalizePath(path) {
  const clean = String(path || "/")
    .split("?")[0]
    .replace(/\/+$/, "");

  return clean === "" ? DEFAULT_PATH : clean;
}

export function currentPath() {
  return normalizePath(window.location.pathname);
}

export function subscribeToRoute(listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function notify() {
  listeners.forEach((listener) => listener());
}

export function navigate(path) {
  const next = normalizePath(path);

  if (next !== currentPath()) {
    window.history.pushState({}, "", next);
  }

  notify();
}

if (typeof window !== "undefined") {
  window.addEventListener("popstate", notify);
}
