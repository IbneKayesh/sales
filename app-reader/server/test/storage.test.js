import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import matter from 'gray-matter'

const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'btl-storage-'))
process.env.DATA_DIR = dataDir

const store = await import('../src/services/bookStore.js')
const nodeService = await import('../src/services/nodes.js')

test.after(async () => {
  await fs.rm(dataDir, { recursive: true, force: true })
})

async function newBook(title = 'Test Book') {
  const { index } = await store.createBook({ title, author: 'Test Author', researchQuestion: 'Why?' })
  return index.bookId
}

test('createBook writes book.md, index.json and a story root in schema v2', async () => {
  const bookId = await newBook('The First Book')
  const book = await store.readBookMeta(bookId)
  assert.equal(book.title, 'The First Book')
  assert.equal(book.author, 'Test Author')
  assert.equal(book.researchQuestion, 'Why?')

  const index = await store.readIndex(bookId)
  assert.equal(index.schemaVersion, 2)
  assert.equal(index.nodes.length, 1)
  assert.equal(index.nodes[0].type, 'story')
  assert.equal(index.nodes[0].parentId, null)
  assert.equal(index.nodes[0].file, 'nodes/node-001.md')

  const raw = await fs.readFile(path.join(dataDir, 'books', bookId, 'book.md'), 'utf8')
  const parsed = matter(raw)
  assert.equal(parsed.data.title, 'The First Book')
  await fs.access(path.join(dataDir, 'books', bookId, 'nodes', 'node-001.md'))
})

test('createBook assigns a unique slug when the title is reused', async () => {
  const first = await newBook('Same Title')
  const second = await newBook('Same Title')
  assert.notEqual(first, second)
  assert.match(second, /^same-title-\d+$/)
})

test('nodes persist to Markdown and survive a fresh read', async () => {
  const bookId = await newBook('Persistent Nodes')
  const { index } = await store.getBook(bookId)
  const story = index.nodes[0]

  const chapter = await nodeService.createNode(bookId, {
    type: 'chapter',
    slNo: '1',
    parentId: story.id,
    tags: ['memory', 'Memory', 'evidence'],
    text: '# Chapter One\n\nA chapter description.\n',
  })
  const passage = await nodeService.createNode(bookId, {
    type: 'passage',
    slNo: '1.1',
    parentId: chapter.id,
    importance: 'high',
    text: 'The lighthouse rehearsed the dark.\n',
  })

  assert.equal(chapter.file, 'nodes/node-002.md')
  assert.equal(passage.file, 'nodes/node-003.md')
  assert.deepEqual(chapter.tags, ['memory', 'evidence'])
  assert.equal(chapter.label, 'Chapter One')

  const fresh = await store.getBook(bookId)
  const storedChapter = fresh.index.nodes.find((node) => node.id === chapter.id)
  assert.equal(storedChapter.label, 'Chapter One')
  assert.equal(storedChapter.slNo, '1')
  assert.equal(fresh.tree[0].children[0].id, chapter.id)

  const content = await store.readContent(bookId, passage.file)
  assert.match(content, /lighthouse rehearsed/)
})

test('updateNode rewrites metadata and content in schema v2', async () => {
  const bookId = await newBook('Updating Nodes')
  const { index } = await store.getBook(bookId)
  const story = index.nodes[0]

  const node = await nodeService.createNode(bookId, {
    type: 'chapter',
    slNo: '1',
    parentId: story.id,
    text: 'Initial text.',
  })

  await nodeService.updateNode(bookId, node.id, {
    slNo: '2',
    importance: 'high',
    favorite: true,
    currentTopic: true,
    themes: 'repetition',
    text: '# Renamed Chapter\n\nRevised text with a *markdown* note.',
  })

  const updated = await store.getBook(bookId)
  const stored = updated.index.nodes.find((item) => item.id === node.id)
  assert.equal(stored.label, 'Renamed Chapter')
  assert.equal(stored.slNo, '2')
  assert.equal(stored.importance, 'high')
  assert.equal(stored.favorite, true)
  assert.equal(stored.currentTopic, true)
  assert.equal(stored.themes, 'repetition')

  const raw = await fs.readFile(path.join(dataDir, 'books', bookId, stored.file), 'utf8')
  const parsed = matter(raw)
  assert.equal(parsed.data.slNo, '2')
  assert.equal(parsed.data.favorite, true)
  assert.match(parsed.content, /Revised text/)
})

