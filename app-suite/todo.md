# bSuite — Live-hosting, Leak, Security & Performance Audit

Audit of `src/App.jsx` and the rest of the React (Vite 8 / React 19 / react-router 7) codebase.
Verified with `npm run build` and `npm run lint` (baseline: **1,047 lint errors / 64 warnings**, **zero** `React.lazy`/`Suspense` anywhere).

Measured baseline (fresh production build):
- Main JS bundle: **1,183.94 kB** min (261.97 kB gzip) — ONE chunk containing all ~197 pages
- CSS: 209.63 kB — **Aurora wallpaper PNG 510 kB + logo PNG 252 kB are statically imported** and download before login
- Wallpapers are photographic PNGs from 100 kB → 883 kB each (no WebP/AVIF, no resizing)

Priority legend: **[P0]** ship-blocker/security · **[P1]** should fix before/just after go-live · **[P2]** quality/performance polish.

---

## A. Security & data leaks (live hosting)

- [ ] **[P0] Remove hard-coded developer credentials** — `src/hooks/useLogin.js:25-30` pre-fills the login form with a real `username` (`kayesh@sgd.com`) and `password` (`01722688266`). Every user sees/uses this account. Start with empty fields and never commit secrets.
- [ ] **[P0] Stop logging every API call to the browser console** — `src/utils/api.js:85` runs `console.log(conObj)` for every request and dumps the full request payload **and the full server response** (inventory/finance data) into the console. Remove or gate behind `import.meta.env.DEV`.
- [ ] **[P0] Remove remaining active `console.log`s in production code** — ~14 live statements across `src/hooks/M04/useItems.js:68`, `useStock.js:39`, `useAdjustment.js:339,359`, `useCategories.js:244`, `useGroups.js:230`, `useParty.js:75`, `useMRR.js:70,84`, `useInvoice.js:72`, `useGridOptions.js:68`, `AppContext.jsx:1199`. Keep `console.error` for genuine errors or gate behind DEV.
- [ ] **[P1] Move the session token out of `localStorage`** — `src/utils/storage.js` stores the JWT (`STORAGE_KEY = "eaac02May2026user"`) in plain localStorage; any injected script can read it. Prefer short-lived httpOnly cookie + refresh flow, and add a CSP + security headers (`X-Content-Type-Options`, `Referrer-Policy`, etc.) at the host/CDN.
- [ ] **[P1] Treat `VITE_APP_API_KEY` as public** — Vite inlines every `VITE_*` var into the shipped bundle (`src/utils/api.js:40,103,121`), so this header value is readable by anyone. If it is a privileged key, move it behind the backend proxy instead of the browser.
- [ ] **[P1] Audit `storage`/`conf` localStorage payloads** — uploaded backgrounds/logos are stored as base64 `data:` URLs inside `STORAGE_KEY_LOGIN` (`src/pages/M01/ThemePage.jsx` `BgImageRow`, `src/utils/storage.js`). Large uploads hit the ~5 MB quota and bloat every style read; consider IndexedDB or object URLs + size limits.

## B. Production configuration & hosting

- [ ] **[P0] Make the API base URL configurable for live hosting** — `src/utils/api.js` hardcodes `API_BASE_URL = "/api"`. The `/api → localhost:3001` proxy exists only in `vite.config.js` (dev). On a live static host the same-origin `/api` must be served by a reverse proxy/backend, or the base must come from `VITE_API_BASE_URL` (with CORS). Otherwise every screen errors after deploy.
- [ ] **[P1] Add SPA history fallback** — `BrowserRouter` (src/main.jsx) needs server rewrites so deep links (`/bsuite/theme`, …) don't 404: nginx `try_files $uri /index.html`, Netlify `_redirects`, Vercel rewrite, etc. Test a hard refresh on a deep URL after deploy.
- [ ] **[P1] Fix `index.html`** — favicon declared `type="image/svg+xml"` but points to `/favicon.png` (`public/favicon.svg` exists and is unused); add `<meta name="description">`, `theme-color`, `og:` tags; confirm `build.base` if ever hosted in a sub-path.
- [ ] **[P1] Add request timeouts / cancellation to `apiRequest`** — `src/utils/api.js` `fetch` has no `AbortSignal` (only `healthCheck` uses a 5 s timeout). A hung backend leaves the app "busy" forever. Add `AbortSignal.timeout()` (15–30 s) and surface the abort as a retryable error.
- [ ] **[P1] Add CI + tests** — no test files and no CI exist (`package.json` has no `test` script). Add Vitest smoke tests for `storage.js`/`api.js`/theme utils and run `lint` + `build` in CI so the current 1,047 lint errors stop growing.

## C. Bundle size & load performance

