
import './ButtonGroup.css';
/**
 * ButtonGroup — a reusable segmented button group component.
 *
 * Supports icons, labels, active state, multiple sizes, variants, 
 * and horizontal/vertical directions.
 *
 * @example
 * <ButtonGroup
 *   buttons={[
 *     { id: 'all', label: 'All' },
 *     { id: 'photos', label: 'Photos', icon: <IconFileImage /> },
 *   ]}
 *   activeId="all"
 *   onChange={(id) => setActiveCategory(id)}
 *   ariaLabel="Filter by category"
 * />
 */
const ButtonGroup = ({
  /** Array of button items: { id, label, icon?, title? } */
  buttons = [],
  /** Currently selected/active button id */
  activeId,
  /** Called with the button id when clicked */
  onChange,
  /** Size variant: 'sm' | 'md' | 'lg' */
  size = 'sm',
  /** Visual variant: 'outline' | 'filled' | 'ghost' */
  variant = 'outline',
  /** Layout direction: 'horizontal' | 'vertical' */
  direction = 'horizontal',
  /** Additional class on the wrapper */
  className,
  /** ARIA label for the group role */
  ariaLabel = 'Button group',
  /** Enable compact mode (tighter spacing) */
  compact = false,
  /** Allow multiple buttons to be selected at once */
  multiSelect = false,
  /** Array of selected ids (used when multiSelect is true) */
  selectedIds = [],
  /** Called with selected ids array (used when multiSelect is true) */
  onSelectionChange,
}) => {
  const handleClick = (id) => {
    if (multiSelect) {
      const next = selectedIds.includes(id)
        ? selectedIds.filter((sid) => sid !== id)
        : [...selectedIds, id];
      onSelectionChange?.(next);
    } else {
      onChange?.(id);
    }
  };

  const isActive = (id) => {
    if (multiSelect) return selectedIds.includes(id);
    return activeId === id;
  };

  if (!buttons || buttons.length === 0) return null;

  const wrapperClass = [
    'btn-group',
    direction,
    `size-${size}`,
    `variant-${variant}`,
    compact ? 'compact' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={wrapperClass}
      role="group"
      aria-label={ariaLabel}
    >
      {buttons.map((btn) => {
        const active = isActive(btn.id);
        const btnClass = [
          'btn-item',
          active ? 'btn-active' : '',
          btn.danger ? 'btn-danger-item' : '',
          btn.icon && !btn.label ? 'btn-icon-only' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <button
            key={btn.id}
            className={btnClass}
            onClick={() => handleClick(btn.id)}
            title={btn.title || btn.label}
            aria-pressed={active}
            type="button"
          >
            {btn.icon && (
              <span className="btn-item-icon">
                {btn.icon}
              </span>
            )}
            {btn.label && (
              <span className="btn-item-label">{btn.label}</span>
            )}
            {btn.count !== undefined && (
              <span className="btn-item-count">{btn.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ButtonGroup;
