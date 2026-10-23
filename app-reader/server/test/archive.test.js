import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import AdmZip from 'adm-zip'

const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'btl-archive-'))
process.env.DATA_DIR = dataDir

const store = await import('../src/services/bookStore.js')
const nodeService = await import('../src/services/nodes.js')
const archive = await import('../src/services/archive.js')

test.after(async () => {
  await fs.rm(dataDir, { recursive: true, force: true })
})

let bookId
let passageFile
let buffer

test.before(async () => {
  const created = await store.createBook({
    title: 'Archive Study',
    author: 'Researcher',
    researchQuestion: 'What does the evidence show?',
    description: 'A book used to test exports.',
  })
  bookId = created.index.bookId
  const story = created.index.nodes[0]

  const chapter = await nodeService.createNode(bookId, {
    type: 'chapter',
    slNo: '1',
    parentId: story.id,
    text: '# Chapter One\n\nChapter description.',
  })
  const passage = await nodeService.createNode(bookId, {
    type: 'passage',
    slNo: '1.1',
    parentId: chapter.id,
    importance: 'high',
    tags: ['memory'],
    text: '# Key passage\n\nThe lamp rehearsed the dark.',
  })
  passageFile = passage.file

  await nodeService.createNode(bookId, {
    type: 'note',
    slNo: '1.1.1',
    parentId: passage.id,
    text: '# My interpretation\n\nRehearsal is repetition, not storage.',
  })

  await nodeService.createNode(bookId, {
    type: 'concept',
    parentId: story.id,
    tags: ['repetition'],
    text: '# Repetition concept\n\nRepetition across the novel.',
  })

  const exported = await archive.exportBookArchive(bookId)
  buffer = await fs.readFile(exported.file)
})

test('exports a ZIP containing the Markdown files and index in schema v2', async () => {
  const zip = new AdmZip(buffer)
  const names = zip.getEntries().map((entry) => entry.entryName)
  assert.ok(names.includes(`${bookId}/book.md`))
  assert.ok(names.includes(`${bookId}/index.json`))
  assert.ok(names.includes(`${bookId}/${passageFile}`))
  assert.ok(names.some((name) => name.startsWith(`${bookId}/nodes/`)))
})

test('reads an exported archive back with validated entries', async () => {
  const parsed = archive.readArchiveEntries(buffer)
  assert.equal(parsed.title, 'Archive Study')
  assert.equal(parsed.index.nodes.length, 5) // story, chapter, passage, note, concept
  assert.ok(parsed.files.has('book.md'))
  assert.ok(parsed.files.has(passageFile))
})

test('refuses to overwrite an existing book without confirmation', async () => {
  await assert.rejects(
    () => archive.importBookArchive(buffer, { mode: 'reject' }),
    (error) => error.status === 409 && /already exists/.test(error.message),
  )
})

test('imports a copy with a new id when rename mode is confirmed', async () => {
  const result = await archive.importBookArchive(buffer, { mode: 'rename' })
  assert.equal(result.bookId, `${bookId}-copy-2`)
  assert.equal(result.counts.nodes, 5)

  const importedBook = await store.readBookMeta(result.bookId)
  assert.equal(importedBook.title, 'Archive Study')

  const importedIndex = await store.readIndex(result.bookId)
  assert.equal(importedIndex.bookId, result.bookId)
  assert.equal(importedIndex.schemaVersion, 2)
  assert.equal(importedIndex.nodes.length, 5)

  const copiedPassage = importedIndex.nodes.find((node) => node.type === 'passage')
  const copiedContent = await store.readContent(result.bookId, copiedPassage.file)
  assert.match(copiedContent, /lamp rehearsed/)
})

test('builds a Markdown export with node hierarchy', async () => {
  const { markdown, filename } = await archive.buildMarkdownExport(bookId)
  assert.match(filename, /archive-study-book\.md$/)
  assert.match(markdown, /^# Archive Study/m)
  assert.match(markdown, /The lamp rehearsed the dark/)
  assert.match(markdown, /Rehearsal is repetition, not storage/)
})

test('writes Markdown exports to the exports directory', async () => {
  const { file } = await archive.writeMarkdownExport(bookId, {})
  const text = await fs.readFile(file, 'utf8')
  assert.match(text, /# Archive Study/)
})

test('rejects archives with unexpected, missing or unsafe entries', async () => {
  const missingIndex = new AdmZip()
  missingIndex.addFile('book.md', Buffer.from('---\ntitle: No index\n---\n'))
  assert.throws(() => archive.readArchiveEntries(missingIndex.toBuffer()), /missing index\.json/)

  const unexpected = new AdmZip()
  unexpected.addFile('book.md', Buffer.from('---\ntitle: Extra\n---\n'))
  unexpected.addFile('index.json', Buffer.from(JSON.stringify({ schemaVersion: 2, nodes: [] })))
  unexpected.addFile('secrets.txt', Buffer.from('nope'))
  assert.throws(() => archive.readArchiveEntries(unexpected.toBuffer()), /Unexpected file/)

  const missingContent = new AdmZip()
  missingContent.addFile('book.md', Buffer.from('---\ntitle: Broken\n---\n'))
  missingContent.addFile(
    'index.json',
    Buffer.from(
      JSON.stringify({
        schemaVersion: 2,
        nodes: [{ id: 'node_1', type: 'passage', file: 'nodes/node-999.md' }],
      }),
    ),
  )
  assert.throws(() => archive.readArchiveEntries(missingContent.toBuffer()), /content file that is missing/)

  const badJson = new AdmZip()
  badJson.addFile('book.md', Buffer.from('---\ntitle: Bad\n---\n'))
  badJson.addFile('index.json', Buffer.from('{not json'))
  assert.throws(() => archive.readArchiveEntries(badJson.toBuffer()), /not valid JSON/)
})

test('imports and automatically migrates a schema v1 archive', async () => {
  const zip = new AdmZip()
  zip.addFile('book.md', Buffer.from('---\ntitle: Legacy Book\nauthor: Someone\n---\n\nA legacy description.\n'))
  zip.addFile(
    'index.json',
    Buffer.from(
      JSON.stringify({
        schemaVersion: 1,
        bookId: 'legacy-book',
        nodes: [
          {
            id: 'legacy-node-1',
            type: 'chapter',
            title: 'Legacy Chapter',
            file: 'chapters/chapter-001.md',
            parentId: null,
            order: 0,
          },
        ],
        notes: [
          {
            id: 'legacy-note-1',
            type: 'interpretation',
            title: 'Legacy Note',
            file: 'notes/note-001.md',
            nodeId: 'legacy-node-1',
          },
        ],
        sources: [],
        themes: [],
        thesis: {},
      }),
    ),
  )
  zip.addFile('chapters/chapter-001.md', Buffer.from('---\nid: legacy-node-1\n---\nChapter text.'))
  zip.addFile('notes/note-001.md', Buffer.from('---\nid: legacy-note-1\n---\nNote text.'))

  const result = await archive.importBookArchive(zip.toBuffer())
  assert.equal(result.bookId, 'legacy-book')

  const importedIndex = await store.readIndex(result.bookId)
  assert.equal(importedIndex.schemaVersion, 2)
  // Chapter + migrated Note = 2 nodes in unified hierarchy
  assert.equal(importedIndex.nodes.length, 2)
  assert.ok(importedIndex.nodes.every((n) => n.file.startsWith('nodes/')))
})