- [ ] **[P0] Route-level code splitting** — all ~197 pages are statically imported via `src/routes/*` (`index.jsx`, `M01..M08Routes.jsx`, `mainRoutes.jsx`), producing the single 1.18 MB chunk (Vite warns "chunks larger than 500 kB"). Wrap each route element in `React.lazy(() => import(...))` with one shared `<Suspense fallback={<PageSkeleton/>}>`. Biggest win for first paint on login.
- [ ] **[P1] Don't rebuild the route table every render** — `getRoutes()` is called inline in `App.jsx` and again inside every window's `<Routes location={…}>` in `src/layouts/Window.jsx`, creating all route elements on each render of each window. Hoist/memoize the routes array (module-level constant or `useMemo`).
- [ ] **[P1] Vendor chunk split** — add `build.rolldownOptions.output.codeSplitting`/`manualChunks` for `react`, `react-dom`, `react-router-dom` so library code is cached separately from app code.
- [ ] **[P1] Stop bundling the 510 kB `aurora.png` + 252 kB `logo-bs.png` in the startup graph** — `src/context/AppContext.jsx:29`, `src/layouts/Topbar.jsx:24`, `src/utils/storage.js:2` import them statically, so they download before login. Convert to WebP/AVIF (~1/5 size), lazy-load non-default wallpapers (ThemePage already dynamic-imports the rest), and consider a tiny inline SVG/CSS default background instead of a full photo.
- [ ] **[P2] Convert the wallpaper PNG library to WebP/AVIF + responsive sizes** (`src/assets/wallpapers/*.png`, 100–883 kB each, photographic PNGs). Keep the Vite-hashed filenames and serve `/assets/*` with `Cache-Control: immutable` + a year TTL (they are content-hashed already).
- [ ] **[P2] Set an aggressive cache policy for `/assets/*` and `index.html` (no-cache)** at the host — the app is fully static after build; index.html must be revalidated so new hashed bundles get picked up.

## D. Rendering performance

- [ ] **[P1] Split the giant single context in `AppContext` and memoize its value** — `AppProvider` holds ~50 unrelated state pieces (session, theme, layout, rain settings, users, transactions, windows) and provides a **fresh object literal every render** (`<AppContext.Provider value={{…}}>`), so any state change (e.g. a density slider drag) re-renders every consumer (`Topbar`, `Taskbar`, `Windows`, `Layout`, active pages). Split into session / appearance / UI contexts or keep one context but `useMemo` the value and read via selectors.
- [ ] **[P1] Debounce localStorage writes from UI setters** — appearance setters in `AppContext` (font size, density, radius, `setBgAnimSetting`, etc.) do a synchronous `localStorage.setItem` on **every** change; slider drags write dozens of times per second. Debounce persistence; the CSS-variable effects can stay live.
- [ ] **[P1] Guard window dragging against heavy re-renders** — `src/layouts/Window.jsx` `attachDrag` calls `setPos`/`setWidth` on every `mousemove`, re-rendering the whole window (full page with tables) per frame. Throttle with `requestAnimationFrame` and `useLayoutEffect`/refs to apply geometry without re-rendering children (children don't depend on geometry).
- [ ] **[P2] Reduce repeated full-app listeners** — idle detection in `AppContext.jsx:628-648` re-registers 5 window listeners whenever `idleMin` changes and the `auth:unauthorized`/matchMedia listeners are fine, but confirm no duplicate `resetTimer` registrations across hot reloads; prefer registering once with a ref.
- [ ] **[P2] Consider virtualization/pagination audit for `DataTable`/list pages** — verify list endpoints are paged and that huge result sets are not rendered as thousands of DOM rows (hooks fetch whole `resp.data` into state; e.g. `useItems.js`). If large tables are possible, virtualize rows.
- [ ] **[P2] Respect `reduceMotion`/tab-hidden for the idle rain screensaver** — default `bgAnim = "rain"` runs a full-screen canvas + backdrop blur overlay after 1 min idle (`App.jsx`, `RainGlass`); pause the rAF loop when `document.hidden` and skip when `prefers-reduced-motion`.

## E. Memory leaks & resource cleanup

- [ ] **[P1] Fix the side-effect-in-render in the toast renderer** — `src/context/AppUIContext.jsx:238-240` calls `startTimer()` inside a `useState` initializer (it is not a state initializer — it schedules a timeout); in dev StrictMode double-invokes initializers, risking double timers, and it never re-arms if deps change. Move to `useEffect(() => { startTimer(); return clear }, [t.duration, onRemove])` (legacy `src/components/ToastBox.jsx` does this correctly).
- [ ] **[P1] Unify the two parallel toast systems** — both the new context `ToastRenderer` **and** the legacy `<ToastBox/>` are mounted at once (`AppUIContext.jsx`), and `toast.*` (module-global `addToastFn`) is used by `api.js` while `showToast` is used elsewhere. Two stacks can render at the same position for one event. Keep one, delete the other.
- [ ] **[P2] Clean up fetch state after unmount** — page/hook data loads (`useItems.js` `getAllItems`, etc.) call `setState` after `await apiRequest` with no cancellation/unmounted guard. Add an `AbortController`/`cancelled` flag in effects or accept-and-ignore pattern.
- [ ] **[P2] Check all window/interval cleanup already present** — Taskbar clock, Window keydown/mousedown, Modal, Drawer, Confirm, SidePanel, DigitalClock, RainGlass all clean up correctly on unmount; keep it that way when adding new listeners (and re-run a heap snapshot with React DevTools "record allocations" over an open/close window session to confirm no growth).

## F. Code hygiene flagged by the audit

- [ ] **[P2] Cut the 1,047 lint errors / 64 warnings** (`npm run lint`) before go-live — dominated by `react-hooks/immutability`, `no-unused-vars` (e.g. `src/print/PrintHeader.jsx`, `src/print/format.jsx` react-refresh violations), and `LoginPage.jsx` `checkBackend` defined-after-use in an effect.
- [ ] **[P2] Remove dead/demo state from `AppContext`** — `theme`/`setTheme`, hard-coded `initialUsers`/`initialTransactions`, `users`, `transactions`, CRUD helpers and `categoryOptions` look like demo scaffolding for `UsersPage`/`TransactionsPage`/`HomePage`; move to local state or delete to shrink the context and bundle.
- [ ] **[P2] Fix `LoginPage` effect correctness** — `checkBackend()` is called before declaration and re-runs on every `isSavedMode` toggle (`LoginPage.jsx:33-43`); move above the effect, run once on mount, and stop the health check re-firing on mode switches.
