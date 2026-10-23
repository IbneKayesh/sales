import { Router } from 'express'
import { nodeCreateSchema, nodeUpdateSchema, validate } from '../validation/schemas.js'
import { assertBookId, assertId } from '../utils/fsx.js'
import { badRequest } from '../utils/errors.js'
import { createNode, deleteNode, getNode, listNodes, reorderNode, updateNode } from '../services/nodes.js'

const router = Router({ mergeParams: true })

router.get('/', async (req, res) => {
  const bookId = assertBookId(req.params.bookId)
  res.json(await listNodes(bookId))
})

router.get('/:nodeId', async (req, res) => {
  const bookId = assertBookId(req.params.bookId)
  const nodeId = assertId(req.params.nodeId, 'node id')
  res.json(await getNode(bookId, nodeId))
})

router.post('/', async (req, res) => {
  const bookId = assertBookId(req.params.bookId)
  const body = validate(nodeCreateSchema, req.body)
  res.status(201).json({ node: await createNode(bookId, body) })
})

router.patch('/:nodeId', async (req, res) => {
  const bookId = assertBookId(req.params.bookId)
  const nodeId = assertId(req.params.nodeId, 'node id')
  const body = validate(nodeUpdateSchema, req.body)
  res.json({ node: await updateNode(bookId, nodeId, body) })
})

router.post('/:nodeId/reorder', async (req, res) => {
  const bookId = assertBookId(req.params.bookId)
  const nodeId = assertId(req.params.nodeId, 'node id')
  const direction = req.body?.direction
  if (!['up', 'down'].includes(direction)) throw badRequest('direction must be "up" or "down"')
  res.json({ node: await reorderNode(bookId, nodeId, direction) })
})

router.delete('/:nodeId', async (req, res) => {
  const bookId = assertBookId(req.params.bookId)
  const nodeId = assertId(req.params.nodeId, 'node id')
  res.json(await deleteNode(bookId, nodeId))
})

export default router
