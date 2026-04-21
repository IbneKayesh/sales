import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * SQL Server ERD-style connection layer with:
 * - Unique color per connection for easy identification
 * - Y-offset staggering to avoid overlapping parallel lines
 * - Hover highlighting to isolate individual connections
 * - Orthogonal (right-angle) routing with rounded elbows
 */

// Distinct color palette for connections - easily distinguishable
const CONNECTION_COLORS = [
  '#6366f1', // indigo
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#f97316', // orange
  '#ec4899', // pink
  '#14b8a6', // teal
  '#84cc16', // lime
  '#a855f7', // purple
  '#0ea5e9', // sky
  '#e11d48', // rose
  '#22c55e', // green
  '#eab308', // yellow
];

export const ConnectionLayer = ({ filteredTables, activeSqlTableId }) => {
  const svgRef = useRef(null);
  const [connections, setConnections] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  const updateConnections = useCallback(() => {
    const grid = svgRef.current?.parentElement;
    if (!grid) return;

    const gridRect = grid.getBoundingClientRect();
    const rawConnections = [];

    filteredTables.forEach(table => {
      if (activeSqlTableId === table.table_id) return;

      table.columns.forEach(col => {
        if (!col.references) return;

        const sourceId = `col-${table.table_name}-${col.name}`;
        const targetId = `col-${col.references.table}-${col.references.column}`;

        const sourceEl = document.getElementById(sourceId);
        const targetEl = document.getElementById(targetId);

        if (!sourceEl || !targetEl) return;

        const sRect = sourceEl.getBoundingClientRect();
        const tRect = targetEl.getBoundingClientRect();

        const sCenterX = sRect.left + sRect.width / 2;
        const tCenterX = tRect.left + tRect.width / 2;
        const sCenterY = sRect.top + sRect.height / 2;
        const tCenterY = tRect.top + tRect.height / 2;

        let sx, sy, tx, ty, sDir, tDir;

        if (sCenterX < tCenterX) {
          sx = sRect.right - gridRect.left;
          sy = sCenterY - gridRect.top;
          tx = tRect.left - gridRect.left;
          ty = tCenterY - gridRect.top;
          sDir = 'right';
          tDir = 'left';
        } else {
          sx = sRect.left - gridRect.left;
          sy = sCenterY - gridRect.top;
          tx = tRect.right - gridRect.left;
          ty = tCenterY - gridRect.top;
          sDir = 'left';
          tDir = 'right';
        }

        rawConnections.push({
          id: `${sourceId}--${targetId}`,
          sx, sy, tx, ty,
          sDir, tDir,
          sourceTable: table.table_name,
          sourceCol: col.name,
          targetTable: col.references.table,
          targetCol: col.references.column
        });
      });
    });

    // Assign colors and compute staggered offsets to avoid overlap
    const staggered = applyStaggerOffsets(rawConnections);

    // Build final paths with offsets applied
    const finalConnections = staggered.map((conn, idx) => ({
      ...conn,
      color: CONNECTION_COLORS[idx % CONNECTION_COLORS.length],
      path: buildOrthogonalPath(
        conn.sx, conn.sy + (conn.sourceYOffset || 0),
        conn.tx, conn.ty + (conn.targetYOffset || 0),
        conn.sDir, conn.tDir,
        conn.midXOffset || 0
      ),
      // Keep un-offset positions for endpoint circles
      dotSx: conn.sx,
      dotSy: conn.sy,
      dotTx: conn.tx,
      dotTy: conn.ty
    }));

    setConnections(finalConnections);
  }, [filteredTables, activeSqlTableId]);

  useEffect(() => {
    const timeoutId = setTimeout(updateConnections, 150);

    const grid = svgRef.current?.parentElement;
    let resizeObserver;
    if (grid) {
      resizeObserver = new ResizeObserver(updateConnections);
      resizeObserver.observe(grid);
    }

    const scrollContainer = grid?.closest('.table-zone');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateConnections);
    }

    window.addEventListener('resize', updateConnections);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateConnections);
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', updateConnections);
      }
    };
  }, [updateConnections]);

  const hasHover = hoveredId !== null;

  return (
    <svg
      ref={svgRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
        overflow: 'visible'
      }}
      aria-hidden="true"
    >
      <defs>
        {/* Generate unique markers per connection color */}
        {connections.map(c => (
          <React.Fragment key={`markers-${c.id}`}>
            <marker
              id={`crowsfoot-${c.id}`}
              markerWidth="16"
              markerHeight="14"
              refX="14"
              refY="7"
              orient="auto"
              markerUnits="userSpaceOnUse"
            >
              <line x1="14" y1="7" x2="2" y2="1" stroke={c.color} strokeWidth="1.5" />
              <line x1="14" y1="7" x2="2" y2="7" stroke={c.color} strokeWidth="1.5" />
              <line x1="14" y1="7" x2="2" y2="13" stroke={c.color} strokeWidth="1.5" />
            </marker>
            <marker
              id={`onebar-${c.id}`}
              markerWidth="14"
              markerHeight="14"
              refX="2"
              refY="7"
              orient="auto"
              markerUnits="userSpaceOnUse"
            >
              <line x1="4" y1="2" x2="4" y2="12" stroke={c.color} strokeWidth="1.5" />
              <line x1="8" y1="2" x2="8" y2="12" stroke={c.color} strokeWidth="1.5" />
            </marker>
          </React.Fragment>
        ))}
      </defs>

      {/* Render connections - dimmed ones first, hovered on top */}
      {connections
        .sort((a, b) => {
          if (!hasHover) return 0;
          if (a.id === hoveredId) return 1;
          if (b.id === hoveredId) return -1;
          return 0;
        })
        .map(c => {
          const isHovered = c.id === hoveredId;
          const opacity = hasHover ? (isHovered ? 1 : 0.1) : 0.75;
          const strokeWidth = isHovered ? 2.5 : 1.5;

          return (
            <g key={c.id}>
              {/* Invisible thick hitbox for hover detection */}
              <path
                d={c.path}
                fill="none"
                stroke="transparent"
                strokeWidth="16"
                style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
                onMouseEnter={() => setHoveredId(c.id)}
                onMouseLeave={() => setHoveredId(null)}
              />
              {/* Background halo for contrast */}
              <path
                d={c.path}
                fill="none"
                stroke="var(--card-bg)"
                strokeWidth={strokeWidth + 3}
                strokeOpacity={isHovered ? 0.9 : 0.5}
              />
              {/* Main colored line */}
              <path
                d={c.path}
                fill="none"
                stroke={c.color}
                strokeWidth={strokeWidth}
                strokeOpacity={opacity}
                markerStart={`url(#onebar-${c.id})`}
                markerEnd={`url(#crowsfoot-${c.id})`}
              />
              {/* FK dot (source) */}
              <circle
                cx={c.dotSx}
                cy={c.dotSy}
                r={isHovered ? 4 : 3}
                fill={c.color}
                opacity={opacity}
              />
              {/* PK dot (target) */}
              <circle
                cx={c.dotTx}
                cy={c.dotTy}
                r={isHovered ? 4 : 3}
                fill={c.color}
                opacity={opacity}
              />

              {/* Tooltip label on hover */}
              {isHovered && (
                <g>
                  {/* Label background */}
                  <rect
                    x={(c.dotSx + c.dotTx) / 2 - 80}
                    y={Math.min(c.dotSy, c.dotTy) - 28}
                    width="160"
                    height="22"
                    rx="4"
                    fill="var(--card-bg)"
                    stroke={c.color}
                    strokeWidth="1"
                    opacity="0.95"
                  />
                  {/* Label text */}
                  <text
                    x={(c.dotSx + c.dotTx) / 2}
                    y={Math.min(c.dotSy, c.dotTy) - 14}
                    textAnchor="middle"
                    fill={c.color}
                    fontSize="11"
                    fontFamily="var(--mono)"
                    fontWeight="600"
                    style={{ pointerEvents: 'none' }}
                  >
                    {c.sourceTable}.{c.sourceCol} → {c.targetTable}.{c.targetCol}
                  </text>
                </g>
              )}
            </g>
          );
        })}
    </svg>
  );
};

