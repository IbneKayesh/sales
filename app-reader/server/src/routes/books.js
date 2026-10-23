import { Router } from 'express'
import { bookCreateSchema, bookUpdateSchema, validate } from '../validation/schemas.js'
import { assertBookId } from '../utils/fsx.js'
import { badRequest, notFound } from '../utils/errors.js'
import {
  createBook,
  deleteBook,
  getBook,
  listBooks,
  readContent,
  updateBook,
} from '../services/bookStore.js'
import { seedSampleBook } from '../services/sample.js'

const router = Router()

router.get('/', async (req, res) => {
  res.json({ books: await listBooks() })
})

router.post('/', async (req, res) => {
  const body = validate(bookCreateSchema, req.body)
  const { book, index } = await createBook(body)
  res.status(201).json({ book, index })
})

router.post('/sample', async (req, res) => {
  const result = await seedSampleBook({ force: Boolean(req.query.force) })
  res.status(result.created ? 201 : 200).json(result)
})

router.get('/:bookId', async (req, res) => {
  const bookId = assertBookId(req.params.bookId)
  res.json(await getBook(bookId))
})

router.patch('/:bookId', async (req, res) => {
  const bookId = assertBookId(req.params.bookId)
  const body = validate(bookUpdateSchema, req.body)
  res.json({ book: await updateBook(bookId, body) })
})

router.delete('/:bookId', async (req, res) => {
  const bookId = assertBookId(req.params.bookId)
  if (req.query.confirm !== 'delete') {
    throw badRequest('Deleting a book requires confirm=delete')
  }
  await deleteBook(bookId)
  res.json({ deleted: true })
})

router.get('/:bookId/files', async (req, res) => {
  const bookId = assertBookId(req.params.bookId)
  const relativePath = String(req.query.path || '')
  if (!relativePath) throw notFound('A path query parameter is required')
  res.json({ path: relativePath, content: await readContent(bookId, relativePath) })
})

export default router
