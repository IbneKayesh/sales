read below files need to implement them

phase 1:
[ ] [P2] snap popup windows to screen edges + cascade new windows; persist position/size per user
[ ] [P2] taskbar window menu: right-click a window button → close/minimize/pin
[x] [P2] when screen is idle for 1 min then auto start rain drops, user working it like typing or move mouse then not fall rain drops only, ThemePage.jsx > update background animation > Remove None, Rain On Glass, Applies to Workspace Page and Whole App, this all 4 buttons, and add a slider 1 to 10 min
[x] [P2] ThemePage.jsx > add an option (1) Idle (2) Always, if select Idle then add a backdrop effect to blur background, if select always then keep as it is, its doesnot block background, user work on it and rain falling simultaniusly, also improve the effect and some snowfall with rain drops

phase 2:
[] POS

phase 3:
[] Inline CSS to App.css and index.css

phase 4: (improvements)
[x] [P2] Create a **realistic live rain-on-glass animation** in React + CSS, using the uploaded image `/src/assets/rain drop.jpg` as the visual reference for the glass surface, lighting, droplet density, and overall monochrome atmosphere.

### Goal

Build a full-screen weather effect that looks like a **camera is filming through a real glass window during a cold rainy/snowy day**. The result should feel photographic and physically believable—not like simple CSS circles moving vertically.

### Visual design

* Use the supplied image as the subtle background/reference texture for the glass.
* Full viewport, responsive, with no visible UI unless explicitly needed.
* Dark-to-light neutral gray glass background.
* Hundreds of droplets distributed naturally across the glass.
* Include multiple droplet sizes:

  * **Tiny droplets:** numerous, 1–3px
  * **Small droplets:** 3–7px
  * **Medium droplets:** 7–16px
  * **Large/heavy droplets:** 16–35px
* Droplets should have realistic transparency, highlights, refraction-like distortion, soft shadows, and dark edges.
* Avoid perfectly circular droplets; use slightly irregular organic shapes.
* Vary opacity, scale, blur, and brightness.

### Rain behavior

Create continuously generated/live droplets rather than a fixed static animation.

Different droplets should behave differently:

1. Tiny droplets slowly slide downward.
2. Small droplets move at varying speeds.
3. Heavy droplets accelerate due to gravity.
4. Some droplets should remain almost stationary.
5. Some droplets should pause briefly and then continue.
6. Some droplets should merge with droplets they encounter.
7. Larger merged droplets should become slightly wider and accelerate.
8. A small percentage should split or leave a thin wet trail.
9. Add subtle horizontal drift so everything does not move in perfectly vertical lines.
10. Droplets should enter from above and naturally disappear after reaching the bottom.

Use randomized animation properties so the motion never looks synchronized.

### Glass trails

When medium/large droplets move:

* Create a subtle transparent wet trail behind them.
* Trails should taper gradually.
* Trails should be slightly blurred.
* Trails should be thinner than the parent droplet.
* Trails should fade over time.
* Do not create trails for every droplet; only a subset should have them.
* Occasionally create a very thin secondary trail.

### Snow

Add a separate snow layer:

* Small translucent snowflakes/ice particles falling behind and/or on the glass.
* Different sizes: approximately 2–8px.
* Slow downward movement.
* Gentle side-to-side drifting.
* Slight rotation.
* Random opacity.
* Some flakes should appear softly blurred because they are out of focus.
* Snow should be sparse enough that it does not overpower the rain.
* Make the snow feel photographic rather than like white geometric symbols.

### Depth of field

Create realistic depth:

* Foreground droplets: sharper, larger, darker edges.
* Midground droplets: moderately sharp.
* Background droplets: smaller, softer, lower opacity.
* Add a few heavily blurred particles/droplets to simulate lens depth of field.
* Use subtle blur and opacity variations rather than applying one global blur.

### Lighting/refraction

Make droplets appear three-dimensional:

* Use CSS radial/linear gradients for highlights.
* Add subtle specular highlights along the upper-left edge.
* Add darker shading around portions of the lower/right edge.
* Use `box-shadow`, `filter`, gradients, and pseudo-elements where appropriate.
* Large droplets should look like actual water sitting on glass.
* Avoid obvious neon/glossy effects.

### Animation architecture

Prefer a performant approach:

* React component architecture.
* Use CSS animations where they are sufficient.
* Use `requestAnimationFrame` only where dynamic physics/interaction is necessary.
* Avoid causing React re-renders every animation frame.
* Use CSS transforms (`translate3d`) for movement.
* Use CSS custom properties for randomized speed, delay, size, opacity, and drift.
* Use `useMemo`, refs, and appropriate cleanup.
* Properly cancel animation loops/timers on unmount.
* Keep the animation performant with hundreds of particles.
* Respect `prefers-reduced-motion`.

### Suggested structure

Create something similar to:
current: components/RainGlass.jsx

new:
```text
RainOnGlass/
├── RainOnGlass.jsx
├── RainOnGlass.css
└── components/
    ├── RainLayer.jsx
    ├── RainDrop.jsx
    ├── SnowLayer.jsx
    └── Snowflake.jsx
```
keep both current and new, but use new, old file kept as backup

You may simplify the structure if a better architecture is more performant.

### Important realism requirements

The final result should **not** look like:

* falling circles
* falling emojis
* repeated SVG icons
* identical droplets
* synchronized particles
* generic particle-system rain
* perfectly straight vertical lines
* cartoon snow

Instead, it should resemble **real water droplets sliding down a cold window**, with randomness, inertia, merging, trails, depth, and subtle lighting.

### Performance

Target smooth **60 FPS** on a normal modern desktop:

* Avoid excessive DOM nodes if possible.
* Consider CSS-generated particles, Canvas, or a hybrid approach if hundreds of DOM elements become expensive.
* If Canvas is used, keep React responsible for lifecycle/configuration rather than rendering every particle through React.
* Use GPU-friendly transforms.
* Automatically adapt particle density on smaller/mobile screens.

### Deliverable

Return complete, production-ready **React + CSS code** that can be dropped into a modern Vite React project.

Include:

1. Complete component code.
2. Complete CSS.
3. Any required asset/path configuration.
4. Brief setup instructions.
5. Comments explaining the important animation/physics decisions.

The final visual should closely capture the uploaded reference image while turning it into a **living, continuously evolving rain-and-snow-covered glass surface**.


general note: don't write extra css, unless required.