/**
 * Analyze connections and apply stagger offsets so lines sharing
 * the same vertical corridor (midX) don't overlap.
 */
function applyStaggerOffsets(connections) {
  // Group connections that share similar source/target table edges
  // (i.e., lines that would share the same midX vertical segment)
  const SPACING = 8; // px between parallel lines

  // Group by the source-target table pair direction
  const edgeGroups = {};
  connections.forEach(conn => {
    // Round to nearest 50px to group lines in the same corridor
    const midX = Math.round(((conn.sx + conn.tx) / 2) / 50) * 50;
    const key = `${conn.sDir}-${midX}`;
    if (!edgeGroups[key]) edgeGroups[key] = [];
    edgeGroups[key].push(conn);
  });

  // Apply offsets within each group
  Object.values(edgeGroups).forEach(group => {
    if (group.length <= 1) return;

    // Sort by Y position for consistent ordering
    group.sort((a, b) => a.sy - b.sy);

    const mid = (group.length - 1) / 2;
    group.forEach((conn, i) => {
      conn.midXOffset = (i - mid) * SPACING;
    });
  });

  // Also stagger lines sharing the same source or target endpoint
  const endpointGroups = {};
  connections.forEach(conn => {
    // Group by source element
    const sKey = `s-${Math.round(conn.sx)}-${Math.round(conn.sy / 10) * 10}`;
    if (!endpointGroups[sKey]) endpointGroups[sKey] = [];
    endpointGroups[sKey].push({ conn, type: 'source' });

    // Group by target element
    const tKey = `t-${Math.round(conn.tx)}-${Math.round(conn.ty / 10) * 10}`;
    if (!endpointGroups[tKey]) endpointGroups[tKey] = [];
    endpointGroups[tKey].push({ conn, type: 'target' });
  });

  Object.values(endpointGroups).forEach(group => {
    if (group.length <= 1) return;

    const mid = (group.length - 1) / 2;
    group.forEach((item, i) => {
      const offset = (i - mid) * (SPACING * 0.6);
      if (item.type === 'source') {
        item.conn.sourceYOffset = (item.conn.sourceYOffset || 0) + offset;
      } else {
        item.conn.targetYOffset = (item.conn.targetYOffset || 0) + offset;
      }
    });
  });

  return connections;
}