test('rejects missing parents and circular moves', async () => {
  const bookId = await newBook('Cycle Guard')
  const { index } = await store.getBook(bookId)
  const story = index.nodes[0]
  const parent = await nodeService.createNode(bookId, {
    type: 'chapter',
    parentId: story.id,
    text: 'Parent',
  })
  const child = await nodeService.createNode(bookId, {
    type: 'passage',
    parentId: parent.id,
    text: 'Child',
  })

  await assert.rejects(() => nodeService.createNode(bookId, { type: 'chapter', parentId: 'node_missing' }), /Parent node does not exist/)
  await assert.rejects(() => nodeService.updateNode(bookId, parent.id, { parentId: child.id }), /cannot be moved inside/)
  await assert.rejects(() => nodeService.updateNode(bookId, parent.id, { parentId: parent.id }), /cannot be moved inside/)
})

test('concurrent node creation does not lose index updates', async () => {
  const bookId = await newBook('Concurrent Writes')
  const { index } = await store.getBook(bookId)
  const story = index.nodes[0]

  const created = await Promise.all(
    Array.from({ length: 8 }, (_, position) =>
      nodeService.createNode(bookId, {
        type: 'passage',
        parentId: story.id,
        text: `Concurrent passage ${position}`,
      }),
    ),
  )

  const fresh = await store.getBook(bookId)
  assert.equal(fresh.index.nodes.length, 9)
  assert.equal(new Set(created.map((node) => node.file)).size, 8)
  for (const node of created) {
    assert.equal(await store.contentExists(bookId, node.file), true)
  }
})

test('deleting a node removes descendants and cleans up relatedNodeIds', async () => {
  const bookId = await newBook('Delete Cascade')
  const { index } = await store.getBook(bookId)
  const story = index.nodes[0]
  const chapter = await nodeService.createNode(bookId, { type: 'chapter', parentId: story.id, text: 'To delete' })
  const passage = await nodeService.createNode(bookId, { type: 'passage', parentId: chapter.id, text: 'Child' })
  const surviving = await nodeService.createNode(bookId, {
    type: 'concept',
    parentId: story.id,
    text: 'Surviving concept',
    relatedNodeIds: [passage.id, chapter.id],
  })

  const result = await nodeService.deleteNode(bookId, chapter.id)
  assert.deepEqual(result.deletedNodeIds.sort(), [chapter.id, passage.id].sort())

  const fresh = await store.getBook(bookId)
  assert.equal(fresh.index.nodes.length, 2)
  const storedSurviving = fresh.index.nodes.find((n) => n.id === surviving.id)
  assert.deepEqual(storedSurviving.relatedNodeIds, [])
  assert.equal(await store.contentExists(bookId, chapter.file), false)
  assert.equal(await store.contentExists(bookId, passage.file), false)
  assert.equal(await store.contentExists(bookId, surviving.file), true)
})

test('reordering siblings updates order in the index', async () => {
  const bookId = await newBook('Reorder Nodes')
  const { index } = await store.getBook(bookId)
  const story = index.nodes[0]
  const a = await nodeService.createNode(bookId, { type: 'chapter', parentId: story.id, text: 'Chapter A' })
  const b = await nodeService.createNode(bookId, { type: 'chapter', parentId: story.id, text: 'Chapter B' })

  assert.equal(a.order, 0)
  assert.equal(b.order, 1)

  await nodeService.reorderNode(bookId, b.id, 'up')
  const fresh = await store.getBook(bookId)
  assert.equal(fresh.index.nodes.find((n) => n.id === b.id).order, 0)
  assert.equal(fresh.index.nodes.find((n) => n.id === a.id).order, 1)
})

test('deleteBook removes the whole folder and listBooks reflects it', async () => {
  const bookId = await newBook('Temporary Book')
  assert.ok((await store.listBooks()).some((book) => book.id === bookId))
  await store.deleteBook(bookId)
  assert.ok(!(await store.listBooks()).some((book) => book.id === bookId))
  await assert.rejects(() => fs.access(path.join(dataDir, 'books', bookId)))
  await assert.rejects(() => store.readBookMeta(bookId), /Book not found/)
})

test('content paths outside the allowlist are refused', async () => {
  const bookId = await newBook('Path Safety')
  await assert.rejects(() => store.readContent(bookId, '../book.md'), /Invalid content file path/)
  await assert.rejects(() => store.readContent(bookId, 'nodes/../../secret.md'), /Invalid content file path/)
  await assert.rejects(() => store.readContent(bookId, '/etc/passwd'), /Invalid content file path/)
  await assert.rejects(() => store.readContent(bookId, 'nodes/nested/deeper.md'), /Invalid content file path/)
})
