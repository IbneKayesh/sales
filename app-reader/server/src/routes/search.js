import { Router } from 'express'
import { searchBooks } from '../services/search.js'
import { assertBookId } from '../utils/fsx.js'
import { badRequest } from '../utils/errors.js'

const router = Router()

router.get('/', async (req, res) => {
  const query = String(req.query.q || '').trim()
  if (query.length < 2) throw badRequest('Enter at least two characters to search')
  const bookId = req.query.bookId ? assertBookId(String(req.query.bookId)) : null
  const limit = req.query.limit ? Number(req.query.limit) : undefined
  res.json(await searchBooks({ query, bookId, limit }))
})

export default router
