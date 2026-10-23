import { createWriteStream } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import archiver from 'archiver'
import AdmZip from 'adm-zip'
import matter from 'gray-matter'
import { BOOKS_DIR, CONTENT_DIRS, EXPORTS_DIR, SCHEMA_VERSION } from '../config.js'
import { badRequest, conflict, notFound } from '../utils/errors.js'
import {
  assertBookId,
  ensureDir,
  pathExists,
  resolveInside,
  withLock,
  writeFileAtomic,
  writeJsonAtomic,
} from '../utils/fsx.js'
import { bookDir, listBooks, readBookMeta, readContent, readIndex } from './bookStore.js'
import { getDescendantIds, sortNodes } from './hierarchy.js'
import { migrateBookDir } from './migrate.js'

/** Legacy folder names stay accepted so schema-v1 backups can be imported and migrated. */
const ALLOWED_ENTRY =
  /^(book\.md|index\.json|index\.v1\.bak\.json|(?:nodes|chapters|passages|notes|themes|sources|thesis)\/[A-Za-z0-9._-]+\.md)$/
const MAX_ENTRIES = 5000
const MAX_UNCOMPRESSED = 120 * 1024 * 1024

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
}

function zipToFile(zipPath, addEntries) {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(zipPath)
    const archive = archiver('zip', { zlib: { level: 9 } })
    output.on('close', () => resolve({ file: zipPath, size: archive.pointer() }))
    output.on('error', reject)
    archive.on('warning', (error) => {
      if (error.code !== 'ENOENT') reject(error)
    })
    archive.on('error', reject)
    archive.pipe(output)
    addEntries(archive)
    archive.finalize()
  })
}

export async function exportBookArchive(bookId) {
  await readBookMeta(bookId)
  await ensureDir(EXPORTS_DIR)
  const filename = `book-thesis-lab-${bookId}-${timestamp()}.zip`
  const zipPath = path.join(EXPORTS_DIR, filename)
  await zipToFile(zipPath, (archive) => archive.directory(bookDir(bookId), bookId))
  return { file: zipPath, filename }
}

export async function exportAllBooksArchive() {
  const books = await listBooks()
  if (!books.length) throw notFound('There are no books to back up')
  await ensureDir(EXPORTS_DIR)
  const filename = `book-thesis-lab-backup-${timestamp()}.zip`
  const zipPath = path.join(EXPORTS_DIR, filename)
  await zipToFile(zipPath, (archive) => {
    for (const book of books) archive.directory(bookDir(book.id), `books/${book.id}`)
  })
  return { file: zipPath, filename }
}

/** Read a ZIP archive from memory, validating every entry name and shape. */
export function readArchiveEntries(buffer) {
  let zip
  try {
    zip = new AdmZip(buffer)
  } catch {
    throw badRequest('The uploaded file is not a valid ZIP archive')
  }
  const entries = zip.getEntries()
  if (!entries.length) throw badRequest('The archive is empty')
  if (entries.length > MAX_ENTRIES) throw badRequest('The archive contains too many files')

  const files = new Map()
  let total = 0
  for (const entry of entries) {
    if (entry.isDirectory) continue
    const name = entry.entryName.replace(/\\/g, '/')
    if (!name || name.startsWith('/') || /^[A-Za-z]:/.test(name) || name.split('/').some((part) => part === '..')) {
      throw badRequest(`Unsafe path in archive: ${entry.entryName}`)
    }
    total += entry.header.size
    if (total > MAX_UNCOMPRESSED) throw badRequest('The archive is too large to import')
    files.set(name, entry.getData())
  }

  const names = [...files.keys()]
  if (!names.length) throw badRequest('The archive contains no files')

  const tops = new Set(names.map((name) => name.split('/')[0]))
  const onlyTop = [...tops][0]
  const prefix = tops.size === 1 && !names.includes(onlyTop) ? `${onlyTop}/` : ''

  const relative = new Map()
  for (const [name, data] of files) {
    if (prefix && !name.startsWith(prefix)) throw badRequest('Archive has an inconsistent folder structure')
    const rel = prefix ? name.slice(prefix.length) : name
    if (!ALLOWED_ENTRY.test(rel)) throw badRequest(`Unexpected file in archive: ${name}`)
    relative.set(rel, data)
  }

  if (!relative.has('book.md')) throw badRequest('Archive is missing book.md')
  if (!relative.has('index.json')) throw badRequest('Archive is missing index.json')

  let index
  try {
    index = JSON.parse(relative.get('index.json').toString('utf8'))
  } catch {
    throw badRequest('index.json in the archive is not valid JSON')
  }
  if (!index || typeof index !== 'object' || !Array.isArray(index.nodes)) {
    throw badRequest('index.json does not contain a valid research hierarchy')
  }
  if (Number(index.schemaVersion) > SCHEMA_VERSION) {
    throw badRequest('This archive was created by a newer version of Book Thesis Lab')
  }
  for (const node of index.nodes) {
    if (!node?.file || !relative.has(node.file)) {
      throw badRequest('Archive references a content file that is missing')
    }
  }

  const bookParsed = matter(relative.get('book.md').toString('utf8'))
  if (!String(bookParsed.data.title || '').trim()) throw badRequest('book.md is missing a title')

  return { files: relative, index, title: String(bookParsed.data.title).trim() }
}

