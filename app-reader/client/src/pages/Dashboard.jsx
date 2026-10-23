import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, BookPlus, Download, FileText, Hash, Newspaper } from 'lucide-react'
import { api } from '../lib/api.js'
import { useApp } from '../context/app-context.js'
import { BookDialog } from '../components/dialogs.jsx'
import { Badge, EmptyState, ErrorBlock, LoadingBlock } from '../components/ui.jsx'
import { cx, formatDate, pluralize } from '../lib/format.js'

/** The four counts the dashboard is built around, per the app spec. */
function countRow(counts) {
  return [
    ['Chapters', counts?.chapters || 0],
    ['Story', counts?.story || 0],
    ['Passage', counts?.passage || 0],
    ['Concept', counts?.concept || 0],
  ]
}

function Stat({ label, value }) {
  return (
    <div className="card p-4 text-center">
      <p className="text-2xl leading-none font-semibold text-stone-900 tabular-nums">{value}</p>
      <p className="mt-1.5 text-[11px] tracking-wide text-stone-500 uppercase">{label}</p>
    </div>
  )
}

function TagChip({ tag, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition',
        active
          ? 'border-amber-400 bg-amber-50 text-amber-900'
          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900',
      )}
    >
      <Hash aria-hidden="true" className="h-3 w-3" />
      {tag}
      <span className="text-stone-400 tabular-nums">{count}</span>
    </button>
  )
}

