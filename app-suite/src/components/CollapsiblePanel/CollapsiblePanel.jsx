import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IconChevronRight } from '@/assets/icons';
import styles from './CollapsiblePanel.module.css';

/**
 * CollapsiblePanel — a reusable collapsible/expandable section.
 *
 * Features:
 * - Left-aligned chevron arrow (→ rotates to ↓ when open)
 * - Title text with optional icon
 * - Smooth slide-down content animation
 * - Controlled (via `open` prop) or uncontrolled (via `defaultOpen`)
 * - Accessible (aria-expanded, role="button" on header)
 *
 * @example
 * <CollapsiblePanel title="Quick Access" defaultOpen>
 *   <button>All Files</button>
 *   <button>Recent</button>
 * </CollapsiblePanel>
 */
const CollapsiblePanel = ({
  /** Panel title text */
  title,
  /** Optional icon rendered before the title */
  icon,
  /** Panel content */
  children,
  /** Controlled open state (omit for uncontrolled) */
  open: controlledOpen,
  /** Default open state (uncontrolled mode) */
  defaultOpen = false,
  /** Called with the new open state */
  onToggle,
  /** Size: 'sm' | 'md' */
  size = 'sm',
  /** Additional class on the wrapper */
  className,
  /** Right-side actions/elements rendered in the header */
  actions,
  /** Initial collapsed height in pixels (default 0) */
  collapsedHeight = 0,
}) => {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Measure content height for smooth animation
  useEffect(() => {
    if (contentRef.current) {
      const el = contentRef.current;
      const resizeObserver = new ResizeObserver(() => {
        setContentHeight(el.scrollHeight);
      });
      resizeObserver.observe(el);
      setContentHeight(el.scrollHeight);
      return () => resizeObserver.disconnect();
    }
  }, [children]);

  const handleToggle = useCallback(() => {
    if (!isControlled) {
      setInternalOpen((prev) => !prev);
    }
    onToggle?.(!isOpen);
  }, [isControlled, isOpen, onToggle]);

  const wrapperClass = [
    styles.panel,
    styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`],
    isOpen ? styles.open : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClass}>
      <button
        className={styles.header}
        onClick={handleToggle}
        aria-expanded={isOpen}
        type="button"
      >
        <span className={styles.arrowWrap}>
          <IconChevronRight className={styles.arrow} />
        </span>

        {icon && <span className={styles.headerIcon}>{icon}</span>}

        <span className={styles.title}>{title}</span>

        {actions && <span className={styles.actions}>{actions}</span>}
      </button>

      <div
        className={styles.contentWrapper}
        style={{
          maxHeight: isOpen ? `${Math.max(contentHeight, collapsedHeight + 1)}px` : `${collapsedHeight}px`,
        }}
      >
        <div ref={contentRef} className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsiblePanel;
