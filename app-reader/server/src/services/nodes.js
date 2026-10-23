import crypto from 'node:crypto'
import path from 'node:path'
import { badRequest, notFound } from '../utils/errors.js'
import { cleanTags } from '../validation/schemas.js'
import {
  ensureDir,
  pathExists,
  writeFileAtomic,
} from '../utils/fsx.js'
import {
  allocateContentPath,
  bookDir,
  deleteContent,
  mutateIndex,
  pathForContent,
  readContent,
  readIndex,
  writeContent,
} from './bookStore.js'
import {
  assertValidParent,
  findChapter,
  getAncestors,
  getDescendantIds,
  labelFromText,
  nextOrder,
  nodeFallbackLabel,
  sortNodes,
} from './hierarchy.js'

const MAX_SL_NO = 100
const MAX_THEMES = 5000

function nodeFrontmatter(node) {
  return {
    id: node.id,
    slNo: node.slNo || '',
    type: node.type,
    parentId: node.parentId ?? null,
    importance: node.importance || 'medium',
    tags: node.tags ?? [],
    relatedNodeIds: node.relatedNodeIds ?? [],
    favorite: Boolean(node.favorite),
    currentTopic: Boolean(node.currentTopic),
    themes: node.themes || '',
    title: node.title || '',
    subtitles: Array.isArray(node.subtitles) ? node.subtitles : [],
    audioFile: node.audioFile || null,
    audioOriginalName: node.audioOriginalName || null,
    updatedAt: node.updatedAt,
  }
}

function cleanRelated(index, ids, selfId = null) {
  if (!Array.isArray(ids)) return []
  const known = new Set(index.nodes.map((node) => node.id))
  return [...new Set(ids)].filter((id) => known.has(id) && id !== selfId)
}

export async function listNodes(bookId) {
  const index = await readIndex(bookId)
  return { nodes: sortNodes(index.nodes) }
}

export async function getNode(bookId, nodeId) {
  const index = await readIndex(bookId)
  const node = index.nodes.find((item) => item.id === nodeId)
  if (!node) throw notFound('Node not found')

  const notes = await readContent(bookId, node.file).catch(() => '')
  const children = sortNodes(index.nodes.filter((item) => item.parentId === nodeId))
  const related = index.nodes.filter((item) => (node.relatedNodeIds || []).includes(item.id))

  const title = node.title || node.label || labelFromText(notes, nodeFallbackLabel(node))

  return {
    node: {
      ...node,
      title,
      subtitles: Array.isArray(node.subtitles) ? node.subtitles : [],
    },
    text: notes,
    notes,
    children,
    related,
    ancestors: getAncestors(index.nodes, nodeId).reverse(),
    chapter: findChapter(index.nodes, nodeId),
  }
}

export async function createNode(bookId, input) {
  const created = await mutateIndex(bookId, async (index) => {
    if (input.parentId) assertValidParent(index.nodes, input.parentId, null)
    const file = await allocateContentPath(bookId, 'nodes', 'node')
    const now = new Date().toISOString()
    const notes = input.notes !== undefined ? input.notes : input.text ?? ''
    const title = input.title !== undefined ? String(input.title).trim() : labelFromText(notes, '')
    const subtitles = Array.isArray(input.subtitles)
      ? input.subtitles.map((s) => String(s).trim()).filter(Boolean)
      : []

    const displayLabel = title || labelFromText(notes, nodeFallbackLabel({ type: input.type, slNo: input.slNo }))

    const node = {
      id: `node_${crypto.randomUUID()}`,
      slNo: String(input.slNo || '').trim().slice(0, MAX_SL_NO),
      type: input.type,
      parentId: input.parentId || null,
      order: nextOrder(index.nodes, input.parentId || null),
      file,
      importance: input.importance || 'medium',
      tags: cleanTags(input.tags),
      relatedNodeIds: cleanRelated(index, input.relatedNodeIds),
      favorite: Boolean(input.favorite),
      currentTopic: Boolean(input.currentTopic),
      themes: String(input.themes || '').slice(0, MAX_THEMES),
      title: title || displayLabel,
      subtitles,
      audioFile: input.audioFile || null,
      audioOriginalName: input.audioOriginalName || null,
      label: displayLabel,
      createdAt: now,
      updatedAt: now,
    }
    index.nodes.push(node)
    await writeContent(bookId, file, nodeFrontmatter(node), notes)
    return { ...node, notes, text: notes }
  })

  return created
}

