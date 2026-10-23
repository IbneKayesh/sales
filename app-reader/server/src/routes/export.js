import { Router } from 'express'
import { assertBookId } from '../utils/fsx.js'
import { badRequest } from '../utils/errors.js'
import { exportAllBooksArchive, exportBookArchive, importBookArchive, buildMarkdownExport } from '../services/archive.js'
import { readBookMeta } from '../services/bookStore.js'

const router = Router()

function idList(value) {
  if (!value) return null
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

router.get('/books/:bookId/export/archive', async (req, res) => {
  const bookId = assertBookId(req.params.bookId)
  const { file, filename } = await exportBookArchive(bookId)
  res.download(file, filename)
})

router.get('/books/:bookId/export/markdown', async (req, res) => {
  const bookId = assertBookId(req.params.bookId)
  const { markdown, filename } = await buildMarkdownExport(bookId, {
    nodeIds: idList(req.query.nodeIds),
  })
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.send(markdown)
})

router.get('/export/all', async (req, res) => {
  const { file, filename } = await exportAllBooksArchive()
  res.download(file, filename)
})

router.post('/import', async (req, res) => {
  if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
    throw badRequest('Upload a ZIP archive exported from Book Thesis Lab')
  }
  const mode = req.query.mode === 'rename' ? 'rename' : 'reject'
  const result = await importBookArchive(req.body, { mode })
  const book = await readBookMeta(result.bookId)
  res.status(201).json({ ...result, book })
})

export default router
