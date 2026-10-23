export function sortNodes(nodes = []) {
  return [...nodes].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0) || String(a.createdAt).localeCompare(String(b.createdAt)),
  )
}

export function flattenNodes(nodes = []) {
  const byParent = new Map()
  for (const node of sortNodes(nodes)) {
    const key = node.parentId || 'root'
    if (!byParent.has(key)) byParent.set(key, [])
    byParent.get(key).push(node)
  }
  const out = []
  const walk = (parentKey, depth) => {
    for (const node of byParent.get(parentKey) || []) {
      out.push({ ...node, depth })
      walk(node.id, depth + 1)
    }
  }
  walk('root', 0)
  const seen = new Set(out.map((node) => node.id))
  for (const node of nodes) if (!seen.has(node.id)) out.push({ ...node, depth: 0 })
  return out
}

export function descendantIds(nodes = [], nodeId) {
  const out = new Set()
  const queue = [nodeId]
  while (queue.length) {
    const current = queue.shift()
    for (const node of nodes) {
      if (node.parentId === current && !out.has(node.id)) {
        out.add(node.id)
        queue.push(node.id)
      }
    }
  }
  return out
}

export function nodeLabel(node) {
  if (!node) return ''
  return node.title || node.label || node.type || 'node'
}

export function nodeDisplay(node) {
  if (!node) return ''
  const label = nodeLabel(node)
  return node.slNo ? `${node.slNo}. ${label}` : label
}

export function findNode(nodes = [], nodeId) {
  return nodes.find((node) => node.id === nodeId) || null
}
