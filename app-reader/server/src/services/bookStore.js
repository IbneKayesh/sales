import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { BOOKS_DIR, CONTENT_DIRS, DATA_DIR, SCHEMA_VERSION } from '../config.js'
import { badRequest, conflict, notFound } from '../utils/errors.js'
import {
  assertBookId,
  assertContentPath,
  ensureDir,
  listDirectories,
  nextFileName,
  pathExists,
  readJson,
  resolveInside,
  withLock,
  writeFileAtomic,
  writeJsonAtomic,
} from '../utils/fsx.js'
import { buildTree, labelFromText, summarizeCounts } from './hierarchy.js'

const BOOK_SUBDIRS = CONTENT_DIRS

export function slugifyBookId(title) {
  const base = String(title)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
    .replace(/-+$/g, '')
  return base || 'book'
}

export function bookDir(bookId) {
  return resolveInside(BOOKS_DIR, assertBookId(bookId))
}

export function indexFile(bookId) {
  return path.join(bookDir(bookId), 'index.json')
}

export function bookFile(bookId) {
  return path.join(bookDir(bookId), 'book.md')
}

export async function pathForContent(bookId, relativePath) {
  assertContentPath(relativePath)
  return resolveInside(bookDir(bookId), relativePath)
}

function normalizeMeta(data) {
  const text = (value) => (value == null ? '' : String(value))
  return {
    title: text(data.title),
    author: text(data.author),
    year: text(data.year),
    edition: text(data.edition),
    publisher: text(data.publisher),
    researchQuestion: text(data.researchQuestion),
    thesisObjective: text(data.thesisObjective),
    createdAt: text(data.createdAt),
    updatedAt: text(data.updatedAt),
    sample: Boolean(data.sample),
  }
}

export async function readBookMeta(bookId) {
  const file = bookFile(bookId)
  let raw
  try {
    raw = await fs.readFile(file, 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') throw notFound('Book not found')
    throw error
  }
  const parsed = matter(raw)
  return {
    id: assertBookId(bookId),
    ...normalizeMeta(parsed.data),
    description: parsed.content.trim(),
  }
}

export async function writeBookMeta(bookId, patch, description) {
  const current = await readBookMeta(bookId).catch((error) => {
    if (error.status === 404) return null
    throw error
  })
  const merged = {
    title: patch.title ?? current?.title ?? 'Untitled book',
    author: patch.author ?? current?.author ?? '',
    year: patch.year ?? current?.year ?? '',
    edition: patch.edition ?? current?.edition ?? '',
    publisher: patch.publisher ?? current?.publisher ?? '',
    researchQuestion: patch.researchQuestion ?? current?.researchQuestion ?? '',
    thesisObjective: patch.thesisObjective ?? current?.thesisObjective ?? '',
    createdAt: current?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sample: current?.sample ?? false,
  }
  const body = description ?? current?.description ?? ''
  const file = bookFile(bookId)
  await writeFileAtomic(file, matter.stringify(`${body.trim() ? `${body.trim()}\n` : ''}`, merged))
  return readBookMeta(bookId)
}

export function emptyIndex(bookId) {
  const now = new Date().toISOString()
  return {
    schemaVersion: SCHEMA_VERSION,
    bookId,
    createdAt: now,
    updatedAt: now,
    nodes: [],
  }
}

export async function readIndex(bookId) {
  const raw = await readJson(indexFile(bookId))
  if (!raw) throw notFound('Book index not found')
  if (Number(raw.schemaVersion) < SCHEMA_VERSION) {
    throw conflict('This book still uses the old data format. Restart the server once to migrate it.')
  }
  return normalizeIndex(raw, bookId)
}

function normalizeIndex(raw, bookId) {
  return {
    schemaVersion: Number(raw.schemaVersion) || SCHEMA_VERSION,
    bookId,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
    nodes: Array.isArray(raw.nodes) ? raw.nodes : [],
  }
}

async function writeIndex(bookId, index) {
  index.updatedAt = new Date().toISOString()
  await writeJsonAtomic(indexFile(bookId), index)
}

/**
 * Read the index, let the mutator change it, then persist. Serialised per book so
 * concurrent requests cannot overwrite each other's changes.
 */
export async function mutateIndex(bookId, mutator) {
  const id = assertBookId(bookId)
  return withLock(`index:${id}`, async () => {
    const index = await readIndex(id)
    const result = await mutator(index)
    await writeIndex(id, index)
    return result ?? index
  })
}

export async function listBooks() {
  await ensureDir(BOOKS_DIR)
  const ids = await listDirectories(BOOKS_DIR)
  const books = []
  for (const id of ids) {
    if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(id)) continue
    try {
      const book = await readBookMeta(id)
      const index = await readIndex(id).catch(() => emptyIndex(id))
      books.push({ ...book, counts: summarizeCounts(index) })
    } catch {
      // Ignore directories that are not valid book folders.
    }
  }
  return books.sort((a, b) => a.title.localeCompare(b.title))
}

