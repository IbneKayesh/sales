import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { BOOKS_DIR, LEGACY_CONTENT_DIRS, SCHEMA_VERSION } from '../config.js'
import { NODE_TYPES } from '../validation/schemas.js'
import {
  ensureDir,
  listDirectories,
  nextFileName,
  pathExists,
  readJson,
  withLock,
  writeFileAtomic,
  writeJsonAtomic,
} from '../utils/fsx.js'
import { bookDir } from './bookStore.js'
import { labelFromText } from './hierarchy.js'

const VALID_TYPES = new Set(NODE_TYPES)
const TYPE_MAP = { paragraph: 'line' }

function mapType(type) {
  const raw = String(type || '').toLowerCase()
  const mapped = TYPE_MAP[raw] || raw
  return VALID_TYPES.has(mapped) ? mapped : 'concept'
}

function mapImportance(value) {
  return value === 'high' || value === 'low' ? value : 'medium'
}

function withTitle(body, title) {
  const text = String(body || '').replace(/^\n+/, '')
  const clean = String(title || '').trim()
  if (!clean) return text
  if (text.includes(clean)) return text
  return `# ${clean}\n\n${text}`
}

async function readBody(dir, relativePath) {
  if (!relativePath) return ''
  try {
    return matter(await fs.readFile(path.join(dir, relativePath), 'utf8')).content.replace(/^\n+/, '')
  } catch {
    return ''
  }
}

function frontmatterOf(node) {
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
    updatedAt: node.updatedAt,
  }
}

/**
 * Convert a book folder written by schema v1 (separate notes/sources/themes/thesis
 * records) to schema v2, where every record is one node in a single hierarchy.
 *
 * - node files move into `nodes/`, keeping their basename
 * - notes become child nodes of type `note`
 * - sources and theme groups become `concept` nodes (tagged `source` / `theme`)
 * - thesis material becomes `note` nodes tagged `thesis`
 * - ids are preserved so every relationship keeps pointing at the right record
 * - page references are kept as pageStart/pageEnd (read-only legacy fields)
 * - sl_no is seeded with sequential numbers the user can renumber
 *
 * Works on any absolute book directory (including an import staging folder).
 */
