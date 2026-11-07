APP THEME UI - VISIBILITY & LEGIBILITY IMPROVEMENT LIST
audited: 2026-11-07
scope: all 59 files in src/components/*.jsx, their rules in src/App.css, theme tokens in src/index.css,
       MenuCard styles in src/pages/M01/ModulePage.css, DigitalClock.css and AnalogClock.css
target: WCAG 2.1 AA (4.5:1 normal text, 3:1 large text, icons and control boundaries)
status: audit complete - no fixes applied yet
note: previous step 1 / step 2 calculator work is complete and has been removed from this tracker.

---------------------------------------------------------------------------------------------------
1. GLOBAL THEME TOKENS - fix these first, most component problems disappear here
---------------------------------------------------------------------------------------------------

[ ] 1.1 Semantic colours are used as text but fail contrast.
        Measured (light theme): --success #22c55e = 2.28:1, --warning #f59e0b = 2.15:1,
        --danger #ef4444 = 3.76:1, --info #3b82f6 = 3.68:1 on #ffffff.
        On their own 12% tinted backgrounds: 2.05 / 1.96 / 3.23 / 3.20.
        Affected: .badge--success/--warning/--danger/--info, .chip--success/--warning/--danger/--info,
        .step-page__step--completed .step-page__label, .data-table__export-btn,
        .loadable-card__error, .empty-state__icon--success/--error, .toast-item--* .toast-item__icon,
        .input-rating__star--full/--half, DataCard icon + trend badge, FileUpload file-type colours,
        ActionButton .text-success/.text-danger, InfoButton tips block.
        Fix: add text-safe tokens (e.g. --success-text #15803d, --warning-text #b45309,
        --danger-text #b91c1c, --info-text #1d4ed8; lighter equivalents in dark mode) and use them for
        foreground text/icons. Keep the 500 shades for fills, dots, bars and charts only.

[ ] 1.2 Greeting / module headings use --accent-light (theme-400, default #a78bfa).
        Measured 2.72:1 on #ffffff and 2.48:1 on --surface-alt.
        Affected: .greeting-header__title, .greeting-header__subtitle, .module-page__title,
        .module-page__subtitle (App.css 3534, 3541, 3594, 3601).
        Fix: use --text-primary for titles and --text-secondary for subtitles, or the theme-700 shade.

[ ] 1.3 Disabled states are too faint to read.
        --text-disabled #d1d5db = 1.47:1; opacity 0.5 on body text drops it to about 3.38:1.
        Patterns found: opacity 0.5 on .btn:disabled, inputs, checkboxes, dropdown, group buttons, chips,
        switches, accordion items; 0.4 on tab-page tabs and step-page markers; 0.35 on data-table page
        buttons; 0.3/0.2 on carousel and kanban drag states.
        Fix: introduce one --disabled-opacity (0.65) and --text-disabled >= 4.5:1 in light mode, keep
        cursor: not-allowed + aria-disabled. Never rely on opacity alone for disabled labels.

[ ] 1.4 Placeholders fail contrast.
        Global ::placeholder (App.css 76) and .dropdown__value--placeholder use --text-secondary at
        opacity 0.6 -> effective #9399a1 = 2.87:1. Same in .input-time__input::placeholder and
        .input-textarea__textarea::placeholder.
        Fix: add --text-placeholder: #6b7280 (4.8:1) and remove the opacity.

[ ] 1.5 Metadata text is smaller than 11px in many places and ignores --fs-scale.
        Found: .file-upload__file-ext 8px, .notification-bell__badge 9px, .kanban-card__avatar-more 9px,
        .popup-list__badge 10px, .tab-page__tab-badge 10px, .step-page__desc 10px, .chip--sm 10px,
        .drawer__group-btn 10px, .tree-dt__th 10px, .data-table--dense .data-table__th 10px,
        .kanban-card__label 10px, .kanban-card__avatar-letter 10px, .data-table__th 11px,
        .popup-list__title/action-btn 11px, Calculator equation/history 10-11px.
        Fix: minimum 11px for secondary metadata (12px where space allows), expressed with
        calc(<px> * var(--fs-scale, 1)) so the Text Size preference scales them.

[ ] 1.6 Hard-coded pixel font sizes bypass the Text Size preference.
        Button.jsx sizes.xs/sm/md/lg hard-code 12/13/14/16px; Calculator uses 10/11/32px; many labels
        above use raw px. Fix: use --fs-xs / --fs-sm / --fs-base or calc(px * var(--fs-scale, 1)).

[ ] 1.7 Focus indicators are missing on several interactive elements.
        No :focus-visible rules for .popup-list__action-btn, .popup-list__row-action, .toast-item__close,
        .modal__close, .sidepanel__close, .drawer__close, .drawer__group-btn, .carousel__arrow,
        .image-gallery__lightbox-close/-arrow, .data-table__page-btn, .data-table__th (sortable),
        .tree-dt__toggle, .tree-dt__expand-btn, .notification-bell__mark-all, Calculator keypad keys.
        InfoButton trigger and .menu-card__main also set outline: none.
        Fix: one shared rule for button/a/[role=button]:focus-visible with 2px --primary-border and
        outline-offset: 2px; remove the local outline: none overrides.

[ ] 1.8 Several custom controls are not reachable or not operable by keyboard.
        InputCalendar trigger is a clickable div, the inner input is readOnly and has no key handler;
        InfoButton custom trigger is a span role=button without Enter/Space activation;
        Dropdown/MultiSelect trigger supports Enter/Space but no Arrow/Home/End option navigation;
        tree checkboxes are spans (role=checkbox) instead of native inputs.
        Fix: native button/input where possible; otherwise add key handling and aria-activedescendant.

[ ] 1.9 Icon-only targets are below 32px and some have no aria-label.
        InfoButton 20x20, .popup-list__row-action 26x26, .menu-card__pin 26x26, .chip__remove 16x16,
        .toast-item__close 24x24; DataTable search clear has no aria-label; TreeDataTable expand/collapse
        buttons use title only; ActionButton buttons pass title but no aria-label.
        Fix: 32px hit area (padding is fine), aria-label on every icon-only action.

[ ] 1.10 White text on semantic fills fails.
         #ffffff on #22c55e = 2.28:1, on #f59e0b = 2.15:1, on #ef4444 = 3.76:1.
         Affected: .step-page__step--completed .step-page__marker (check icon), .notification-bell__badge,
         .chip--clickable.chip--success/--warning:hover, Kanban label text, .btn--success/--warning text
         (Button already uses --success-on / --warning-on, confirm it is dark).
         Fix: use the -on token for each semantic fill, or darken the fill for text-bearing badges.

[ ] 1.11 Hover-only affordances disappear for touch and keyboard users.
         .carousel__arrow has opacity: 0 and only appears on .carousel:hover / :focus-within; the dots are
         8px and 50% white; gallery lightbox counter is opacity 0.6.
         Fix: keep arrows at 0.65 opacity at rest, 1 on hover/focus; enlarge dots to 10px with a visible
         inactive border; remove the counter opacity.

[ ] 1.12 Empty progress/skeleton states are nearly invisible in light mode.
         .progress__track uses --surface-alt on --surface (about 1.05:1) and .skeleton blends
         --surface-alt with --surface-hover (about 1.1:1).
         Fix: add --track-bg / --skeleton-base with at least 3:1 against the card surface in both modes.

[ ] 1.13 Reduced-motion preference does not stop JS animations.
         The global html[data-motion="reduced"] rule only shortens CSS animations. RainGlass and
         DigitalClock keep their requestAnimationFrame loops running; Progress pulse and Skeleton shimmer
         are CSS but should also be checked.
         Fix: read the preference in JS and skip rAF / render a static frame.

---------------------------------------------------------------------------------------------------
2. BUTTONS, ACTIONS AND CHROME
---------------------------------------------------------------------------------------------------

[ ] 2.1 Button.jsx - hard-coded 12/13/14/16px sizes (see 1.6); disabled/loading uses the 0.5 opacity
        (see 1.3); loading replaces the icon with a spinner but does not expose aria-busy. Fix: scale with
        --fs-scale, keep a minimum 0.65 opacity, add aria-busy and a visually hidden "Loading" label.

[ ] 2.2 ActionButton.jsx - copy/edit/enable/disable are icon-only with title but no aria-label; the
        success/error icons use .text-success/.text-danger (2.28 / 3.76:1). Fix: add aria-label per action
        and the text-safe semantic tokens.

[ ] 2.3 GroupButton.jsx - selected/unselected text is 12-13px; disabled items rely on 0.5 opacity. Fix:
        disabled contrast (1.3) and add a non-colour selected cue (weight/underline) for the active item.

[ ] 2.4 FullscreenButton.jsx - ships no styles at all; visibility depends entirely on the caller's
        className/style. Fix: give it a default 32px icon-button style with hover and focus-visible states,
        or document that callers must supply one.

[ ] 2.5 MenuCard.jsx - .menu-card__main sets outline: none (ModulePage.css ~120); description is 11px
        --text-muted; pin button is 26x26 with a muted icon and only colour changes when pinned; the
        open-in-window ghost button is low-emphasis. Fix: focus ring, 32px pin, 12px description, and show
        the pin/open controls at a visible resting opacity.

[ ] 2.6 PopupList.jsx - title and Hide all / Close all are 11px --text-muted; the "minimized" badge is
        10px; row actions are 26px; no focus-visible. Fix: 12px labels, 32px actions, focus ring, and give
        the minimized row a visible state beyond a font-weight change.

[ ] 2.7 ReportExportBar.jsx - "Export Options" is 12px uppercase --text-muted and all labels are
        hard-coded English; compact prop has no effect (both branches use size="sm"). Fix: use the i18n
        dictionary, --text-secondary at 12px, and actually vary the size/compact layout.

---------------------------------------------------------------------------------------------------
3. TEXT, LABELS AND STATUS
---------------------------------------------------------------------------------------------------

[ ] 3.1 Badge.jsx - all variants put the 500 semantic colour on its 12% tint (2.0-3.2:1), 11px text.
        Fix: text-safe tokens (1.1); keep the dot at the 500 shade, add a 1px border for shape cue.

[ ] 3.2 Chip.jsx - same semantic colour problem; --sm is 10px; remove control is 16x16 with opacity 0.5;
        disabled uses 0.5. Fix: 1.1, minimum 12px, 24px remove target, and keep the chip label at full
        contrast when removable.

[ ] 3.3 InactiveText.jsx - wraps a danger Badge with a 12px close icon; inherits 3.2. Fix: with 1.1.

[ ] 3.4 AuditData.jsx - a plain div uses .badge--primary for its background (violet tint) plus .text-muted
        and 11px; contrast is about 4.03:1 and the row does not visually read as a badge. Fix: use a normal
        surface-alt panel with --text-secondary, or a real Badge for the active state only.

[ ] 3.5 Breadcrumb.jsx - separators use opacity 0.5 (about 2.5:1 for a 12px glyph); the current item and
        links are both --text-secondary. Fix: separator opacity 0.8, current item --text-primary with
        font-weight 600, links 12px with underline on hover/focus.

[ ] 3.6 EmptyState.jsx - message is 12px --text-secondary (fine), icons reuse the low-contrast semantic
        pairs; no change to the copy. Fix: icon colours via 1.1 only.

[ ] 3.7 GreetingHeader.jsx - title and subtitle both --accent-light (2.7:1). Fix: 1.2. Also make the
        greeting icon decorative (aria-hidden) so it is not announced before the name.

[ ] 3.8 PageCard.jsx - subtitle is 11px --text-secondary; PageSection title is an inline 11px uppercase
        --text-secondary that ignores --fs-scale. Fix: 12px subtitle, section title via a token/class.

[ ] 3.9 Progress.jsx - track nearly invisible (1.12); label/value 12px; description 11px --text-muted;
        no text equivalent for screen readers beyond role=progressbar. Fix: stronger track, 12px
        description, and keep aria-label/aria-valuetext in sync.

[ ] 3.10 Skeleton.jsx - shimmer contrast too low (1.12); no reduced-motion opt-out. Fix: dedicated
         skeleton tokens and disable the animation under reduced motion.

[ ] 3.11 LoadableCard.jsx - error state is --danger on --danger-bg (3.23:1) at 12px; loading overlay is
        40% black + blur and the label sits inside it; error icon is a raw emoji. Fix: 1.1 for the error
         text, and use an icon component for consistent rendering.

[ ] 3.12 SaveOverlay.jsx - blocks the page but exposes no role="status"/aria-busy and does not move focus;
        title 16px / message 12px are fine. Fix: role=status + aria-live, aria-busy on the overlay, and
        trap focus while saving.

[ ] 3.13 StatListItem.jsx - label and sub are 11px --text-muted; status is encoded only by an 8px colour
        dot. Fix: 12px labels, add a text or icon cue next to the dot, and accept a semantic tone prop
        instead of a raw colour.

[ ] 3.14 DataCard.jsx - icon and trend badge use semantic 500 colours on tinted backgrounds; label is 12px
        --text-secondary. Fix: 1.1, keep the icon at 20-24px, and ensure the trend arrow is not the only
        direction cue.

---------------------------------------------------------------------------------------------------
4. FORMS AND INPUTS
---------------------------------------------------------------------------------------------------

[ ] 4.1 InputText.jsx / InputTextArea.jsx / InputNumber.jsx / InputTime.jsx - error text is 11px
        --danger (3.76:1); hints are 11px --text-muted; placeholders 2.87:1; time picker indicator is
        opacity 0.4. Fix: 1.1 for errors, 12px hints, 1.4 for placeholders, indicator opacity 0.7.

[ ] 4.2 InputLabel.jsx - required asterisk is --danger (3.76:1) and the hint is 11px --text-muted. Fix:
        darker danger token and 12px hint; keep the asterisk aria-hidden plus "(required)" for AT.

[ ] 4.3 Checkbox.jsx - unchecked border is --border (~1.5:1) and the box is 20px; disabled uses 0.5.
        Fix: 3:1 border, 24px target, and disabled contrast from 1.3.

[ ] 4.4 InputSwitch.jsx - off track is --border (~1.5:1) on white, so the off state is hard to see;
        disabled uses 0.5. Fix: use --text-disabled/--border-strong (>=3:1) for the off track and add a
        visible thumb shadow/border.

[ ] 4.5 InputSlider.jsx - track is low-contrast, the value bubble is 11px, and the thumb has no visible
        focus ring outside .input-slider--focused. Fix: 3:1 track, 12px value, focus-visible ring, and
        aria-valuetext with the unit.

[ ] 4.6 InputRating.jsx - filled stars are --warning (#f59e0b, 2.15:1) and empty stars are --text-muted,
        so the rating is hard to read and relies on colour only. Fix: darker amber for the fill or a
        stroke/outline, and expose the numeric value in text.

[ ] 4.7 InputColor.jsx - swatches are colour-only; the selected state appears to rely on a ring. Check
        that the selected swatch has a 2px outline with offset and that the hex label is >=12px. Fix:
        visible check mark + label, not just the swatch border.

[ ] 4.8 InputCalendar.jsx + Calendar.jsx - the trigger is a clickable div (no keyboard open), weekday
        headers are 11px at opacity 0.6, day cells are 12px --text-secondary, nav buttons have no
        focus-visible, and the popup has no focus trap. Fix: button trigger with Enter/Space, header
        opacity 0.8, focus ring on nav/day cells, aria-pressed on the selected day. Today vs selected also
        needs a non-colour cue (dot/underline) because both use --primary.

[ ] 4.9 Dropdown.jsx / MultiSelect.jsx - placeholder 2.87:1; options use --text-secondary at 12-13px;
        the search field is 12px; the clear button is tabIndex -1 (keyboard cannot clear); grid rows are
        divs with role=option but no arrow-key navigation; no focus-visible on the trigger (the
        --focused class does provide a ring). Fix: 1.4, option text --text-primary at >=13px, keyboard
        option navigation, and a reachable clear action.

[ ] 4.10 FileUpload.jsx - file extension label is 8px; "or drag & drop here" and hints are --text-muted;
         all copy is hard-coded English; the input is hidden and the dropzone relies on a click handler.
         Fix: 10px minimum extension label, 12px hints, i18n strings, and keep the native input as the
         accessible control (label + focus ring).

[ ] 4.11 FileUploadModal.jsx - same strings and file-type colours as 4.10; the manage-file row is a button
         with a muted refresh icon; destructive actions are next to download/replace. Fix: i18n, clearer
         destructive emphasis, 32px icons, and a visible "manage" label instead of icon-only affordance.

---------------------------------------------------------------------------------------------------
5. DATA DISPLAY
---------------------------------------------------------------------------------------------------

[ ] 5.1 DataTable.jsx - header 11px (dense 10px) uppercase --text-secondary; sort icon opacity 0.4;
        "records" count 11px; export button is 11px --info (3.68:1); disabled pager opacity 0.35; search
        clear button has no aria-label; pagination numbers lack aria-current. Fix: 12px headers, sort icon
        opacity 0.7 at rest, text-safe export colour, disabled pager 0.65, aria-labels/aria-current.

[ ] 5.2 TreeDataTable.jsx - header is 10px even in the normal (non-dense) variant; sort icon 0.4; tree
        checkbox is an 18px span with a 10px glyph on a --border outline (~1.5:1); connector lines use
        --border; expand/collapse buttons are icon-only with title. Fix: 12px header, 20-24px checkbox with
        a 3:1 border, darker connectors, aria-labels on expand/collapse.

[ ] 5.3 TreeView.jsx - same 20px checkbox with a 2px --border (1.5:1) and a 10px check glyph; selected
        label is --primary on --primary-bg (about 5:1, acceptable); toggle is 22px. Fix: 3:1 checkbox
        border, 24px toggle target, 14px check glyph.

[ ] 5.4 KanbanBoard.jsx - labels are 10px white text on an arbitrary label.color (contrast unpredictable,
        e.g. yellow fails badly); avatar letters 10px, "+N" 9px; dragging card dims to 0.4; empty column
        text is small/muted; drag handle is aria-hidden and there is no keyboard move alternative. Fix:
        compute readable foreground from label colour (or use a fixed dark label palette), 11-12px
        metadata, 0.7 drag opacity, and keyboard move actions.

[ ] 5.5 Calendar.jsx - see 4.8 (shared day/header styles).

---------------------------------------------------------------------------------------------------
6. OVERLAYS, NAVIGATION AND FEEDBACK
---------------------------------------------------------------------------------------------------

[ ] 6.1 Modal.jsx - close button is 32px but has no focus-visible; the dialog has no focus trap or initial
        focus, so keyboard focus stays behind the overlay; aria-labelledby is left to callers. Fix: focus
        the first control on open, trap Tab, restore focus on close, add focus ring and a required label.

[ ] 6.2 SidePanel.jsx / Drawer.jsx - same focus-trap gap; Drawer group label is 10px uppercase, group icon
        opacity 0.7, item badge 10px, group chevron 12px; subtitle is 12px --text-secondary. Fix: focus
        trap, 12px group label, 32px group hit area, 11-12px badge.

[ ] 6.3 Confirm.jsx - uses a fixed id="confirm-title" (duplicate ids if two dialogs mount); message is
        12-13px --text-secondary; no initial focus/trap; no aria-describedby. Fix: useId for the title and
        description, focus the cancel/confirm button, add aria-describedby.

[ ] 6.4 ToastBox.jsx - message is 12px --text-primary (good); icons use the semantic 500 pairs (2.0-3.2:1);
        close is 24px --text-secondary with no focus-visible; role=alert on every toast can be noisy for
        info. Fix: 1.1 icon colours, 32px close with focus ring, role=status for info/success and alert for
        error/warning.

[ ] 6.5 NotificationBell.jsx - unread badge is 9px white on --danger (3.76:1) and can overflow the 16px
        height for "99+"; item time is 10px --text-muted; unread is colour/dot only; the panel is fixed
        360px wide (overflows narrow phones). Fix: 11px badge with min 18px height, text-safe red, add
        "Unread" text/aria-label, 11px time, max-width: calc(100vw - 24px).

[ ] 6.6 AccordionCard.jsx - collapsed content is hidden only with max-height/opacity, so its controls stay
        tabbable; disabled item is opacity 0.5. Fix: hidden/inert when collapsed, 0.65 disabled, and keep
        aria-expanded/aria-controls.

[ ] 6.7 TabPage.jsx - inactive tabs are 12-13px --text-secondary; disabled tabs opacity 0.4; tab badge is
        10px white on --primary; the tab strip scrolls but has no overflow affordance. Fix: 12px tabs,
        disabled 0.65, 11px badge with 18px height, add a fade/scroll hint at the edges.

[ ] 6.8 StepPage.jsx - completed label is --success (2.28:1); description is 10px nowrap (truncates or
        overflows on mobile); disabled marker 0.4; completed marker uses a white check on green (2.28:1).
        Fix: 1.1 for the label, 11-12px description with wrap, dark check on green or a darker green fill.

[ ] 6.9 Carousel.jsx - arrows invisible until hover/focus (1.11); dots 8px at 50% white; slide labels are
        only in aria-label. Fix: persistent arrows at 0.65, 10px dots with a border, and a visible caption
        for the active slide.

[ ] 6.10 ImageGallery.jsx - caption uses white text over an arbitrary user `bg` (contrast can fail);
         caption gradient is only 0.6 black; lightbox counter is opacity 0.6; arrows/close have no
         focus-visible. Fix: enforce a dark scrim behind captions, remove counter opacity, add focus rings.

---------------------------------------------------------------------------------------------------
7. MEDIA, CLOCKS AND DECORATIVE COMPONENTS
---------------------------------------------------------------------------------------------------

[ ] 7.1 Calculator.jsx - equation 11px --text-muted, amount-in-words 10px --text-muted, history 11-12px,
        "Clear" is 11px muted with no hover/focus; keyboard-active key state only changes brightness/scale
        (no colour change); title bar is draggable but has no keyboard alternative. Fix: 12px helper text,
        a real focus ring on Clear and every key, a colour change for the active key, and arrow-key move.

[ ] 7.2 ActiveWindowIndicator.jsx - title 13px --text-primary, subtitle 11px --text-muted, count badge
        small; truncation has title text but no keyboard expansion. Fix: 12px subtitle and expose the full
        title in an aria-label (already partially done).

[ ] 7.3 DigitalClock.jsx - decorative watch on a dark glass surface; several labels render at opacity
        0.2-0.4 (watch-minute/second text) by design. Confirm the time/date remain readable at 100%
        opacity and that it is aria-hidden (it is purely visual). Fix: only if the clock is used as a
        real clock - expose a text time and respect reduced motion (1.13).

[ ] 7.4 AnalogClock.jsx - time/date are real text in .ac-digital-time/date; verify contrast on the glass
        card in both modes. Fix: only if contrast < 3:1; otherwise no change.

[ ] 7.5 RainGlass.jsx - canvas is decorative and already aria-hidden="true"; it ignores reduced motion.
        Fix: skip the rAF loop when reduced motion is set (1.13).

---------------------------------------------------------------------------------------------------
8. COMPONENTS REVIEWED - NO COLOUR/SIZE CHANGE NEEDED (keep an eye on regressions)
---------------------------------------------------------------------------------------------------

ErrorBoundary (danger icon 3.23:1 passes the 3:1 icon threshold), EmptyState structure,
InactiveText structure, InputLabel structure, LoadableCard layout, SaveOverlay layout,
DataCard layout (colours handled in 3.14), Progress structure, Skeleton structure,
PageCard layout, Confirm layout, Modal layout, SidePanel layout, Drawer layout,
ToastBox layout, PopupList layout, Breadcrumb layout, Button layout,
ReportExportBar layout, GroupButton layout, Checkbox structure, InputSwitch structure,
InputSlider structure, MultiSelect structure, Dropdown structure, FileUpload structure,
FileUploadModal structure, Calendar structure, Carousel structure, ImageGallery structure,
TabPage structure, StepPage structure, AccordionCard structure, TreeView structure,
TreeDataTable structure, DataTable structure, KanbanBoard structure, Calculator layout,
ActiveWindowIndicator layout, GreetingHeader layout, StatListItem layout, AuditData layout,
Badge structure, Chip structure, DataCardGrid, ErrorBoundary retry, FullscreenButton logic,
NotificationBell logic, MenuCard layout, ActionButton layout.

---------------------------------------------------------------------------------------------------
9. SUGGESTED FIX ORDER
---------------------------------------------------------------------------------------------------

1) Tokens + global rules: 1.1, 1.2, 1.3, 1.4, 1.6, 1.7 (one commit, biggest win).
2) Text-size sweep: 1.5 (metadata) and 1.10/1.11 (white-on-fill and hover-only).
3) High-traffic components: DataTable, TreeDataTable, Dropdown/MultiSelect, InputCalendar,
   Modal/Confirm, NotificationBell, StepPage, TabPage.
4) Remaining components: forms, cards, media, Calculator.
5) Accessibility pass: focus traps (1.8, 6.1-6.3), reduced motion (1.13), aria labels (1.9).
