import express, { Router } from 'express'
import { nodeCreateSchema, nodeUpdateSchema, validate } from '../validation/schemas.js'
import { assertBookId, assertId } from '../utils/fsx.js'
import { badRequest } from '../utils/errors.js'
import {
  attachNodeAudio,
  createNode,
  deleteNode,
  getNode,
  getNodeAudioFile,
  listNodes,
  removeNodeAudio,
  reorderNode,
  updateNode,
} from '../services/nodes.js'

const router = Router({ mergeParams: true })

router.get('/', async (req, res) => {
  const bookId = assertBookId(req.params.bookId)
  res.json(await listNodes(bookId))
})

router.get('/:nodeId/audio', async (req, res) => {
  const bookId = assertBookId(req.params.bookId)
  const nodeId = assertId(req.params.nodeId, 'node id')
  const { filePath, originalName } = await getNodeAudioFile(bookId, nodeId)
  res.setHeader('Cache-Control', 'no-cache')
  if (req.query.download === '1') {
    res.download(filePath, originalName)
  } else {
    res.sendFile(filePath, { acceptRanges: true })
  }
})

router.post(
  '/:nodeId/audio',
  express.raw({ type: () => true, limit: '100mb' }),
  async (req, res) => {
    const bookId = assertBookId(req.params.bookId)
    const nodeId = assertId(req.params.nodeId, 'node id')
    const name = req.query.name || req.headers['x-filename'] || 'audio.mp3'
    if (!req.body || !Buffer.isBuffer(req.body) || req.body.length === 0) {
      throw badRequest('Audio file data is empty')
    }
    const node = await attachNodeAudio(bookId, nodeId, String(name), req.body)
    res.status(201).json({ node })
  },
)

router.delete('/:nodeId/audio', async (req, res) => {
  const bookId = assertBookId(req.params.bookId)
  const nodeId = assertId(req.params.nodeId, 'node id')
  const node = await removeNodeAudio(bookId, nodeId)
  res.json({ node })
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
