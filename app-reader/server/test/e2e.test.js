import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'btl-e2e-'))
process.env.DATA_DIR = dataDir

const { createApp } = await import('../src/app.js')
const { ensureDir } = await import('../src/utils/fsx.js')
const { BOOKS_DIR, EXPORTS_DIR } = await import('../src/config.js')
const { seedSampleBook } = await import('../src/services/sample.js')

let server
let baseUrl

test.before(async () => {
  await ensureDir(BOOKS_DIR)
  await ensureDir(EXPORTS_DIR)
  await seedSampleBook()

  const app = createApp()
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port
      baseUrl = `http://127.0.0.1:${port}`
      resolve()
    })
  })
})

test.after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve))
  await fs.rm(dataDir, { recursive: true, force: true })
})

test('E2E: Health check responds OK', async () => {
  const res = await fetch(`${baseUrl}/api/health`)
  assert.equal(res.status, 200)
  const data = await res.json()
  assert.equal(data.ok, true)
})

test('E2E: Books list returns seeded sample with v2 counts', async () => {
  const res = await fetch(`${baseUrl}/api/books`)
  assert.equal(res.status, 200)
  const data = await res.json()
  assert.ok(Array.isArray(data.books))
  assert.ok(data.books.length >= 1)
  const sample = data.books.find((b) => b.sample)
  assert.ok(sample)
  assert.ok(sample.counts.chapters > 0)
  assert.ok(sample.counts.total > 0)
  assert.ok(Array.isArray(sample.counts.tags))
})

test('E2E: Full node lifecycle (create, fetch, update, reorder, delete)', async () => {
  // 1. Create a new book
  const bookRes = await fetch(`${baseUrl}/api/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'E2E Lifecycle Study',
      author: 'Tester',
      researchQuestion: 'Does the schema v2 API work end to end?',
    }),
  })
  assert.equal(bookRes.status, 201)
  const { index } = await bookRes.json()
  const bookId = index.bookId
  const rootStoryId = index.nodes[0].id

  // 2. Create chapter node
  const chRes = await fetch(`${baseUrl}/api/books/${bookId}/nodes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'chapter',
      slNo: '1',
      parentId: rootStoryId,
      text: '# Chapter 1: The Threshold\n\nIntroductory discussion.',
    }),
  })
  assert.equal(chRes.status, 201)
  const chapterNode = (await chRes.json()).node
  assert.equal(chapterNode.label, 'Chapter 1: The Threshold')
  assert.equal(chapterNode.slNo, '1')

  // 3. Create passage node with tags and themes
  const passageRes = await fetch(`${baseUrl}/api/books/${bookId}/nodes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'passage',
      slNo: '1.1',
      parentId: chapterNode.id,
      importance: 'high',
      tags: ['memory', 'solitude'],
      themes: 'isolation vs presence',
      text: '# Key quotation\n\n"The waves kept no memory of the keel."',
    }),
  })
  assert.equal(passageRes.status, 201)
  const passageNode = (await passageRes.json()).node
  assert.deepEqual(passageNode.tags, ['memory', 'solitude'])

  // 4. Fetch node detail
  const detailRes = await fetch(`${baseUrl}/api/books/${bookId}/nodes/${passageNode.id}`)
  assert.equal(detailRes.status, 200)
  const detail = await detailRes.json()
  assert.equal(detail.node.id, passageNode.id)
  assert.match(detail.text, /waves kept no memory/)
  assert.equal(detail.ancestors.length, 2) // story -> chapter

  // 5. Update node
  const updateRes = await fetch(`${baseUrl}/api/books/${bookId}/nodes/${passageNode.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      favorite: true,
      currentTopic: true,
      text: '# Updated quotation\n\n"The waves kept no memory of the keel; the stone remembered."',
    }),
  })
  assert.equal(updateRes.status, 200)
  const updated = (await updateRes.json()).node
  assert.equal(updated.favorite, true)
  assert.equal(updated.currentTopic, true)

  // 6. Search matches updated content and tag
  const searchRes = await fetch(`${baseUrl}/api/search?q=solitude&bookId=${bookId}`)
  assert.equal(searchRes.status, 200)
  const searchData = await searchRes.json()
  assert.ok(searchData.total >= 1)
  assert.equal(searchData.results[0].nodeId, passageNode.id)

  // 7. Delete chapter cascades to passage
  const deleteRes = await fetch(`${baseUrl}/api/books/${bookId}/nodes/${chapterNode.id}`, {
    method: 'DELETE',
  })
  assert.equal(deleteRes.status, 200)
  const deleteData = await deleteRes.json()
  assert.ok(deleteData.deletedNodeIds.includes(chapterNode.id))
  assert.ok(deleteData.deletedNodeIds.includes(passageNode.id))

  // 8. Verify passage is now gone
  const afterDelete = await fetch(`${baseUrl}/api/books/${bookId}/nodes/${passageNode.id}`)
  assert.equal(afterDelete.status, 404)
})

