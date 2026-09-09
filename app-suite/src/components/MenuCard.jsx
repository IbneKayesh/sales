import { useState } from "react";
import { IconStar, IconPopup } from "@/icons";
import Button from "@/components/Button";
import { moduleShade } from "@/utils/theme";

/**
 * Reusable menu card with icon, name, description, pin toggle, and
 * optional open-in-window button. Tinted with the module's shade color.
 */
export default function MenuCard({
  menu,
  onClick,
  onOpenPopup,
  pinned = false,
  onTogglePin = () => {},
  openMode = "both",
}) {
  const [hovered, setHovered] = useState(false);
  const canOpenLink = openMode === "link" || openMode === "both";
  const canOpenWindow = openMode === "window" || openMode === "both";
  const shade = moduleShade(menu.id);

  return (
    <div
      role="group"
      aria-label={menu.menus_mname}
      title={menu.menus_mname}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`menu-card${hovered ? " menu-card--hovered" : ""}`}
      style={{
        "--menu-shade": shade,
        "--menu-shade-border": `color-mix(in srgb, ${shade} 42%, transparent)`,
        "--menu-shade-bg": `color-mix(in srgb, ${shade} 10%, transparent)`,
        "--menu-shade-shadow": `0 4px 12px color-mix(in srgb, ${shade} 20%, transparent)`,
      }}
    >
      <button
        type="button"
        onClick={() => {
          if (canOpenLink) onClick(menu);
          else onOpenPopup(menu);
        }}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className="menu-card__main"
      >
        <div className="menu-card__icon">
          {menu.menus_micon}
        </div>
        <div className="menu-card__text">
          <span className="menu-card__name">{menu.menus_mname}</span>
          <span className="menu-card__desc">{menu.menus_mdesc}</span>
        </div>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onTogglePin(menu);
        }}
        className={`menu-card__pin${pinned ? " menu-card__pin--active" : ""}`}
        title={pinned ? `Unpin ${menu.menus_mname}` : `Pin ${menu.menus_mname}`}
        aria-label={pinned ? `Unpin ${menu.menus_mname}` : `Pin ${menu.menus_mname}`}
        aria-pressed={pinned}
      >
        <IconStar size={16} fill={pinned ? "currentColor" : "none"} />
      </button>
      {canOpenWindow && (
        <Button
          variant="ghost"
          size="sm"
          icon={<IconPopup size={16} />}
          onClick={(e) => {
            e.stopPropagation();
            onOpenPopup(menu);
          }}
          title={`Open ${menu.menus_mname} in window`}
          aria-label={`Open ${menu.menus_mname} in window`}
        />
      )}
    </div>
  );
}