/**
 * Build an orthogonal (right-angle) path from (sx,sy) to (tx,ty).
 * midXOffset shifts the vertical corridor left/right to prevent overlap.
 */
function buildOrthogonalPath(sx, sy, tx, ty, sDir, tDir, midXOffset = 0) {
  const STUB = 30;
  const points = [];

  points.push({ x: sx, y: sy });

  const sStubX = sDir === 'right' ? sx + STUB : sx - STUB;
  points.push({ x: sStubX, y: sy });

  const tStubX = tDir === 'right' ? tx + STUB : tx - STUB;

  if (sDir === 'right' && tDir === 'left') {
    const midX = (sStubX + tStubX) / 2 + midXOffset;
    if (sStubX < tStubX) {
      points.push({ x: midX, y: sy });
      points.push({ x: midX, y: ty });
    } else {
      const detourY = sy < ty
        ? Math.max(sy, ty) + 40
        : Math.min(sy, ty) - 40;
      points.push({ x: sStubX + midXOffset, y: detourY });
      points.push({ x: tStubX + midXOffset, y: detourY });
    }
  } else if (sDir === 'left' && tDir === 'right') {
    const midX = (sStubX + tStubX) / 2 + midXOffset;
    if (sStubX > tStubX) {
      points.push({ x: midX, y: sy });
      points.push({ x: midX, y: ty });
    } else {
      const detourY = sy < ty
        ? Math.max(sy, ty) + 40
        : Math.min(sy, ty) - 40;
      points.push({ x: sStubX + midXOffset, y: detourY });
      points.push({ x: tStubX + midXOffset, y: detourY });
    }
  } else {
    const extension = sDir === 'right'
      ? Math.max(sStubX, tStubX) + 30 + midXOffset
      : Math.min(sStubX, tStubX) - 30 + midXOffset;
    points.push({ x: extension, y: sy });
    points.push({ x: extension, y: ty });
  }

  points.push({ x: tStubX, y: ty });
  points.push({ x: tx, y: ty });

  return buildRoundedPath(points, 8);
}

/**
 * Converts points into an SVG path with rounded corners at elbows.
 */
function buildRoundedPath(points, radius) {
  if (points.length < 2) return '';
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    const dx1 = curr.x - prev.x;
    const dy1 = curr.y - prev.y;
    const dx2 = next.x - curr.x;
    const dy2 = next.y - curr.y;

    const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

    const r = Math.min(radius, len1 / 2, len2 / 2);

    if (r <= 0 || len1 === 0 || len2 === 0) {
      d += ` L ${curr.x} ${curr.y}`;
      continue;
    }

    const startX = curr.x - (dx1 / len1) * r;
    const startY = curr.y - (dy1 / len1) * r;
    const endX = curr.x + (dx2 / len2) * r;
    const endY = curr.y + (dy2 / len2) * r;

    const cross = dx1 * dy2 - dy1 * dx2;
    const sweep = cross > 0 ? 1 : 0;

    d += ` L ${startX} ${startY}`;
    d += ` A ${r} ${r} 0 0 ${sweep} ${endX} ${endY}`;
  }

  const last = points[points.length - 1];
  d += ` L ${last.x} ${last.y}`;

  return d;
}
