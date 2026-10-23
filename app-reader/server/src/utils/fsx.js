import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { badRequest } from './errors.js'

/** Serialise async work per key so index read-modify-write cycles cannot interleave. */
const locks = new Map()

export async function withLock(key, task) {
  const previous = locks.get(key) || Promise.resolve()
  let release
  const current = new Promise((resolve) => {
    release = resolve
  })
  const tail = previous.then(() => current)
  locks.set(key, tail)
  await previous
  try {
    return await task()
  } finally {
    release()
    if (locks.get(key) === tail) locks.delete(key)
  }
}

export async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

/** Write via a temp file in the same directory, then rename — no half-written files. */
export async function writeFileAtomic(file, contents) {
  await ensureDir(path.dirname(file))
  const tmp = path.join(path.dirname(file), `.tmp-${crypto.randomUUID()}`)
  await fs.writeFile(tmp, contents, 'utf8')
  try {
    await fs.rename(tmp, file)
  } catch (error) {
    await fs.rm(tmp, { force: true })
    throw error
  }
}

export async function writeJsonAtomic(file, value) {
  await writeFileAtomic(file, `${JSON.stringify(value, null, 2)}\n`)
}

export async function readJson(file, fallback = null) {
  try {
    const raw = await fs.readFile(file, 'utf8')
    return JSON.parse(raw)
  } catch (error) {
    if (error.code === 'ENOENT') return fallback
    throw error
  }
}

export async function pathExists(target) {
  try {
    await fs.access(target)
    return true
  } catch {
    return false
  }
}

export async function listDirectories(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/
const BOOK_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/
const RELATIVE_FILE_PATTERN =
  /^(book\.md|index\.json|(?:nodes|chapters|passages|notes|themes|sources|thesis)\/[A-Za-z0-9._-]+\.md|media\/[A-Za-z0-9._-]+\.(?:mp3|wav|ogg|m4a|aac|webm|flac))$/i

export function assertId(value, label = 'id') {
  if (typeof value !== 'string' || !ID_PATTERN.test(value)) {
    throw badRequest(`Invalid ${label}`)
  }
  return value
}

export function assertBookId(value) {
  if (typeof value !== 'string' || !BOOK_ID_PATTERN.test(value)) {
    throw badRequest('Invalid book id')
  }
  return value
}

/** Only allow the exact, predictable relative paths the app itself generates. */
export function assertContentPath(relativePath) {
  if (typeof relativePath !== 'string' || relativePath.includes('\\') || !RELATIVE_FILE_PATTERN.test(relativePath)) {
    throw badRequest('Invalid content file path')
  }
  return relativePath
}

/** Resolve a path and refuse anything that escapes the given base directory. */
export function resolveInside(baseDir, ...segments) {
  const base = path.resolve(baseDir)
  const target = path.resolve(base, ...segments)
  if (target !== base && !target.startsWith(base + path.sep)) {
    throw badRequest('Unsafe path')
  }
  return target
}

/**
 * Generate a unique filename for a new content file.
 * Uses a random UUID slug so the name is:
 *   - never sequential (no implied position / order)
 *   - never reused after deletion (no gap-filling confusion)
 *   - collision-resistant (2^48 possibilities from 12 hex chars)
 *
 * Example output: "node-3f8a1c04b2e7.md"
 */
export function nextFileName(_dir, prefix) {
  const slug = crypto.randomUUID().replace(/-/g, '').slice(0, 12)
  return Promise.resolve(`${prefix}-${slug}.md`)
}

export async function removeFile(file) {
  await fs.rm(file, { force: true })
}

export async function relativeFiles(dir, prefix = '') {
  const out = []
  let entries
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch (error) {
    if (error.code === 'ENOENT') return out
    throw error
  }
  for (const entry of entries) {
    const next = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.isDirectory()) out.push(...(await relativeFiles(path.join(dir, entry.name), next)))
    else out.push(next)
  }
  return out
}
