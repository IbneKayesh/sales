import React from 'react';
import styles from './PageShell.module.css';

// ═══════════════════════════════════════════════════════════════════════════
// ── PageShell — Reusable ERP Page Layout ─────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
//
// Compound component providing the standard ERP page structure:
//
//   <PageShell title="Products" subtitle="Manage catalog">
//     <PageShell.Actions>
//       <ButtonGroup ... />
//     </PageShell.Actions>
//     <PageShell.Stats>
//       <PageShell.Stat label="Total" value="42" />
//       <PageShell.Stat label="Margin" value="45%" />
//     </PageShell.Stats>
//     <PageShell.Body>
//       <DataTable ... />
//     </PageShell.Body>
//     <PageShell.Footer>
//       <button>Save</button>
//     </PageShell.Footer>
//   </PageShell>
//
// ═══════════════════════════════════════════════════════════════════════════

// ── Sub-component helpers ─────────────────────────────────────────────────
const Actions = ({ children }) => (
  <div className={styles.actions}>{children}</div>
);

const Stats = ({ children }) => (
  <div className={styles.stats}>{children}</div>
);

const STAT_VARIANTS = ['warning', 'success', 'danger', 'accent'];

const Stat = ({ label, value, variant, className }) => {
  const variantClass = variant && STAT_VARIANTS.includes(variant)
    ? styles[`stat${variant.charAt(0).toUpperCase() + variant.slice(1)}`]
    : '';
  return (
    <div className={`${styles.stat} ${variantClass} ${className || ''}`}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
};

const Body = ({ children, className }) => (
  <div className={`${styles.body} ${className || ''}`}>{children}</div>
);

const Footer = ({ children }) => (
  <div className={styles.footer}>{children}</div>
);

// ── Main PageShell component ──────────────────────────────────────────────
const PageShell = ({
  title,
  subtitle,
  children,
  className,
  compact = false,
}) => {
  // Extract sub-components from children
  let actionsNode = null;
  let statsNode = null;
  let bodyNode = null;
  let footerNode = null;
  let otherNodes = [];

  React.Children.forEach(children, (child) => {
    if (!child) return;
    if (child.type === Actions) actionsNode = child;
    else if (child.type === Stats) statsNode = child;
    else if (child.type === Body) bodyNode = child;
    else if (child.type === Footer) footerNode = child;
    else otherNodes.push(child);
  });

  return (
    <div className={`${styles.shell} ${compact ? styles.compact : ''} ${className || ''}`}>
      {/* ── Header: Title + Subtitle + Actions ──────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {actionsNode}
      </header>

      {/* ── Stats row ──────────────────────────────────────────────── */}
      {statsNode}

      {/* ── Body ────────────────────────────────────────────────────── */}
      {bodyNode}

      {/* ── Footer ──────────────────────────────────────────────────── */}
      {footerNode}

      {/* ── Any other children (custom content outside the shell) ──── */}
      {otherNodes}
    </div>
  );
};

// ── Attach sub-components ─────────────────────────────────────────────────
PageShell.Actions = Actions;
PageShell.Stats = Stats;
PageShell.Stat = Stat;
PageShell.Body = Body;
PageShell.Footer = Footer;

export default PageShell;