export async function migrateBookDir(dir) {
  const index = await readJson(path.join(dir, 'index.json'))
  if (!index || typeof index !== 'object') return { migrated: false, reason: 'no-index' }
  if (Number(index.schemaVersion) >= SCHEMA_VERSION) return { migrated: false, reason: 'current' }

  const backup = path.join(dir, 'index.v1.bak.json')
  if (!(await pathExists(backup))) await writeFileAtomic(backup, `${JSON.stringify(index, null, 2)}\n`)

  await ensureDir(path.join(dir, 'nodes'))
  const oldNodes = Array.isArray(index.nodes) ? index.nodes : []
  const oldNotes = Array.isArray(index.notes) ? index.notes : []
  const oldSources = Array.isArray(index.sources) ? index.sources : []
  const oldThemes = Array.isArray(index.themes) ? index.themes : []
  const oldThesis = index.thesis || {}

  const knownIds = new Set([
    ...oldNodes.map((item) => item.id),
    ...oldNotes.map((item) => item.id),
    ...oldSources.map((item) => item.id),
    ...oldThemes.map((item) => item.id),
    ...(Array.isArray(oldThesis.claims) ? oldThesis.claims : []).map((item) => item.id),
  ])
  const pick = (ids) => [...new Set(Array.isArray(ids) ? ids : [])].filter((id) => knownIds.has(id))

  const now = new Date().toISOString()
  const nodes = []
  const takenNames = new Set()
  const movedFiles = []

  const uniqueName = (relativePath) => {
    const basename = path.posix.basename(String(relativePath || ''))
    if (!basename) return null
    if (!takenNames.has(basename)) {
      takenNames.add(basename)
      return `nodes/${basename}`
    }
    const [stem, ...rest] = basename.split('.')
    const ext = rest.length ? `.${rest.join('.')}` : ''
    for (let i = 2; i < 500; i += 1) {
      const candidate = `${stem}-${i}${ext}`
      if (!takenNames.has(candidate)) {
        takenNames.add(candidate)
        return `nodes/${candidate}`
      }
    }
    return `nodes/${Date.now()}-${basename}`
  }

  const nextOrder = (parentId) => {
    let max = -1
    for (const node of nodes) {
      if ((node.parentId ?? null) === (parentId ?? null)) max = Math.max(max, node.order || 0)
    }
    return max + 1
  }

  const push = async (record, { sourceFile = null, body = '', prefix = 'note' } = {}) => {
    const target = uniqueName(sourceFile)
    const file = target || `nodes/${await nextFileName(path.join(dir, 'nodes'), prefix)}`
    const text = String(body || '')
    const node = {
      id: record.id,
      slNo: '',
      type: record.type,
      parentId: record.parentId ?? null,
      order: record.order ?? nextOrder(record.parentId ?? null),
      file,
      importance: mapImportance(record.importance),
      tags: record.tags || [],
      relatedNodeIds: pick(record.relatedNodeIds),
      favorite: false,
      currentTopic: false,
      themes: record.themes || '',
      label: labelFromText(text, record.type),
      ...(record.pageStart != null ? { pageStart: record.pageStart } : {}),
      ...(record.pageEnd != null ? { pageEnd: record.pageEnd } : {}),
      createdAt: record.createdAt || now,
      updatedAt: now,
    }
    nodes.push(node)
    if (sourceFile) movedFiles.push(sourceFile)
    await writeFileAtomic(
      path.join(dir, file),
      matter.stringify(text ? `${text.replace(/\s+$/, '')}\n` : '', frontmatterOf(node)),
    )
    return node
  }

  // 1. Hierarchy nodes, in index order (parents precede children in practice).
  for (const old of oldNodes) {
    const body = await readBody(dir, old.file)
    await push(
      {
        id: old.id,
        type: mapType(old.type),
        parentId: old.parentId || null,
        order: old.order,
        importance: old.importance,
        tags: Array.isArray(old.tags) ? old.tags : [],
        relatedNodeIds: old.relatedNodeIds,
        pageStart: old.pageStart ?? null,
        pageEnd: old.pageEnd ?? null,
        createdAt: old.createdAt,
      },
      { sourceFile: old.file, body: withTitle(body, old.title) },
    )
  }

  // 2. Notes become child nodes of type `note`.
  for (const old of oldNotes) {
    const body = await readBody(dir, old.file)
    const parentId = old.nodeId && knownIds.has(old.nodeId) ? old.nodeId : null
    await push(
      {
        id: old.id,
        type: 'note',
        parentId,
        importance: old.importance,
        tags: [...(Array.isArray(old.tags) ? old.tags : []), old.type].filter(Boolean),
        relatedNodeIds: [],
        createdAt: old.createdAt,
      },
      { sourceFile: old.file, body: withTitle(body, old.title) },
    )
  }

  // 3. Sources become concept nodes tagged `source`, linked to their evidence.
  for (const old of oldSources) {
    const body = await readBody(dir, old.file)
    const meta = [
      old.citation || [old.author, old.title, old.publisher, old.year].filter(Boolean).join('. '),
      old.doi && `DOI: ${old.doi}`,
      old.url && `URL: ${old.url}`,
      old.citationKey && `Citation key: ${old.citationKey}`,
    ]
      .filter(Boolean)
      .join('\n\n')
    await push(
      {
        id: old.id,
        type: 'concept',
        parentId: null,
        importance: old.importance,
        tags: ['source', ...(Array.isArray(old.tags) ? old.tags : [])],
        relatedNodeIds: [...pick(old.nodeIds)],
        createdAt: old.createdAt,
      },
      {
        sourceFile: old.file,
        body: withTitle([meta, body].filter(Boolean).join('\n\n'), old.title),
        prefix: 'source',
      },
    )
  }

  // 4. Theme groups: members get the theme name in their `themes` field, and the
  //    group itself survives as a concept node tagged `theme`.
  for (const old of oldThemes) {
    const body = await readBody(dir, old.file)
    for (const node of nodes) {
      const members = [...(old.nodeIds || []), ...(old.noteIds || []), ...(old.sourceIds || [])]
      if (!members.includes(node.id)) continue
      const names = node.themes ? node.themes.split(',').map((item) => item.trim()).filter(Boolean) : []
      if (!names.includes(old.name)) names.push(old.name)
      node.themes = names.join(', ')
    }
    await push(
      {
        id: old.id,
        type: 'concept',
        parentId: null,
        importance: old.importance,
        tags: ['theme', ...(Array.isArray(old.tags) ? old.tags : [])],
        relatedNodeIds: pick([...(old.nodeIds || []), ...(old.noteIds || []), ...(old.sourceIds || [])]),
        createdAt: old.createdAt,
      },
      {
        sourceFile: old.file,
        body: withTitle(body, old.name),
        prefix: 'theme',
      },
    )
  }

  // 5. Thesis material becomes note nodes tagged `thesis`.
  if (String(oldThesis.statement || '').trim()) {
    await push({
      id: `thesis_${crypto.randomUUID()}`,
      type: 'note',
      parentId: null,
      importance: 'high',
      tags: ['thesis', 'statement'],
      relatedNodeIds: [],
    }, { body: String(oldThesis.statement).trim(), prefix: 'thesis' })
  }
  for (const claim of Array.isArray(oldThesis.claims) ? oldThesis.claims : []) {
    await push(
      {
        id: claim.id,
        type: 'note',
        parentId: null,
        importance: claim.relation === 'contradict' ? 'medium' : 'high',
        tags: ['thesis', 'claim', claim.relation || 'support'].filter(Boolean),
        relatedNodeIds: [...pick(claim.nodeIds), ...pick(claim.sourceIds)],
        createdAt: claim.createdAt,
      },
      { body: withTitle(claim.statement || '', claim.title), prefix: 'claim' },
    )
  }
  for (const section of Array.isArray(oldThesis.sections) ? oldThesis.sections : []) {
    const body = await readBody(dir, section.file)
    await push(
      {
        id: section.id,
        type: 'note',
        parentId: null,
        importance: 'medium',
        tags: ['thesis', 'draft'],
        relatedNodeIds: [],
        createdAt: section.createdAt,
      },
      { sourceFile: section.file, body: withTitle(body, section.title), prefix: 'section' },
    )
  }

  // 6. Seed sequential serial numbers (the user can renumber afterwards).
  nodes.forEach((node, position) => {
    node.slNo = String(position + 1)
  })

  const migrated = {
    schemaVersion: SCHEMA_VERSION,
    bookId: index.bookId,
    createdAt: index.createdAt || now,
    updatedAt: now,
    nodes,
  }
  await writeJsonAtomic(path.join(dir, 'index.json'), migrated)

  // 7. Remove the legacy folders once every referenced file has moved.
  for (const relative of movedFiles) await fs.rm(path.join(dir, relative), { force: true })
  for (const folder of LEGACY_CONTENT_DIRS) {
    await fs.rmdir(path.join(dir, folder)).catch(() => {})
  }

  return { migrated: true, nodes: nodes.length }
}

/** Migrate one book, serialised with the same lock the API uses for index writes. */
export async function migrateBook(bookId) {
  return withLock(`index:${bookId}`, () => migrateBookDir(bookDir(bookId)))
}

/** Migrate every book on disk. Called once at server start-up. */
export async function migrateAllBooks() {
  await ensureDir(BOOKS_DIR)
  const dirs = await listDirectories(BOOKS_DIR)
  const report = []
  for (const name of dirs) {
    if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(name)) continue
    try {
      const result = await migrateBook(name)
      if (result.migrated) report.push({ bookId: name, ...result })
    } catch (error) {
      console.error(`[migrate] ${name}:`, error.message)
    }
  }
  return report
}