export default function Dashboard() {
  const { books, booksLoading, booksError, refreshBooks, showToast } = useApp()
  const [creating, setCreating] = useState(false)
  const [addingSample, setAddingSample] = useState(false)
  const [tagQuery, setTagQuery] = useState('')
  const navigate = useNavigate()

  const totals = useMemo(
    () =>
      books.reduce(
        (accumulator, book) => ({
          chapters: accumulator.chapters + (book.counts?.chapters || 0),
          story: accumulator.story + (book.counts?.story || 0),
          passage: accumulator.passage + (book.counts?.passage || 0),
          concept: accumulator.concept + (book.counts?.concept || 0),
        }),
        { chapters: 0, story: 0, passage: 0, concept: 0 },
      ),
    [books],
  )

  const tagNeedle = tagQuery.trim().toLowerCase()

  const addSample = async () => {
    setAddingSample(true)
    try {
      const result = await api.createSampleBook()
      await refreshBooks()
      showToast(result.created ? 'The fictional sample book was created.' : 'The sample book is already here.')
      navigate(`/books/${result.bookId}`)
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setAddingSample(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-amber-700 uppercase">Local-first research workspace</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-stone-900 sm:text-4xl">Book Thesis Lab</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">
          One hierarchy of nodes per book — chapters, passages, lines, words, notes and concepts — each with your own
          serial, tags, importance, related links and themes. Everything is stored as Markdown and JSON files on this
          computer — no database, no cloud.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" className="btn btn-primary" onClick={() => setCreating(true)}>
            <BookPlus aria-hidden="true" className="h-4 w-4" />
            Create a book
          </button>
          {books.length ? (
            <Link to={`/books/${books[0].id}`} className="btn btn-secondary">
              <BookOpen aria-hidden="true" className="h-4 w-4" />
              Continue with {books[0].title}
            </Link>
          ) : null}
          {books.length ? (
            <a className="btn btn-secondary" href={api.backupUrl()}>
              <Download aria-hidden="true" className="h-4 w-4" />
              Download full backup
            </a>
          ) : (
            <button type="button" className="btn btn-secondary" onClick={addSample} disabled={addingSample}>
              <FileText aria-hidden="true" className="h-4 w-4" />
              {addingSample ? 'Creating sample…' : 'Load the fictional sample book'}
            </button>
          )}
        </div>
      </section>

      {books.length ? (
        <>
          <section className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Library totals">
            <Stat label="Total chapters" value={totals.chapters} />
            <Stat label="Story" value={totals.story} />
            <Stat label="Passage" value={totals.passage} />
            <Stat label="Concept" value={totals.concept} />
          </section>

          <section className="mb-8 card p-4" aria-labelledby="tags-heading">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 id="tags-heading" className="font-serif text-lg font-semibold text-stone-900">
                  Tags
                </h2>
                <p className="text-xs text-stone-500">
                  Every tag across the library. Click one to list the nodes that carry it.
                </p>
              </div>
              <div className="relative">
                <label htmlFor="tag-search" className="sr-only">
                  Search tags
                </label>
                <input
                  id="tag-search"
                  className="input w-56 py-1.5 text-sm"
                  placeholder="Search tags…"
                  value={tagQuery}
                  onChange={(event) => setTagQuery(event.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(() => {
                const seen = new Map()
                for (const book of books) {
                  for (const { tag, count } of book.counts?.tags || []) {
                    seen.set(tag, (seen.get(tag) || 0) + count)
                  }
                }
                const all = [...seen.entries()]
                  .map(([tag, count]) => ({ tag, count }))
                  .filter((item) => !tagNeedle || item.tag.includes(tagNeedle))
                  .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
                if (!all.length) {
                  return (
                    <p className="text-sm text-stone-400">
                      {tagNeedle ? `No tags match “${tagQuery}”.` : 'No tags yet — add tags to nodes from the workspace.'}
                    </p>
                  )
                }
                return all.map((item) => <TagChip key={item.tag} {...item} onClick={() => navigate(`/search?tag=${encodeURIComponent(item.tag)}`)} />)
              })()}
            </div>
          </section>
        </>
      ) : null}

      <section aria-labelledby="books-heading">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 id="books-heading" className="font-serif text-xl font-semibold text-stone-900">
              Your books
            </h2>
            <p className="text-sm text-stone-500">
              Each book is a folder of readable research files. Open one to continue reading.
            </p>
          </div>
        </div>

        {booksError ? <ErrorBlock error={booksError} onRetry={refreshBooks} /> : null}
        {booksLoading && !books.length ? <LoadingBlock label="Loading books…" /> : null}

        {!booksLoading && !books.length && !booksError ? (
          <EmptyState
            icon={BookOpen}
            title="No books yet"
            description="Create a folder for the book you are studying, or load the fictional sample to explore the interface."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <button type="button" className="btn btn-primary" onClick={() => setCreating(true)}>
                  Create your first book
                </button>
                <button type="button" className="btn btn-secondary" onClick={addSample} disabled={addingSample}>
                  Load sample book
                </button>
              </div>
            }
          />
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          {books.map((book) => {
            const tags = (book.counts?.tags || []).filter(
              (item) => !tagNeedle || item.tag.includes(tagNeedle),
            )
            return (
              <article key={book.id} className="card flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link to={`/books/${book.id}`} className="font-serif text-lg font-semibold text-stone-900 hover:underline">
                      {book.title}
                    </Link>
                    <p className="mt-1 text-sm text-stone-500">
                      {[book.author, book.year, book.edition].filter(Boolean).join(' · ') || 'No bibliographic details yet'}
                    </p>
                  </div>
                  {book.sample ? (
                    <Badge className="border-amber-300 bg-amber-50 text-amber-900">Fictional sample</Badge>
                  ) : null}
                </div>

                <dl className="mt-4 grid grid-cols-4 gap-2 border-y border-stone-100 py-3 text-center">
                  {countRow(book.counts).map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-[10px] tracking-wide text-stone-400 uppercase">{label}</dt>
                      <dd className="text-sm font-semibold text-stone-800 tabular-nums">{value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tags.length ? (
                    tags.map((item) => (
                      <TagChip
                        key={item.tag}
                        {...item}
                        onClick={() => navigate(`/search?tag=${encodeURIComponent(item.tag)}&bookId=${book.id}`)}
                      />
                    ))
                  ) : (
                    <p className="text-xs text-stone-400">
                      {tagNeedle ? 'No matching tags in this book.' : `Total nodes: ${book.counts?.total || 0}`}
                    </p>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 text-xs text-stone-400">
                  <span>Updated {formatDate(book.updatedAt)}</span>
                  <span>{pluralize(book.counts?.total || 0, 'node')}</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to={`/books/${book.id}`} className="btn btn-primary btn-sm">
                    Open workspace
                    <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </Link>
                  <Link to={`/books/${book.id}/read`} className="btn btn-secondary btn-sm">
                    <Newspaper aria-hidden="true" className="h-3.5 w-3.5" />
                    Read
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          {
            title: 'Markdown is the source of truth',
            body: 'Every node is an individual .md file in nodes/. index.json only stores serials, hierarchy and relationships, so your writing stays readable in any editor.',
          },
          {
            title: 'One field set, no hidden structure',
            body: 'Each node carries sl. no., type, parent, importance, tags, text, related nodes, favourite, current topic and themes — that is the whole model.',
          },
          {
            title: 'Back up deliberately',
            body: 'Download the book archive or a full backup before moving computers. Import validates the archive before writing anything.',
          },
        ].map((item) => (
          <div key={item.title} className="rounded-lg border border-stone-200 bg-stone-50 p-4">
            <h3 className="text-sm font-semibold text-stone-800">{item.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-stone-500">{item.body}</p>
          </div>
        ))}
      </section>

      {creating ? (
        <BookDialog
          onClose={() => setCreating(false)}
          onSaved={async (result) => {
            await refreshBooks()
            showToast('Book created.')
            navigate(`/books/${result.book.id}`)
          }}
        />
      ) : null}
    </div>
  )
}
