import { badRequest, notFound } from '../utils/errors.js'
import { NODE_TYPES } from '../validation/schemas.js'

/** Types that behave like containers of other nodes. */
const CONTAINER_TYPES = new Set(['story', 'chapter'])

export function isContainerType(type) {
  return CONTAINER_TYPES.has(type)
}

export function sortNodes(nodes) {
  return [...nodes].sort((a, b) => {
    if (a.order !== b.order) return (a.order || 0) - (b.order || 0)
    return String(a.createdAt).localeCompare(String(b.createdAt))
  })
}

export function buildTree(nodes) {
  const byParent = new Map()
  const ids = new Set(nodes.map((node) => node.id))
  for (const node of sortNodes(nodes)) {
    const parentKey = node.parentId && ids.has(node.parentId) ? node.parentId : null
    if (!byParent.has(parentKey)) byParent.set(parentKey, [])
    byParent.get(parentKey).push(node)
  }

  const build = (parentId, depth) =>
    (byParent.get(parentId) || []).map((node) => ({
      ...node,
      depth,
      children: build(node.id, depth + 1),
    }))
  return build(null, 0)
}

export function getDescendantIds(nodes, nodeId) {
  const out = []
  const queue = [nodeId]
  while (queue.length) {
    const current = queue.shift()
    for (const node of nodes) {
      if (node.parentId === current && !out.includes(node.id)) {
        out.push(node.id)
        queue.push(node.id)
      }
    }
  }
  return out
}

/** Re-parenting must never make a node a descendant of itself. */
export function wouldCreateCycle(nodes, nodeId, parentId) {
  if (!parentId) return false
  if (parentId === nodeId) return true
  return getDescendantIds(nodes, nodeId).includes(parentId)
}

export function assertValidParent(nodes, parentId, nodeId) {
  if (!parentId) return null
  const parent = nodes.find((node) => node.id === parentId)
  if (!parent) throw badRequest('Parent node does not exist')
  if (nodeId && wouldCreateCycle(nodes, nodeId, parentId)) {
    throw badRequest('A node cannot be moved inside itself or one of its children')
  }
  return parent
}

/** Ancestor chain from immediate parent up to the root, closest first. */
export function getAncestors(nodes, nodeId) {
  const byId = new Map(nodes.map((node) => [node.id, node]))
  const out = []
  let current = byId.get(nodeId)
  const guard = new Set()
  while (current?.parentId && !guard.has(current.parentId)) {
    guard.add(current.parentId)
    const parent = byId.get(current.parentId)
    if (!parent) break
    out.push(parent)
    current = parent
  }
  return out
}

export function findChapter(nodes, nodeId) {
  const byId = new Map(nodes.map((node) => [node.id, node]))
  let current = byId.get(nodeId)
  const guard = new Set()
  while (current) {
    if (isContainerType(current.type)) return current
    if (!current.parentId || guard.has(current.parentId)) return null
    guard.add(current.parentId)
    current = byId.get(current.parentId)
  }
  return null
}

export function nextOrder(nodes, parentId = null) {
  const siblings = nodes.filter((node) => (node.parentId ?? null) === (parentId ?? null))
  if (!siblings.length) return 0
  return Math.max(...siblings.map((node) => node.order || 0)) + 1
}

export function reorderNode(nodes, nodeId, direction) {
  const node = nodes.find((item) => item.id === nodeId)
  if (!node) throw notFound('Node not found')
  const siblings = sortNodes(nodes.filter((item) => (item.parentId ?? null) === (node.parentId ?? null)))
  const index = siblings.findIndex((item) => item.id === nodeId)
  const swapWith = direction === 'up' ? index - 1 : index + 1
  if (swapWith < 0 || swapWith >= siblings.length) return false
  const a = siblings[index]
  const b = siblings[swapWith]
  const tmp = a.order
  a.order = b.order
  b.order = tmp
  return true
}

/**
 * The tree has no separate title field, so the display label is the first
 * non-empty line of the node's text (falling back to type + serial).
 */
export function labelFromText(text, fallback = '') {
  const line = String(text || '')
    .split('\n')
    .map((item) => item.trim())
    .find(Boolean)
  if (!line) return fallback
  return line.replace(/^#{1,6}\s+/, '').slice(0, 80)
}

export function nodeFallbackLabel(node) {
  const type = NODE_TYPES.includes(node.type) ? node.type : 'node'
  return node.slNo ? `${type} ${node.slNo}` : type
}

/** Dashboard statistics: counts per type plus a tag tally. */
export function summarizeCounts(index) {
  const byType = Object.fromEntries(NODE_TYPES.map((type) => [type, 0]))
  const tagCounts = new Map()
  let favorites = 0
  let currentTopics = 0
  let important = 0

  for (const node of index.nodes) {
    if (byType[node.type] !== undefined) byType[node.type] += 1
    else byType[node.type] = 1
    for (const tag of node.tags || []) tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    if (node.favorite) favorites += 1
    if (node.currentTopic) currentTopics += 1
    if (node.importance === 'high') important += 1
  }

  const tags = [...tagCounts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))

  return {
    total: index.nodes.length,
    byType,
    chapters: byType.chapter || 0,
    story: byType.story || 0,
    passage: byType.passage || 0,
    concept: byType.concept || 0,
    favorites,
    currentTopics,
    important,
    tags,
  }
}
