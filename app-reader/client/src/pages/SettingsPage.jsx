import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Archive,
  BookPlus,
  Database,
  Download,
  FileText,
  HardDrive,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react'
import { api } from '../lib/api.js'
import { useApp } from '../context/app-context.js'
import { BookDialog } from '../components/dialogs.jsx'
import { Badge, ConfirmDialog, EmptyState, ErrorBlock, Spinner } from '../components/ui.jsx'
import { formatDate } from '../lib/format.js'

function Section({ icon: Icon, title, description, children }) {
  return (
    <section className="card">
      <div className="flex items-start gap-3 border-b border-stone-200 p-5">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-stone-100 text-stone-500">
          <Icon aria-hidden="true" className="h-4 w-4" />
        </span>
        <div>
          <h2 className="font-serif text-lg font-semibold text-stone-900">{title}</h2>
          <p className="mt-0.5 text-sm text-stone-500">{description}</p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}

export default function SettingsPage() {
  const { books, booksLoading, booksError, refreshBooks, showToast } = useApp()
  const [bookDialog, setBookDialog] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [addingSample, setAddingSample] = useState(false)

  const fileRef = useRef(null)
  const [importFile, setImportFile] = useState(null)
  const [renameCopy, setRenameCopy] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState(null)
  const [imported, setImported] = useState(null)

  const addSample = async () => {
    setAddingSample(true)
    try {
      const result = await api.createSampleBook()
      await refreshBooks()
      showToast(result.created ? 'The fictional sample book was created.' : 'The sample book already exists.')
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setAddingSample(false)
    }
  }

  const runImport = async (event) => {
    event.preventDefault()
    if (!importFile) {
      setImportError(new Error('Choose a .zip archive exported from Book Thesis Lab.'))
      return
    }
    setImporting(true)
    setImportError(null)
    setImported(null)
    try {
      const result = await api.importArchive(importFile, { mode: renameCopy ? 'rename' : null })
      setImported(result)
      setImportFile(null)
      if (fileRef.current) fileRef.current.value = ''
      await refreshBooks()
      showToast(`Imported “${result.title}”.`)
    } catch (error) {
      setImportError(error)
    } finally {
      setImporting(false)
    }
  }

  const confirmDelete = async () => {
    if (confirmText.trim() !== deleteTarget.title.trim()) {
      showToast('Type the book title exactly to confirm deletion.', 'error')
      return
    }
    setDeleting(true)
    try {
      await api.deleteBook(deleteTarget.id)
      setDeleteTarget(null)
      setConfirmText('')
      await refreshBooks()
      showToast('Book folder deleted.')
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-4 py-6 sm:px-6 lg:py-8">
      <header>
        <h1 className="font-serif text-2xl font-semibold text-stone-900">Settings and backup</h1>
        <p className="mt-1 text-sm text-stone-500">
          Everything lives on this computer. There is no account and no database — backups are your responsibility.
        </p>
      </header>

      <Section
        icon={BookPlus}
        title="Books"
        description="Create, edit, archive or delete a research project."
      >
        <div className="mb-4 flex flex-wrap gap-2">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setBookDialog({ book: null })}>
            <Plus aria-hidden="true" className="h-3.5 w-3.5" />
            New book
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addSample} disabled={addingSample}>
            {addingSample ? <Spinner className="h-3.5 w-3.5" /> : <FileText aria-hidden="true" className="h-3.5 w-3.5" />}
            Add fictional sample book
          </button>
        </div>

        {booksError ? <ErrorBlock error={booksError} onRetry={refreshBooks} /> : null}
        {booksLoading && !books.length ? <p className="text-sm text-stone-500">Loading books…</p> : null}
        {!booksLoading && !books.length ? (
          <EmptyState
            icon={BookPlus}
            title="No books yet"
            description="Create a book or add the sample to explore the app."
          />
        ) : null}

        <ul className="divide-y divide-stone-100">
          {books.map((book) => (
            <li key={book.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Link to={`/books/${book.id}`} className="truncate text-sm font-medium text-stone-800 hover:underline">
                    {book.title}
                  </Link>
                  {book.sample ? <Badge className="border-amber-300 bg-amber-50 text-amber-900">Sample</Badge> : null}
                </div>
                <p className="mt-0.5 text-xs text-stone-500">
                  {[book.author, book.year].filter(Boolean).join(' · ') || 'No author recorded'} · updated{' '}
                  {formatDate(book.updatedAt)}
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-stone-400">data/books/{book.id}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                <a className="btn btn-secondary btn-sm" href={api.archiveUrl(book.id)} title="Download ZIP archive">
                  <Archive aria-hidden="true" className="h-3.5 w-3.5" />
                  ZIP
                </a>
                <a
                  className="btn btn-secondary btn-sm"
                  href={api.markdownExportUrl(book.id)}
                  title="Export all research as one Markdown file"
                >
                  <Download aria-hidden="true" className="h-3.5 w-3.5" />
                  Markdown
                </a>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setBookDialog({ book })}
                  aria-label={`Edit ${book.title}`}
                >
                  <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    setDeleteTarget(book)
                    setConfirmText('')
                  }}
                  aria-label={`Delete ${book.title}`}
                >
                  <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        icon={HardDrive}
        title="Backup"
        description="Download a complete copy of every book, then keep it somewhere safe."
      >
        <div className="flex flex-wrap items-center gap-2">
          <a className="btn btn-primary btn-sm" href={api.backupUrl()}>
            <Download aria-hidden="true" className="h-3.5 w-3.5" />
            Download full backup (.zip)
          </a>
          <span className="text-xs text-stone-500">
            Includes every book folder with book.md, index.json and all Markdown files.
          </span>
        </div>
        <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-stone-600">
          <li>Download the backup ZIP and store it outside this project folder.</li>
          <li>Before moving computers, copy the whole <code className="font-mono text-xs">data/</code> folder as well.</li>
          <li>To restore, use the import panel below and choose whether to keep an existing copy.</li>
        </ol>
      </Section>

      <Section
        icon={Upload}
        title="Import a book archive"
        description="Archives are validated before anything is written. Unsafe paths are rejected."
      >
        <form onSubmit={runImport} className="space-y-3">
          <div>
            <label htmlFor="import-file" className="label">
              Archive file (.zip)
            </label>
            <input
              ref={fileRef}
              id="import-file"
              type="file"
              accept=".zip,application/zip"
              className="block w-full cursor-pointer rounded-md border border-stone-300 bg-white p-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-stone-100 file:px-3 file:py-1.5 file:text-xs file:font-medium"
              onChange={(event) => {
                setImportFile(event.target.files?.[0] || null)
                setImportError(null)
              }}
            />
          </div>
          <label className="flex items-start gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-stone-300"
              checked={renameCopy}
              onChange={(event) => setRenameCopy(event.target.checked)}
            />
            If a book with the same id exists, import a copy instead of failing.
          </label>
          {importError ? <ErrorBlock error={importError} /> : null}
          {imported ? (
            <p className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900" role="status">
              Imported “{imported.title}” ({imported.counts?.nodes || 0} nodes).{' '}
              <Link className="underline" to={`/books/${imported.bookId}`}>
                Open the imported book
              </Link>
              .
            </p>
          ) : null}
          <button type="submit" className="btn btn-primary btn-sm" disabled={importing || !importFile}>
            {importing ? <Spinner /> : <Upload aria-hidden="true" className="h-3.5 w-3.5" />}
            Import archive
          </button>
        </form>
      </Section>

      <Section
        icon={Database}
        title="Storage format"
        description="Files you can read, search and back up without this app."
      >
        <pre className="overflow-x-auto rounded-md bg-stone-900 p-4 text-[11px] leading-relaxed text-stone-100">
          {`data/books/<book-id>/
  book.md                  # bibliographic details + research question
  index.json               # nodes, notes, sources, themes, thesis metadata
  chapters/chapter-001.md  # chapter descriptions
  passages/passage-001.md  # transcriptions and word studies
  notes/note-001.md        # interpretations, observations, questions
  themes/theme-001.md      # theme descriptions
  sources/source-001.md    # bibliography + research notes
  thesis/section-001.md    # draft sections`}
        </pre>
        <div className="mt-3 grid gap-2 text-xs text-stone-500 sm:grid-cols-2">
          <p>
            <strong className="text-stone-700">Markdown</strong> is the source of truth for content.
          </p>
          <p>
            <strong className="text-stone-700">index.json</strong> is the source of truth for navigation and relationships.
          </p>
          <p>
            <strong className="text-stone-700">Exports</strong> are written to <code className="font-mono">data/exports/</code>.
          </p>
          <p>
            <strong className="text-stone-700">Server</strong> listens on <code className="font-mono">localhost:5174</code>;
            the client runs on <code className="font-mono">5173</code> in development.
          </p>
        </div>
      </Section>

      {bookDialog ? (
        <BookDialog
          book={bookDialog.book}
          onClose={() => setBookDialog(null)}
          onSaved={async () => {
            await refreshBooks()
            showToast(bookDialog.book ? 'Book details updated.' : 'Book created.')
          }}
        />
      ) : null}

      {deleteTarget ? (
        <ConfirmDialog
          open
          title="Delete this book folder?"
          message={`This permanently deletes "${deleteTarget.title}" and every Markdown file inside it. There is no undo. Download a backup first if you might need it.`}
          confirmLabel="Delete book permanently"
          busy={deleting}
          onClose={() => {
            setDeleteTarget(null)
            setConfirmText('')
          }}
          onConfirm={confirmDelete}
        >
          <div className="mt-4">
            <label htmlFor="delete-confirm" className="label">
              Type the book title to confirm
            </label>
            <input
              id="delete-confirm"
              className="input"
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              placeholder={deleteTarget.title}
              autoComplete="off"
            />
          </div>
        </ConfirmDialog>
      ) : null}
    </div>
  )
}
