import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))

export const ROOT_DIR = path.resolve(here, '..', '..')
export const DATA_DIR = path.resolve(ROOT_DIR, process.env.DATA_DIR || 'data')
export const BOOKS_DIR = path.join(DATA_DIR, 'books')
export const EXPORTS_DIR = path.join(DATA_DIR, 'exports')

export const PORT = Number(process.env.PORT || 5174)
export const MAX_IMPORT_MB = Number(process.env.MAX_IMPORT_MB || 50)

/**
 * Directories in a book folder that are allowed to hold Markdown content.
 * Schema v2 keeps every node in `nodes/`; the legacy names are still accepted
 * so old backups can be imported and migrated.
 */
export const CONTENT_DIRS = ['nodes']
export const LEGACY_CONTENT_DIRS = ['chapters', 'passages', 'notes', 'themes', 'sources', 'thesis']

export const SCHEMA_VERSION = 2
