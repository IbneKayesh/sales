import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search as SearchIcon } from 'lucide-react'
import { api } from '../lib/api.js'
import { useApp } from '../context/app-context.js'
import { Badge, EmptyState, ErrorBlock, LoadingBlock } from '../components/ui.jsx'
import { NODE_TYPE_LABEL, typeTone } from '../lib/format.js'

const SUGGESTIONS = ['freedom', 'identity', 'symbolism', 'power', 'narrative', 'memory']

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function Highlight({ text, query }) {
  const source = String(text || '')
  if (!query) return source
  const parts = source.split(new RegExp(`(${escapeRegExp(query)})`, 'ig'))
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index} className="rounded bg-amber-200 px-0.5 text-stone-900">
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    ),
  )
}

function resultTypeLabel(result) {
  if (result.type === 'book') return 'Book'
  return NODE_TYPE_LABEL[result.type] || result.type
}

function resultLink(result) {
  const base = `/books/${result.bookId}`
  if (result.nodeId) return `${base}?node=${result.nodeId}`
  return base
}

export default function SearchPage() {
  const { books } = useApp()
  const [params, setParams] = useSearchParams()
  const tagParam = params.get('tag') || ''
  const query = params.get('q') || tagParam
  const scope = params.get('bookId') || ''
  const [input, setInput] = useState(query)
  const [scopeDraft, setScopeDraft] = useState(scope)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setInput(query)
    setScopeDraft(scope)
  }, [query, scope])

  useEffect(() => {
    if (query.trim().length < 2) {
      setData(null)
      setError(null)
      return undefined
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    api
      .search({ q: query, bookId: scope || undefined })
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [query, scope])

  const submit = (event) => {
    event.preventDefault()
    const value = input.trim()
    if (value.length < 2) return
    const next = new URLSearchParams({ q: value })
    if (scopeDraft) next.set('bookId', scopeDraft)
    setParams(next)
  }

  const runSuggestion = (term) => {
    setInput(term)
    const next = new URLSearchParams({ q: term })
    if (scopeDraft) next.set('bookId', scopeDraft)
    setParams(next)
  }

  const scopeBook = books.find((book) => book.id === scope)

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-8">
      <h1 className="font-serif text-2xl font-semibold text-stone-900">Search research</h1>
      <p className="mt-1 text-sm text-stone-500">
        Search titles, passages, notes, themes and tags across the Markdown files on disk.
      </p>

      <form onSubmit={submit} className="card mt-4 p-4" role="search">
        <label htmlFor="search-input" className="label">
          Keywords {tagParam ? `(tag: #${tagParam})` : ''}
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="search-input"
            className="input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="e.g. lantern, memory, testimony"
            autoFocus
          />
          <select
            id="search-scope"
            aria-label="Search scope"
            className="input sm:w-56"
            value={scopeDraft}
            onChange={(event) => setScopeDraft(event.target.value)}
          >
            <option value="">All books</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary shrink-0" disabled={input.trim().length < 2}>
            <SearchIcon aria-hidden="true" className="h-4 w-4" />
            Search
          </button>
        </div>
        <p className="mt-2 text-xs text-stone-400">
          {scope ? `Searching inside ${scopeBook?.title || 'the selected book'}.` : 'Searching every book in the library.'}
        </p>
      </form>

      {!query || query.trim().length < 2 ? (
        <div className="mt-6">
          <EmptyState
            icon={SearchIcon}
            title="Enter at least two characters"
            description="Search for a phrase from a passage, a note, a tag, or a serial number. Try one of these:"
            action={
              <div className="flex flex-wrap justify-center gap-1.5">
                {SUGGESTIONS.map((term) => (
                  <button key={term} type="button" className="btn btn-secondary btn-sm" onClick={() => runSuggestion(term)}>
                    {term}
                  </button>
                ))}
              </div>
            }
          />
        </div>
      ) : loading ? (
        <LoadingBlock label={`Searching for “${query}”…`} />
      ) : error ? (
        <div className="mt-6">
          <ErrorBlock error={error} />
        </div>
      ) : data ? (
        <section className="mt-6" aria-live="polite">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-serif text-lg font-semibold text-stone-900">
              {data.total} result{data.total === 1 ? '' : 's'} for “{data.query}”
            </h2>
            <p className="text-xs text-stone-400">
              {data.searchedBooks} book{data.searchedBooks === 1 ? '' : 's'} searched
              {data.total > data.results.length ? ` · showing first ${data.results.length}` : ''}
            </p>
          </div>

          {data.results.length === 0 ? (
            <EmptyState
              icon={SearchIcon}
              title="No matches found"
              description="Try a shorter phrase, a different spelling, or search all books instead of one."
            />
          ) : (
            <ul className="space-y-3">
              {data.results.map((result, index) => (
                <li key={`${result.type}-${result.bookId}-${index}`} className="card p-4">
                  <div className="mb-1 flex flex-wrap items-center gap-1.5">
                    <Badge className={typeTone(result.type)}>{resultTypeLabel(result)}</Badge>
                    {result.slNo ? <Badge>sl. {result.slNo}</Badge> : null}
                    {scope ? null : <Badge>{result.bookTitle}</Badge>}
                    {(result.tags || []).map((tag) => (
                      <Badge key={tag}>#{tag}</Badge>
                    ))}
                  </div>
                  <Link to={resultLink(result)} className="font-serif text-base font-semibold text-stone-900 hover:underline">
                    <Highlight text={result.title} query={query} />
                  </Link>
                  <p className="mt-1 text-xs text-stone-500">
                    {[result.chapterTitle, result.subtitle].filter(Boolean).join(' · ')}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-stone-700">
                    <Highlight text={result.snippet} query={query} />
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}
    </div>
  )
}
