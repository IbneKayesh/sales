import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'btl-search-'))
process.env.DATA_DIR = dataDir

const store = await import('../src/services/bookStore.js')
const nodeService = await import('../src/services/nodes.js')
const { searchBooks } = await import('../src/services/search.js')

test.after(async () => {
  await fs.rm(dataDir, { recursive: true, force: true })
})

let firstBook
let secondBook

test.before(async () => {
  const first = await store.createBook({
    title: 'Lantern Studies',
    author: 'Sample Author',
    researchQuestion: 'How does the lantern figure memory?',
  })
  firstBook = first.index.bookId
  const story = first.index.nodes[0]

  const chapter = await nodeService.createNode(firstBook, {
    type: 'chapter',
    slNo: '1',
    parentId: story.id,
    text: '# The Keeper\n\nA chapter about routines at the lantern-lit lighthouse.',
  })

  const passage = await nodeService.createNode(firstBook, {
    type: 'passage',
    slNo: '1.1',
    parentId: chapter.id,
    tags: ['memory', 'maritime'],
    themes: 'routine and darkness',
    text: '# Lamp passage\n\nThe lantern rehearsed the same argument against the darkness.',
  })

  await nodeService.createNode(firstBook, {
    type: 'note',
    slNo: '1.1.1',
    parentId: passage.id,
    tags: ['ritual'],
    text: '# Ritual reading\n\nThe lantern rehearsing suggests ritual rather than accurate storage.',
  })

  await nodeService.createNode(firstBook, {
    type: 'concept',
    parentId: story.id,
    tags: ['memory'],
    text: '# Maritime Poetics\n\nArgues that lantern imagery encodes routine.',
  })

  const second = await store.createBook({
    title: 'Unrelated Book',
    author: 'Other Author',
    researchQuestion: 'What about gardens?',
  })
  secondBook = second.index.bookId
  await nodeService.createNode(secondBook, {
    type: 'chapter',
    parentId: second.index.nodes[0].id,
    text: '# Garden chapter\n\nNothing about lanterns lives here. Just roses.',
  })
})

test('finds matching book and nodes across types, tags, themes and text', async () => {
  const result = await searchBooks({ query: 'lantern' })
  assert.equal(result.query, 'lantern')
  assert.equal(result.searchedBooks, 2)
  assert.ok(result.total > 0)

  const types = new Set(result.results.map((item) => item.type))
  assert.ok(types.has('book'))
  assert.ok(types.has('chapter'))
  assert.ok(types.has('passage'))
  assert.ok(types.has('note'))
  assert.ok(types.has('concept'))

  const passage = result.results.find((item) => item.type === 'passage')
  assert.equal(passage.bookTitle, 'Lantern Studies')
  assert.equal(passage.chapterTitle, 'The Keeper')
  assert.equal(passage.slNo, '1.1')
  assert.match(passage.snippet, /lantern rehearsed/i)

  const note = result.results.find((item) => item.type === 'note')
  assert.ok(note, 'note node is searchable')
  assert.ok(note.nodeId.length > 0)
  assert.match(note.snippet, /rehearsing suggests ritual/i)
})

test('searches match node tags and themes', async () => {
  const tagResult = await searchBooks({ query: 'ritual' })
  assert.ok(tagResult.results.some((item) => item.type === 'note'))

  const themeResult = await searchBooks({ query: 'routine and darkness' })
  assert.ok(themeResult.results.some((item) => item.type === 'passage'))
})

test('searches are case-insensitive and limited by book scope', async () => {
  const scoped = await searchBooks({ query: 'LANTERN', bookId: firstBook })
  assert.equal(scoped.searchedBooks, 1)
  assert.ok(scoped.results.every((item) => item.bookId === firstBook))
  assert.ok(scoped.total > 0)
})

test('does not leak results from a different book', async () => {
  const scoped = await searchBooks({ query: 'roses', bookId: firstBook })
  assert.equal(scoped.total, 0)

  const all = await searchBooks({ query: 'roses' })
  assert.ok(all.results.some((item) => item.bookId === secondBook))
  assert.ok(all.results.every((item) => item.bookId === secondBook))
})

test('returns no results for absent terms and an empty response for blank queries', async () => {
  const none = await searchBooks({ query: 'nonexistent-token-xyz' })
  assert.equal(none.total, 0)
  assert.deepEqual(none.results, [])

  const blank = await searchBooks({ query: '   ' })
  assert.deepEqual(blank.results, [])
  assert.equal(blank.total, 0)
})

test('respects the result limit', async () => {
  const limited = await searchBooks({ query: 'the', limit: 2 })
  assert.equal(limited.results.length, 2)
})