async function uniqueImportId(preferred, mode) {
  const base = assertBookId(preferred).slice(0, 40).replace(/-+$/, '') || 'imported-book'
  if (!(await pathExists(path.join(BOOKS_DIR, base)))) return base
  if (mode !== 'rename') {
    throw conflict('A book with this id already exists. Confirm to import a copy instead.', { code: 'BOOK_EXISTS' })
  }
  for (let i = 2; i < 100; i += 1) {
    const candidate = `${base}-copy-${i}`
    if (!(await pathExists(path.join(BOOKS_DIR, candidate)))) return candidate
  }
  throw conflict('Could not allocate a unique id for the imported book')
}

export async function importBookArchive(buffer, { mode = 'reject', preferredId = null } = {}) {
  const { files, index, title } = readArchiveEntries(buffer)
  await ensureDir(BOOKS_DIR)

  const slug = String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
  const requested = /^[a-z0-9][a-z0-9-]{0,63}$/.test(index.bookId || '') ? index.bookId : preferredId
  const bookId = await uniqueImportId(requested || slug || 'imported-book', mode)

  return withLock(`import:${bookId}`, async () => {
    const target = resolveInside(BOOKS_DIR, bookId)
    const staging = resolveInside(BOOKS_DIR, `.import-${bookId}-${Date.now()}`)
    await ensureDir(staging)
    try {
      for (const [rel, data] of files) {
        const destination = resolveInside(staging, rel)
        await ensureDir(path.dirname(destination))
        await fs.writeFile(destination, data)
      }
      for (const sub of CONTENT_DIRS) await ensureDir(path.join(staging, sub))

      // Old backups are upgraded to the current schema while still in staging.
      if (Number(index.schemaVersion) < SCHEMA_VERSION) {
        await migrateBookDir(staging)
      }

      const stored = JSON.parse(await fs.readFile(path.join(staging, 'index.json'), 'utf8'))
      const importedIndex = {
        ...stored,
        schemaVersion: SCHEMA_VERSION,
        bookId,
        createdAt: stored.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      await writeJsonAtomic(path.join(staging, 'index.json'), importedIndex)
      await fs.rename(staging, target)
    } catch (error) {
      await fs.rm(staging, { recursive: true, force: true })
      throw error
    }
    return { bookId, title, counts: { nodes: index.nodes.length } }
  })
}

/* ------------------------------------------------------------------ */
/* Markdown exports                                                    */
/* ------------------------------------------------------------------ */

function pageLabel(node) {
  if (node.pageStart && node.pageEnd && node.pageEnd !== node.pageStart) return `pp. ${node.pageStart}–${node.pageEnd}`
  if (node.pageStart) return `p. ${node.pageStart}`
  return ''
}

function metaLine(node) {
  const parts = [node.type]
  if (node.slNo) parts.push(`sl. ${node.slNo}`)
  const pages = pageLabel(node)
  if (pages) parts.push(pages)
  parts.push(node.importance || 'medium')
  if (node.favorite) parts.push('favourite')
  if (node.currentTopic) parts.push('current topic')
  return parts.join(' · ')
}

function block(lines, ...values) {
  for (const value of values) {
    if (value) lines.push(value)
  }
  lines.push('')
}

function renderNodes(nodes, contents) {
  const lines = []
  const byId = new Map(nodes.map((node) => [node.id, node]))
  const topLevel = sortNodes(nodes.filter((node) => !node.parentId || !byId.has(node.parentId)))

  const renderNode = (node, depth) => {
    const heading = '#'.repeat(Math.min(depth + 2, 6))
    const flags = [node.favorite ? '★' : '', node.currentTopic ? '● current topic' : ''].filter(Boolean).join(' · ')
    block(
      lines,
      `${heading} ${node.label || node.type}${node.slNo ? ` (sl. ${node.slNo})` : ''}`,
      `_${metaLine(node)}${flags ? ` · ${flags}` : ''}_`,
      node.tags?.length ? `Tags: ${node.tags.join(', ')}` : '',
      node.themes ? `Themes: ${node.themes}` : '',
      contents[node.id] ? contents[node.id] : '_(no text yet)_',
    )
    const related = (node.relatedNodeIds || []).map((id) => byId.get(id)).filter(Boolean)
    if (related.length) {
      lines.push('**Related nodes**')
      for (const item of related) lines.push(`- ${item.label || item.type}${item.slNo ? ` (sl. ${item.slNo})` : ''}`)
      lines.push('')
    }
    for (const child of sortNodes(nodes.filter((item) => item.parentId === node.id))) renderNode(child, depth + 1)
  }
  for (const node of topLevel) renderNode(node, 0)

  return lines.join('\n')
}

export async function buildMarkdownExport(bookId, { nodeIds = null } = {}) {
  const book = await readBookMeta(bookId)
  const index = await readIndex(bookId)

  let nodes = index.nodes
  if (Array.isArray(nodeIds) && nodeIds.length) {
    const ids = new Set(nodeIds)
    for (const id of nodeIds) for (const child of getDescendantIds(index.nodes, id)) ids.add(child)
    nodes = index.nodes.filter((node) => ids.has(node.id))
  }

  const contents = {}
  for (const node of nodes) contents[node.id] = await readContent(bookId, node.file).catch(() => '')

  const header = [
    `# ${book.title}`,
    '',
    ...(book.author ? [`**Author:** ${book.author}`] : []),
    ...(book.year ? [`**Year:** ${book.year}`] : []),
    ...(book.edition ? [`**Edition:** ${book.edition}`] : []),
    ...(book.publisher ? [`**Publisher:** ${book.publisher}`] : []),
    '',
  ]
  if (book.researchQuestion) header.push(`**Research question:** ${book.researchQuestion}`, '')
  if (book.thesisObjective) header.push(`**Thesis objective:** ${book.thesisObjective}`, '')
  header.push(
    "> Nodes keep the author's original text and the researcher's notes in one hierarchy; types and tags mark the difference.",
    '',
    `_Exported ${new Date().toISOString()} · Book Thesis Lab_`,
    '',
    '---',
    '',
  )

  const body = [book.description ? `## About this book\n\n${book.description}\n` : '', renderNodes(nodes, contents)].join(
    '\n',
  )

  const safeTitle = book.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'book'
  const singleNode = Array.isArray(nodeIds) && nodeIds.length === 1 ? index.nodes.find((n) => n.id === nodeIds[0]) : null
  const scope = singleNode && ['chapter', 'story'].includes(singleNode.type) ? 'chapter' : nodeIds?.length ? 'selection' : 'book'

  return { markdown: `${header.join('\n')}\n${body}`, filename: `${safeTitle}-${scope}.md` }
}

export async function writeMarkdownExport(bookId, options) {
  const { markdown, filename } = await buildMarkdownExport(bookId, options)
  await ensureDir(EXPORTS_DIR)
  const file = path.join(EXPORTS_DIR, `${timestamp()}-${filename}`)
  await writeFileAtomic(file, markdown)
  return { file, filename, markdown }
}
