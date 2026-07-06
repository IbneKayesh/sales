# TODO - Fix CSS for mobile view app

- [ ] Identify mobile-specific layout/CSS issues (mismatch between Layout shell and login page)
- [ ] Update shared layout styles so login and authenticated layout use the same mobile shell behavior
- [ ] Adjust .app-shell, .app-content, and bottom bar positioning to avoid overlap/scroll issues on small screens
- [ ] Make LoginPage reuse the same padding/height strategy as Layout (no 100vw/100vh overflow issues)
- [ ] Add/adjust media queries for very small widths (<=360px, <=420px)
- [ ] Run dev server / lint / build to confirm no CSS regressions

