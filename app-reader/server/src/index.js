import 'dotenv/config'
import { createApp } from './app.js'
import { BOOKS_DIR, DATA_DIR, EXPORTS_DIR, PORT } from './config.js'
import { ensureDir } from './utils/fsx.js'
import { listBooks } from './services/bookStore.js'
import { migrateAllBooks } from './services/migrate.js'
import { seedSampleBook } from './services/sample.js'

async function bootstrap() {
  await ensureDir(BOOKS_DIR)
  await ensureDir(EXPORTS_DIR)

  const migrated = await migrateAllBooks()
  for (const report of migrated) {
    console.log(`[data] Migrated "${report.bookId}" to the simplified node format (${report.nodes} nodes).`)
  }

  const books = await listBooks()
  if (books.length === 0 && process.env.SEED_SAMPLE !== 'false') {
    try {
      const result = await seedSampleBook()
      if (result.created) {
        console.log('[data] Created the fictional sample book so the app is not empty.')
        console.log('[data] Delete it from Settings when you start your own research.')
      }
    } catch (error) {
      console.warn('[data] Could not create the sample book:', error.message)
    }
  }

  const app = createApp()
  const server = app.listen(PORT, () => {
    console.log(`Book Thesis Lab API listening on http://localhost:${PORT}`)
    console.log(`Research files live in ${DATA_DIR}`)
  })

  const shutdown = (signal) => {
    console.log(`\n[server] ${signal} received, shutting down.`)
    server.close(() => process.exit(0))
  }
  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

bootstrap().catch((error) => {
  console.error('Failed to start Book Thesis Lab:', error)
  process.exit(1)
})
