import { useCallback, useState } from 'react'
import { IconChevronRight, IconCheckboxCheck, IconCheckboxIndeterminate } from '@/icons'

/* ─── Compute parent state from descendants ─── */
function computeParentState(children, checkedSet) {
  let allChecked = true
  let someChecked = false

  const walk = (nodes) => {
    for (const node of nodes) {
      if (checkedSet.has(node.id)) {
        someChecked = true
      } else {
        allChecked = false
      }
      if (node.children?.length) walk(node.children)
    }
  }
  walk(children)

  if (allChecked) return 'checked'
  if (someChecked) return 'indeterminate'
  return 'unchecked'
}

/* ─── Collect all descendant IDs ─── */
function collectDescendantIds(nodes) {
  const ids = []
  const walk = (list) => {
    for (const n of list) {
      ids.push(n.id)
      if (n.children?.length) walk(n.children)
    }
  }
  walk(nodes)
  return ids
}

/* ─── Recursive Tree Node ─── */
function TreeNode({
  node,
  checkedSet,
  expandedSet,
  onToggleCheck,
  onToggleExpand,
  level,
}) {
  const hasChildren = node.children?.length > 0
  const isExpanded = expandedSet.has(node.id)
  const parentState = hasChildren
    ? computeParentState(node.children, checkedSet)
    : null

  const isChecked = checkedSet.has(node.id)
  const isIndeterminate = parentState === 'indeterminate'

  return (
    <li className="tree-view__node">
      <div
        className="tree-view__row"
        style={{ paddingLeft: `${12 + level * 20}px` }}
      >
        {/* Expand/collapse toggle */}
        <button
          type="button"
          className={`tree-view__toggle${hasChildren ? '' : ' tree-view__toggle--spacer'}`}
          onClick={() => hasChildren && onToggleExpand(node.id)}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && hasChildren) {
              e.preventDefault()
              onToggleExpand(node.id)
            }
          }}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
          tabIndex={0}
        >
          {hasChildren && (
            <IconChevronRight
              size={14}
              className={`tree-view__chevron${isExpanded ? ' tree-view__chevron--open' : ''}`}
            />
          )}
        </button>

        {/* Checkbox */}
        <span
          className="tree-view__checkbox"
          onClick={() => onToggleCheck(node)}
          role="checkbox"
          aria-checked={isChecked || (isIndeterminate ? 'mixed' : false)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onToggleCheck(node)
            }
          }}
        >
          <span className="tree-view__check-visual">
            {isChecked ? (
              <IconCheckboxCheck size={10} />
            ) : isIndeterminate ? (
              <IconCheckboxIndeterminate size={10} />
            ) : null}
          </span>
        </span>

        {/* Label */}
        <span
          className="tree-view__label"
          onClick={() => onToggleCheck(node)}
        >
          {node.label}
        </span>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <ul className="tree-view__children">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              checkedSet={checkedSet}
              expandedSet={expandedSet}
              onToggleCheck={onToggleCheck}
              onToggleExpand={onToggleExpand}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

/* ─── Top-level TreeView ─── */
export default function TreeView({
  data = [],
  checked,
  onCheckedChange,
  expanded,
  onExpandedChange,
  label,
  className = '',
}) {
  const [localExpanded, setLocalExpanded] = useState(() => {
    // Expand all by default on first render
    const ids = new Set()
    const walk = (nodes) => {
      for (const n of nodes) {
        ids.add(n.id)
        if (n.children?.length) walk(n.children)
      }
    }
    walk(data)
    return ids
  })

  const checkedSet = new Set(checked || [])
  const expandedSet = expanded
    ? new Set(expanded)
    : localExpanded

  const handleToggleCheck = useCallback(
    (node) => {
      const ids = [node.id, ...collectDescendantIds(node.children || [])]
      const allChecked = ids.every((id) => checkedSet.has(id))
      const next = new Set(checkedSet)
      if (allChecked) {
        ids.forEach((id) => next.delete(id))
      } else {
        ids.forEach((id) => next.add(id))
      }
      onCheckedChange?.(Array.from(next))
    },
    [checkedSet, onCheckedChange]
  )

  const handleToggleExpand = useCallback(
    (id) => {
      if (onExpandedChange) {
        const next = new Set(expandedSet)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        onExpandedChange(Array.from(next))
      } else {
        setLocalExpanded((prev) => {
          const next = new Set(prev)
          if (next.has(id)) next.delete(id)
          else next.add(id)
          return next
        })
      }
    },
    [expandedSet, onExpandedChange]
  )

  if (!data.length) return null

  return (
    <div className={`tree-view${className ? ' ' + className : ''}`}>
      {label && <span className="tree-view__label-heading">{label}</span>}
      <ul className="tree-view__list">
        {data.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            checkedSet={checkedSet}
            expandedSet={expandedSet}
            onToggleCheck={handleToggleCheck}
            onToggleExpand={handleToggleExpand}
            level={0}
          />
        ))}
      </ul>
    </div>
  )
}