export async function getBook(bookId) {
  const book = await readBookMeta(bookId)
  const index = await readIndex(bookId)
  return { book, index, tree: buildTree(index.nodes), counts: summarizeCounts(index) }
}

export async function createBook(input, options = {}) {
  const title = String(input.title || '').trim()
  if (!title) throw badRequest('Title is required')
  await ensureDir(BOOKS_DIR)

  let id = slugifyBookId(title)
  let attempt = 1
  while (await pathExists(path.join(BOOKS_DIR, id))) {
    attempt += 1
    if (attempt > 50) throw conflict('Could not allocate a unique book id')
    id = `${slugifyBookId(title).slice(0, 44)}-${attempt}`
  }

  const dir = path.join(BOOKS_DIR, id)
  await ensureDir(dir)
  for (const sub of BOOK_SUBDIRS) await ensureDir(path.join(dir, sub))

  const book = await writeBookMeta(
    id,
    {
      title,
      author: input.author || '',
      year: input.year || '',
      edition: input.edition || '',
      publisher: input.publisher || '',
      researchQuestion: input.researchQuestion || '',
      thesisObjective: input.thesisObjective || '',
    },
    input.description || '',
  )

  if (options.sample) {
    const raw = await fs.readFile(bookFile(id), 'utf8')
    const parsed = matter(raw)
    await writeFileAtomic(bookFile(id), matter.stringify(parsed.content, { ...parsed.data, sample: true }))
  }

  const index = emptyIndex(id)
  const now = new Date().toISOString()
  const text = `# ${title}\n`
  const story = {
    id: `node_${crypto.randomUUID()}`,
    slNo: '',
    type: 'story',
    parentId: null,
    order: 0,
    file: 'nodes/node-001.md',
    importance: 'medium',
    tags: [],
    relatedNodeIds: [],
    favorite: false,
    currentTopic: false,
    themes: '',
    label: labelFromText(text, title),
    createdAt: now,
    updatedAt: now,
  }
  index.nodes.push(story)
  await writeFileAtomic(
    path.join(dir, story.file),
    matter.stringify(text, {
      id: story.id,
      slNo: story.slNo,
      type: story.type,
      parentId: null,
      importance: story.importance,
      tags: [],
      relatedNodeIds: [],
      favorite: false,
      currentTopic: false,
      themes: '',
      updatedAt: story.updatedAt,
    }),
  )
  await writeIndex(id, index)

  return { book: { ...book, sample: Boolean(options.sample) }, index }
}

export async function updateBook(bookId, patch) {
  const updated = await writeBookMeta(bookId, patch, patch.description)
  return updated
}

export async function deleteBook(bookId) {
  const dir = bookDir(bookId)
  if (!(await pathExists(dir))) throw notFound('Book not found')
  await fs.rm(dir, { recursive: true, force: true })
}

export async function contentExists(bookId, relativePath) {
  return pathExists(await pathForContent(bookId, relativePath))
}

export async function readContent(bookId, relativePath) {
  const file = await pathForContent(bookId, relativePath)
  let raw
  try {
    raw = await fs.readFile(file, 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') throw notFound('Content file not found')
    throw error
  }
  return matter(raw).content.replace(/^\n+/, '')
}

export async function writeContent(bookId, relativePath, frontmatter, body) {
  const file = await pathForContent(bookId, relativePath)
  const text = matter.stringify(body ? `${String(body).replace(/\s+$/, '')}\n` : '', frontmatter)
  await writeFileAtomic(file, text)
}

export async function deleteContent(bookId, relativePath) {
  if (!relativePath) return
  const file = await pathForContent(bookId, relativePath)
  await fs.rm(file, { force: true })
}

export async function allocateContentPath(bookId, folder, prefix) {
  const dir = path.join(bookDir(bookId), folder)
  await ensureDir(dir)
  const name = await nextFileName(dir, prefix)
  return `${folder}/${name}`
}

export { DATA_DIR }