export async function updateNode(bookId, nodeId, input) {
  const result = await mutateIndex(bookId, async (index) => {
    const node = index.nodes.find((item) => item.id === nodeId)
    if (!node) throw notFound('Node not found')

    if (Object.prototype.hasOwnProperty.call(input, 'parentId')) {
      const parentId = input.parentId || null
      assertValidParent(index.nodes, parentId, nodeId)
      if ((node.parentId ?? null) !== (parentId ?? null)) {
        node.parentId = parentId
        if (input.order === undefined) node.order = nextOrder(index.nodes, parentId)
      }
    }

    if (input.type !== undefined) node.type = input.type
    if (input.slNo !== undefined) node.slNo = String(input.slNo).trim().slice(0, MAX_SL_NO)
    if (input.importance !== undefined) node.importance = input.importance || 'medium'
    if (input.tags !== undefined) node.tags = cleanTags(input.tags)
    if (input.relatedNodeIds !== undefined) {
      node.relatedNodeIds = cleanRelated(index, input.relatedNodeIds, nodeId)
    }
    if (input.favorite !== undefined) node.favorite = Boolean(input.favorite)
    if (input.currentTopic !== undefined) node.currentTopic = Boolean(input.currentTopic)
    if (input.themes !== undefined) node.themes = String(input.themes).slice(0, MAX_THEMES)
    if (input.audioFile !== undefined) node.audioFile = input.audioFile || null
    if (input.audioOriginalName !== undefined) node.audioOriginalName = input.audioOriginalName || null
    if (input.title !== undefined) {
      node.title = String(input.title).trim()
      node.label = node.title || nodeFallbackLabel(node)
    }
    if (input.subtitles !== undefined) {
      node.subtitles = Array.isArray(input.subtitles)
        ? input.subtitles.map((s) => String(s).trim()).filter(Boolean)
        : []
    }
    if (input.order !== undefined) node.order = input.order

    let notes = await readContent(bookId, node.file).catch(() => '')
    if (input.notes !== undefined) {
      notes = String(input.notes)
    } else if (input.text !== undefined) {
      notes = String(input.text)
    }

    if (!node.title) {
      node.label = labelFromText(notes, nodeFallbackLabel(node))
      node.title = node.label
    }

    await writeContent(bookId, node.file, nodeFrontmatter(node), notes)

    node.updatedAt = new Date().toISOString()
    return { ...node, notes, text: notes }
  })
  return result
}

export async function deleteNode(bookId, nodeId) {
  const result = await mutateIndex(bookId, async (index) => {
    const node = index.nodes.find((item) => item.id === nodeId)
    if (!node) throw notFound('Node not found')
    const ids = new Set([nodeId, ...getDescendantIds(index.nodes, nodeId)])
    const doomed = index.nodes.filter((item) => ids.has(item.id))

    for (const item of doomed) {
      await deleteContent(bookId, item.file)
      if (item.audioFile) {
        await deleteContent(bookId, item.audioFile).catch(() => {})
      }
    }
    const now = new Date().toISOString()

    // Drop dangling related-node links from surviving records and keep their
    // Markdown frontmatter in sync with the index.
    for (const item of index.nodes) {
      if (ids.has(item.id)) continue
      const next = (item.relatedNodeIds || []).filter((id) => !ids.has(id))
      if (next.length === (item.relatedNodeIds || []).length) continue
      item.relatedNodeIds = next
      item.updatedAt = now
      const content = await readContent(bookId, item.file).catch(() => '')
      await writeContent(bookId, item.file, nodeFrontmatter(item), content)
    }
    index.nodes = index.nodes.filter((item) => !ids.has(item.id))

    return { deletedNodeIds: [...ids] }
  })
  return result
}

