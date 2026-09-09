import { IconClose, IconChevronDown } from "@/icons";
import { moduleShade } from "@/utils/theme";

/**
 * Dropdown panel listing open popup windows with restore/minimize/close
 * actions. Reusable in ModulePage header, Taskbar overflow, and anywhere
 * a window list is needed.
 *
 * Props:
 *   popups        – array of popup objects
 *   open          – boolean, whether to show the panel
 *   title         – panel header text (default: "Windows")
 *   onToggle      – callback to close the panel
 *   onRestore     – callback(key) to restore a popup
 *   onHide        – callback(key) to minimize a popup
 *   onClose       – callback(key) to close a popup
 *   onHideAll     – callback to minimize all
 *   onCloseAll    – callback to close all
 *   panelClassName – extra className for the panel div
 */
export default function PopupList({
  popups,
  open,
  title = "Windows",
  onToggle,
  onRestore,
  onHide,
  onClose,
  onHideAll,
  onCloseAll,
  panelClassName = "",
}) {
  if (!open) return null;

  return (
    <div className={`popup-list__panel${panelClassName ? " " + panelClassName : ""}`}>
      <div className="popup-list__header">
        <span className="popup-list__title">
          {title} ({popups.length})
        </span>
        <div className="popup-list__actions">
          <button
            type="button"
            className="popup-list__action-btn"
            onClick={onHideAll}
            title="Minimize all open windows"
          >
            <IconChevronDown size={12} />
            Hide all
          </button>
          <button
            type="button"
            className="popup-list__action-btn"
            onClick={onCloseAll}
            title="Close all open windows"
          >
            <IconClose size={12} />
            Close all
          </button>
          <button
            type="button"
            className="popup-list__action-btn popup-list__action-btn--icon"
            onClick={onToggle}
            aria-label="Close window list"
            title="Close list"
          >
            <IconClose size={14} />
          </button>
        </div>
      </div>
      {popups.length === 0 ? (
        <p className="popup-list__empty">No open windows</p>
      ) : (
        popups.map((p) => (
          <div key={p.key} className="popup-list__row">
            <button
              type="button"
              className="popup-list__row-main"
              onClick={() => {
                onRestore(p.key);
                onToggle();
              }}
              title={
                p.hidden
                  ? `Open ${p.menu.menus_mname}`
                  : `Bring ${p.menu.menus_mname} to front`
              }
            >
              <span
                className="popup-list__row-icon"
                style={{ color: moduleShade(p.menu.id) }}
              >
                {p.menu.menus_micon}
              </span>
              <span
                className={`popup-list__row-name${p.hidden ? " popup-list__row-name--dimmed" : ""}`}
              >
                {p.menu.menus_mname}
              </span>
              {p.hidden && (
                <span className="popup-list__badge">minimized</span>
              )}
            </button>
            {!p.hidden && (
              <button
                type="button"
                className="popup-list__row-action"
                onClick={() => onHide(p.key)}
                title={`Minimize ${p.menu.menus_mname}`}
                aria-label={`Minimize ${p.menu.menus_mname}`}
              >
                <IconChevronDown size={14} />
              </button>
            )}
            <button
              type="button"
              className="popup-list__row-action"
              onClick={() => onClose(p.key)}
              title={`Close ${p.menu.menus_mname}`}
              aria-label={`Close ${p.menu.menus_mname}`}
            >
              <IconClose size={14} />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
