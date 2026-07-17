import React from 'react';
import './PageShell.css';

// ── Sub-component helpers ─────────────────────────────────────────────────
const Actions = ({ children }) => (
  <div className="card-actions">{children}</div>
);

const Stats = ({ children }) => (
  <div className="card-stats">{children}</div>
);

const STAT_VARIANTS = ['warning', 'success', 'danger', 'accent'];

const Stat = ({ label, value, variant, className }) => {
  const variantClass = variant && STAT_VARIANTS.includes(variant)
    ? `card-stat-${variant}`
    : '';
  return (
    <div className={`card-stat ${variantClass} ${className || ''}`}>
      <span className="card-stat-value">{value}</span>
      <span className="card-stat-label">{label}</span>
    </div>
  );
};

const Body = ({ children, className }) => (
  <div className={`card-body ${className || ''}`}>{children}</div>
);

const Footer = ({ children }) => (
  <div className="card-footer">{children}</div>
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
    <div className={`card ${compact ? 'card-compact' : ''} ${className || ''}`}>
      {/* ── Header: Title + Subtitle + Actions ──────────────────────── */}
      <header className="card-header">
        <div className="card-header-info">
          <h1 className="card-title">{title}</h1>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
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
