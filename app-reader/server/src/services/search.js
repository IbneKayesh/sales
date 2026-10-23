import { readBookMeta, readContent, readIndex } from './bookStore.js'
import { findChapter } from './hierarchy.js'
import { listDirectories } from '../utils/fsx.js'
import { BOOKS_DIR } from '../config.js'

const MAX_RESULTS = 80

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function makeSnippet(text, query, length = 180) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim()
  if (!clean) return ''
  const index = clean.toLowerCase().indexOf(query.toLowerCase())
  if (index === -1) return clean.slice(0, length) + (clean.length > length ? '…' : '')
  const start = Math.max(0, index - Math.floor(length / 3))
  const end = Math.min(clean.length, start + length)
  return `${start > 0 ? '…' : ''}${clean.slice(start, end)}${end < clean.length ? '…' : ''}`
}

function countOccurrences(text, pattern) {
  const matches = String(text || '').match(pattern)
  return matches ? matches.length : 0
}

/**
 * Search book metadata and node content (text, tags, serials, themes) across every
 * book — or just one. Results carry the book, chapter and serial context.
 */
export async function searchBooks({ query, bookId = null, limit = MAX_RESULTS } = {}) {
  const q = String(query || '').trim()
  if (!q) return { query: q, results: [], total: 0, searchedBooks: 0 }

  const pattern = new RegExp(escapeRegExp(q), 'gi')
  const bookIds = bookId ? [bookId] : await listDirectories(BOOKS_DIR)
  const results = []
  let searchedBooks = 0

  for (const id of bookIds) {
    if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(id)) continue
    let book
    let index
    try {
      book = await readBookMeta(id)
      index = await readIndex(id)
    } catch {
      continue
    }
    searchedBooks += 1

    const push = (entry) => {
      if (!entry.snippet) return
      results.push({ bookId: id, bookTitle: book.title, ...entry })
    }

    const metaText = [book.title, book.author, book.publisher, book.researchQuestion, book.thesisObjective].join(' ')
    if (pattern.test(metaText)) {
      pattern.lastIndex = 0
      push({
        type: 'book',
        title: book.title,
        subtitle: [book.author, book.year].filter(Boolean).join(' · '),
        snippet: makeSnippet(metaText, q),
        score: 40 + countOccurrences(book.title, pattern) * 20,
        nodeId: null,
        slNo: '',
        chapterTitle: '',
        tags: [],
      })
    }
    pattern.lastIndex = 0

    for (const node of index.nodes) {
      const content = await readContent(id, node.file).catch(() => '')
      const haystack = [node.slNo, node.label, (node.tags || []).join(' '), node.themes, content].join('\n')
      const hits = countOccurrences(haystack, pattern)
      if (!hits) continue
      const chapter = findChapter(index.nodes, node.id)
      push({
        type: node.type,
        title: node.label || node.type,
        nodeId: node.id,
        slNo: node.slNo || '',
        subtitle: [
          node.type,
          node.slNo ? `sl. ${node.slNo}` : '',
          node.tags?.length ? node.tags.join(', ') : '',
        ]
          .filter(Boolean)
          .join(' · '),
        snippet: makeSnippet(content || node.label || '', q),
        score:
          20 +
          countOccurrences(node.label || '', pattern) * 25 +
          countOccurrences(node.slNo || '', pattern) * 15 +
          Math.min(hits, 10),
        chapterTitle: chapter && chapter.id !== node.id ? chapter.label : '',
        importance: node.importance,
        tags: node.tags || [],
        favorite: Boolean(node.favorite),
        currentTopic: Boolean(node.currentTopic),
      })
    }
  }

  results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
  return {
    query: q,
    results: results.slice(0, Math.min(Number(limit) || MAX_RESULTS, MAX_RESULTS)),
    total: results.length,
    searchedBooks,
  }
}
