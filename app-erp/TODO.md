gkgrounckgkSettingsPage.jsxa# TODO - Theme + Wallpaper updates

## Task 1: Apply theme color to selected components/pages
- [ ] Audit and remove hard-coded accent colors in:
  - [ ] `src/components/AweMenu.jsx`
  - [ ] `src/components/NotificationPopup.jsx`
  - [ ] `src/components/Taskbar.jsx`
  - [ ] `src/components/UserProfileFlyout.jsx`
  - [ ] `src/components/WindowsOverview.jsx`
  - [ ] all `src/pages/**/*.jsx`
- [ ] Ensure components use `var(--accent-*)` / `var(--text-*)` variables

## Task 2: WinFileExplore background change like DesktopPage
- [ ] Update `src/pages/layouts/WinFileExplore.jsx` to apply wallpaper to explorer background (via passed `wallpaperUrl`)
- [x] Add required CSS in `src/index.css` (WinFileExplore wallpaper)

- [x] Add required CSS in `src/index.css` (WinFileExplore wallpaper)


## Task 3: Locked screen background = DesktopPage background
- [x] Update `.lockscreen-container::before` in `src/App.css` to use `--wallpaper-url` instead of hardcoded image
- [x] Update `src/App.jsx` lock screen render to set `style={{ '--wallpaper-url': wallpaperUrl }}`

- [x] Verify default lock wallpaper matches current desktop wallpaper


## Validation
- [ ] `npm run build` (or `npm run dev`) to ensure no build errors
- [ ] Manual visual check: accent switch + wallpaper change + lock screen background

