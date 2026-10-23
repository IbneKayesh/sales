import 'dotenv/config'
import { BOOKS_DIR, EXPORTS_DIR } from '../src/config.js'
import { ensureDir } from '../src/utils/fsx.js'
import { seedSampleBook } from '../src/services/sample.js'

await ensureDir(BOOKS_DIR)
await ensureDir(EXPORTS_DIR)

const result = await seedSampleBook({ force: false })
if (result.created) {
  console.log(`Sample book created: ${result.bookId}`)
} else {
  console.log(`Sample book already present: ${result.bookId}`)
}
console.log('All quotations and sources in the sample are fictional.')