export async function reorderNode(bookId, nodeId, direction) {
  const index = await mutateIndex(bookId, async (working) => {
    const node = working.nodes.find((item) => item.id === nodeId)
    if (!node) throw notFound('Node not found')
    const siblings = sortNodes(working.nodes.filter((item) => (item.parentId ?? null) === (node.parentId ?? null)))
    const position = siblings.findIndex((item) => item.id === nodeId)
    const target = direction === 'up' ? position - 1 : position + 1
    if (target < 0 || target >= siblings.length) return working
    const a = siblings[position]
    const b = siblings[target]
    const temp = a.order
    a.order = b.order
    b.order = temp
    return working
  })
  return index.nodes.find((item) => item.id === nodeId)
}

const ALLOWED_AUDIO_EXTS = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'webm', 'flac']

export async function attachNodeAudio(bookId, nodeId, originalName, buffer) {
  const ext = path.extname(originalName || '').toLowerCase().replace(/^\./, '')
  if (!ALLOWED_AUDIO_EXTS.includes(ext)) {
    throw badRequest(`Unsupported audio format (.${ext || 'unknown'}). Allowed: ${ALLOWED_AUDIO_EXTS.join(', ')}`)
  }
  if (!buffer || buffer.length === 0) {
    throw badRequest('Audio file data is empty')
  }

  const uniqueName = `audio_${crypto.randomUUID()}.${ext}`
  const relativeAudioPath = `media/${uniqueName}`
  const targetDir = path.join(bookDir(bookId), 'media')
  await ensureDir(targetDir)
  await writeFileAtomic(path.join(targetDir, uniqueName), buffer)

  const updatedNode = await mutateIndex(bookId, async (index) => {
    const node = index.nodes.find((item) => item.id === nodeId)
    if (!node) throw notFound('Node not found')

    if (node.audioFile && node.audioFile !== relativeAudioPath) {
      await deleteContent(bookId, node.audioFile).catch(() => {})
    }

    node.audioFile = relativeAudioPath
    node.audioOriginalName = path.basename(originalName || `audio.${ext}`).slice(0, 200)
    node.updatedAt = new Date().toISOString()

    const text = await readContent(bookId, node.file).catch(() => '')
    await writeContent(bookId, node.file, nodeFrontmatter(node), text)
    return node
  })

  return updatedNode
}

export async function removeNodeAudio(bookId, nodeId) {
  const updatedNode = await mutateIndex(bookId, async (index) => {
    const node = index.nodes.find((item) => item.id === nodeId)
    if (!node) throw notFound('Node not found')

    if (node.audioFile) {
      await deleteContent(bookId, node.audioFile).catch(() => {})
    }

    node.audioFile = null
    node.audioOriginalName = null
    node.updatedAt = new Date().toISOString()

    const text = await readContent(bookId, node.file).catch(() => '')
    await writeContent(bookId, node.file, nodeFrontmatter(node), text)
    return node
  })

  return updatedNode
}

export async function getNodeAudioFile(bookId, nodeId) {
  const index = await readIndex(bookId)
  const node = index.nodes.find((item) => item.id === nodeId)
  if (!node) throw notFound('Node not found')
  if (!node.audioFile) throw notFound('No audio attached to this node')

  const filePath = await pathForContent(bookId, node.audioFile)
  if (!(await pathExists(filePath))) throw notFound('Audio file missing on disk')

  return { filePath, originalName: node.audioOriginalName || path.basename(node.audioFile) }
}