test('E2E: Export endpoints (markdown and zip)', async () => {
  const booksRes = await fetch(`${baseUrl}/api/books`)
  const books = (await booksRes.json()).books
  const sampleBookId = books[0].id

  // Markdown export
  const mdRes = await fetch(`${baseUrl}/api/books/${sampleBookId}/export/markdown`)
  assert.equal(mdRes.status, 200)
  const mdText = await mdRes.text()
  assert.ok(mdText.includes(books[0].title))

  // Archive export
  const zipRes = await fetch(`${baseUrl}/api/books/${sampleBookId}/export/archive`)
  assert.equal(zipRes.status, 200)
  const zipBuffer = await zipRes.arrayBuffer()
  assert.ok(zipBuffer.byteLength > 100)
})

test('E2E: Client SPA routing and static assets serve correctly', async () => {
  // Test root HTML
  const rootRes = await fetch(`${baseUrl}/`)
  assert.equal(rootRes.status, 200)
  const html = await rootRes.text()
  assert.ok(html.includes('<!DOCTYPE html>') || html.includes('<html'))

  // Test SPA fallback on /books/:bookId/read
  const readRes = await fetch(`${baseUrl}/books/sample-id/read`)
  assert.equal(readRes.status, 200)
  const readHtml = await readRes.text()
  assert.ok(readHtml.includes('<!DOCTYPE html>') || readHtml.includes('<html'))
})

test('E2E: Node audio lifecycle (upload, stream with range, download, delete)', async () => {
  const booksRes = await fetch(`${baseUrl}/api/books`)
  const books = (await booksRes.json()).books
  const bookId = books[0].id

  // Create a node to attach audio to
  const nodeRes = await fetch(`${baseUrl}/api/books/${bookId}/nodes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'chapter',
      slNo: 'Audio-01',
      text: '# Chapter with Audio\nListening while reading.',
    }),
  })
  assert.equal(nodeRes.status, 201)
  const node = (await nodeRes.json()).node

  // Upload an MP3 audio buffer
  const fakeMp3Data = Buffer.from('ID3fake-mp3-audio-bytes-for-testing-range-playback')
  const uploadRes = await fetch(
    `${baseUrl}/api/books/${bookId}/nodes/${node.id}/audio?name=chapter1_recitation.mp3`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'audio/mpeg' },
      body: fakeMp3Data,
    },
  )
  assert.equal(uploadRes.status, 201)
  const uploadData = await uploadRes.json()
  assert.ok(uploadData.node.audioFile)
  assert.equal(uploadData.node.audioOriginalName, 'chapter1_recitation.mp3')

  // Stream audio (200)
  const streamRes = await fetch(`${baseUrl}/api/books/${bookId}/nodes/${node.id}/audio`)
  assert.equal(streamRes.status, 200)
  assert.equal(streamRes.headers.get('content-type'), 'audio/mpeg')
  const streamBuffer = Buffer.from(await streamRes.arrayBuffer())
  assert.deepEqual(streamBuffer, fakeMp3Data)

  // Stream with Range request
  const rangeRes = await fetch(`${baseUrl}/api/books/${bookId}/nodes/${node.id}/audio`, {
    headers: { Range: 'bytes=0-9' },
  })
  assert.equal(rangeRes.status, 206)
  const rangeBuffer = Buffer.from(await rangeRes.arrayBuffer())
  assert.equal(rangeBuffer.length, 10)

  // Download audio
  const downloadRes = await fetch(`${baseUrl}/api/books/${bookId}/nodes/${node.id}/audio?download=1`)
  assert.equal(downloadRes.status, 200)
  assert.ok(downloadRes.headers.get('content-disposition')?.includes('chapter1_recitation.mp3'))

  // Delete audio
  const deleteRes = await fetch(`${baseUrl}/api/books/${bookId}/nodes/${node.id}/audio`, {
    method: 'DELETE',
  })
  assert.equal(deleteRes.status, 200)
  const deletedNode = (await deleteRes.json()).node
  assert.equal(deletedNode.audioFile, null)
  assert.equal(deletedNode.audioOriginalName, null)

  // Subsequent fetch of audio should be 404
  const missingRes = await fetch(`${baseUrl}/api/books/${bookId}/nodes/${node.id}/audio`)
  assert.equal(missingRes.status, 404)
})
