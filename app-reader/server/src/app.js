import path from 'node:path'
import { existsSync } from 'node:fs'
import express from 'express'
import { MAX_IMPORT_MB, ROOT_DIR } from './config.js'
import booksRouter from './routes/books.js'
import nodesRouter from './routes/nodes.js'
import searchRouter from './routes/search.js'
import exportRouter from './routes/export.js'

export function createApp() {
  const app = express()
  app.disable('x-powered-by')

  app.use(
    '/api/import',
    express.raw({ type: () => true, limit: `${Math.max(1, MAX_IMPORT_MB)}mb` }),
  )
  app.use((req, res, next) => {
    if (req.method === 'POST' && req.path.endsWith('/audio')) {
      return express.raw({ type: () => true, limit: '100mb' })(req, res, next)
    }
    next()
  })
  app.use(express.json({ limit: '2mb' }))

  app.get('/api/health', (req, res) => {
    res.json({ ok: true, app: 'Book Thesis Lab' })
  })

  app.use('/api/books/:bookId/nodes', nodesRouter)
  app.use('/api/books', booksRouter)
  app.use('/api/search', searchRouter)
  app.use('/api', exportRouter)

  app.use('/api', (req, res) => {
    res.status(404).json({ error: 'API route not found' })
  })

  const clientDist = path.join(ROOT_DIR, 'client', 'dist')
  if (existsSync(clientDist)) {
    app.use(express.static(clientDist))
    app.use((req, res, next) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next()
      res.sendFile(path.join(clientDist, 'index.html'))
    })
  }

  // Express identifies error handlers by arity, so all four arguments are required.
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error)
    const status = error.status || (error.type === 'entity.too.large' ? 413 : 500)
    if (status >= 500) console.error('[api]', error)
    res.status(status).json({
      error: status >= 500 ? 'Something went wrong on the server' : error.message,
      details: error.details,
      code: error.code,
    })
  })

  return app
}
