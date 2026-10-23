import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  BookOpen,
  ChevronDown,
  LayoutDashboard,
  Menu,
  Network,
  Newspaper,
  Search,
  Settings,
  X,
} from 'lucide-react'
import { api } from '../lib/api.js'
import { useApp } from '../context/app-context.js'
import { IMPORTANCE, NODE_TYPE_LABEL, NODE_TYPES, cx } from '../lib/format.js'
import { descendantIds, flattenNodes } from '../lib/hierarchy.js'
import BookTree from './BookTree.jsx'
import { ErrorBlock, Spinner } from './ui.jsx'

function NavItem({ to, icon: Icon, children, end, count }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => cx('sidebar-link', isActive && 'sidebar-link-active')}
    >
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span className="flex-1">{children}</span>
      {typeof count === 'number' ? <span className="text-xs text-stone-400 tabular-nums">{count}</span> : null}
    </NavLink>
  )
}

export default function AppShell() {
  const { bookId } = useParams()
  const { books, booksLoading, booksError } = useApp()
  const [bookData, setBookData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({ text: '', type: '', importance: '', chapter: '', tag: '' })
  const navigate = useNavigate()
  const location = useLocation()

  const loadBook = useCallback(async () => {
    if (!bookId) {
      setBookData(null)
      setError(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await api.getBook(bookId)
      setBookData(data)
    } catch (err) {
      setError(err)
      setBookData(null)
    } finally {
      setLoading(false)
    }
  }, [bookId])

  useEffect(() => {
    setBookData(null)
    loadBook()
  }, [loadBook])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname, location.search])

  const selectedNodeId = new URLSearchParams(location.search).get('node')
  const currentBook = bookData?.book
  const nodes = useMemo(() => bookData?.index?.nodes || [], [bookData])
  const chapters = nodes.filter((node) => node.type === 'chapter' || node.type === 'story')
  const allTags = useMemo(() => [...new Set(nodes.flatMap((node) => node.tags || []))].sort(), [nodes])
  const filtersActive = Object.values(filters).some(Boolean)

  const filteredNodes = useMemo(() => {
    const chapterScope = filters.chapter
      ? new Set([filters.chapter, ...descendantIds(nodes, filters.chapter)])
      : null
    const needle = filters.text.trim().toLowerCase()
    return flattenNodes(nodes).filter((node) => {
      if (needle && !(node.label || '').toLowerCase().includes(needle)) return false
      if (filters.type && node.type !== filters.type) return false
      if (filters.importance && node.importance !== filters.importance) return false
      if (chapterScope && !chapterScope.has(node.id)) return false
      if (filters.tag && !(node.tags || []).includes(filters.tag)) return false
      return true
    })
  }, [nodes, filters])

  const submitSearch = (event) => {
    event.preventDefault()
    const query = searchTerm.trim()
    if (!query) return
    const params = new URLSearchParams({ q: query })
    if (bookId) params.set('bookId', bookId)
    navigate(`/search?${params.toString()}`)
    setSidebarOpen(false)
  }

  const outletContext = {
    bookId: bookId || null,
    book: currentBook || null,
    index: bookData?.index || null,
    tree: bookData?.tree || [],
    counts: bookData?.counts || null,
    refresh: loadBook,
    loading: loading || (!!bookId && !bookData && !error),
    error,
  }

  return (
    <div className="min-h-screen lg:flex">
      <div
        className={cx('fixed inset-0 z-40 bg-stone-900/40 lg:hidden', sidebarOpen ? 'block' : 'hidden')}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={cx(
          'fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] shrink-0 flex-col border-r border-stone-200 bg-stone-50 transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-80 lg:max-w-none lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Navigation"
      >
        <div className="flex items-center justify-between gap-2 border-b border-stone-200 px-4 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-stone-900 text-amber-300">
              <BookOpen aria-hidden="true" className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-serif text-base leading-tight font-semibold text-stone-900">
                Book Thesis Lab
              </span>
              <span className="block text-[11px] tracking-wide text-stone-500 uppercase">Reading · Evidence · Argument</span>
            </span>
          </Link>
          <button
            type="button"
            className="btn btn-ghost btn-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="scrollbar-thin flex-1 space-y-5 overflow-y-auto px-3 py-4">
          <div>
            <div className="mb-1 flex items-center justify-between px-1">
              <label htmlFor="book-select" className="text-[11px] font-semibold tracking-wide text-stone-500 uppercase">
                Current book
              </label>
              {booksLoading ? <Spinner className="h-3 w-3 text-stone-400" /> : null}
            </div>
            <div className="relative">
              <select
                id="book-select"
                className="input appearance-none pr-8 text-sm"
                value={bookId || ''}
                onChange={(event) => {
                  if (event.target.value) navigate(`/books/${event.target.value}`)
                  else navigate('/')
                }}
              >
                <option value="">{books.length ? 'Select a book…' : 'No books yet'}</option>
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute top-2.5 right-2.5 h-4 w-4 text-stone-400"
              />
            </div>
            {booksError ? <p className="mt-1 text-xs text-red-700">Could not load books.</p> : null}
          </div>

          <form onSubmit={submitSearch} role="search">
            <label htmlFor="sidebar-search" className="sr-only">
              Search research
            </label>
            <div className="relative">
              <Search aria-hidden="true" className="pointer-events-none absolute top-2.5 left-2.5 h-4 w-4 text-stone-400" />
              <input
                id="sidebar-search"
                className="input pr-2 pl-8 text-sm"
                placeholder="Search notes and passages…"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </form>

          <nav className="space-y-0.5" aria-label="Main">
            <NavItem to="/" icon={LayoutDashboard} end>
              Dashboard
            </NavItem>
            {bookId ? (
              <>
                <NavItem to={`/books/${bookId}`} icon={Network} end>
                  Workspace
                </NavItem>
                <NavItem to={`/books/${bookId}/read`} icon={Newspaper} end>
                  Reading mode
                </NavItem>
                <NavItem to={`/search?bookId=${bookId}`} icon={Search} end>
                  Search this book
                </NavItem>
              </>
            ) : (
              <NavItem to="/search" icon={Search} end>
                Search
              </NavItem>
            )}
            <NavItem to="/settings" icon={Settings}>
              Settings & backup
            </NavItem>
          </nav>

          {bookId ? (
            <div className="border-t border-stone-200 pt-4">
              <div className="mb-2 flex items-center justify-between px-1">
                <h2 className="text-[11px] font-semibold tracking-wide text-stone-500 uppercase">Research hierarchy</h2>
                {bookData?.counts ? (
                  <span className="text-[11px] text-stone-400 tabular-nums">{bookData.counts.nodes} nodes</span>
                ) : null}
              </div>
              <div className="mb-2 space-y-1.5">
                <label htmlFor="node-filter-text" className="sr-only">
                  Filter nodes by title
                </label>
                <input
                  id="node-filter-text"
                  className="input py-1.5 text-xs"
                  placeholder="Filter nodes…"
                  value={filters.text}
                  onChange={(event) => setFilters((current) => ({ ...current, text: event.target.value }))}
                />
                <div className="grid grid-cols-2 gap-1.5">
                  <select
                    aria-label="Filter by node type"
                    className="input py-1.5 text-xs"
                    value={filters.type}
                    onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value }))}
                  >
                    <option value="">All types</option>
                    {NODE_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Filter by importance"
                    className="input py-1.5 text-xs"
                    value={filters.importance}
                    onChange={(event) => setFilters((current) => ({ ...current, importance: event.target.value }))}
                  >
                    <option value="">Any importance</option>
                    {IMPORTANCE.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Filter by chapter"
                    className="input py-1.5 text-xs"
                    value={filters.chapter}
                    onChange={(event) => setFilters((current) => ({ ...current, chapter: event.target.value }))}
                  >
                    <option value="">All chapters</option>
                    {chapters.map((chapter) => (
                      <option key={chapter.id} value={chapter.id}>
                        {chapter.label || chapter.type}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Filter by tag"
                    className="input py-1.5 text-xs"
                    value={filters.tag}
                    onChange={(event) => setFilters((current) => ({ ...current, tag: event.target.value }))}
                  >
                    <option value="">All tags</option>
                    {allTags.map((tag) => (
                      <option key={tag} value={tag}>
                        #{tag}
                      </option>
                    ))}
                  </select>
                </div>
                {filtersActive ? (
                  <div className="flex items-center justify-between px-1 text-[11px] text-stone-500">
                    <span>
                      {filteredNodes.length} matching {filteredNodes.length === 1 ? 'node' : 'nodes'}
                    </span>
                    <button
                      type="button"
                      className="text-amber-800 underline"
                      onClick={() => setFilters({ text: '', type: '', importance: '', chapter: '', tag: '' })}
                    >
                      Clear filters
                    </button>
                  </div>
                ) : null}
              </div>
              {loading && !bookData ? (
                <div className="flex items-center gap-2 px-1 py-2 text-xs text-stone-500">
                  <Spinner className="h-3 w-3" /> Loading hierarchy…
                </div>
              ) : null}
              {error ? (
                <ErrorBlock error={error} onRetry={loadBook} />
              ) : filtersActive ? (
                filteredNodes.length ? (
                  <ul className="space-y-0.5">
                    {filteredNodes.map((node) => (
                      <li key={node.id}>
                        <Link
                          to={`/books/${bookId}?node=${node.id}`}
                          className={cx(
                            'flex items-center justify-between gap-2 rounded-md py-1.5 pr-1 text-[13px]',
                            node.id === selectedNodeId
                              ? 'bg-white font-medium text-stone-900 shadow-sm ring-1 ring-stone-200'
                              : 'text-stone-600 hover:bg-stone-200/50 hover:text-stone-900',
                          )}
                          style={{ paddingLeft: `${8 + Math.min(node.depth, 6) * 8}px` }}
                        >
                          <span className="truncate">
                            {node.slNo ? `${node.slNo}. ` : ''}
                            {node.label || node.type}
                          </span>
                          <span className="shrink-0 text-[10px] text-stone-400">
                            {NODE_TYPE_LABEL[node.type] || node.type}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="rounded-md border border-dashed border-stone-300 px-3 py-4 text-xs text-stone-500">
                    No nodes match these filters.
                  </p>
                )
              ) : (
                <BookTree tree={bookData?.tree || []} bookId={bookId} selectedId={selectedNodeId} />
              )}
              {currentBook?.sample ? (
                <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-2 text-[11px] leading-relaxed text-amber-900">
                  This is the fictional sample book. All quotations and sources are invented.
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="border-t border-stone-200 px-4 py-3">
          <Link to="/settings" className="text-xs text-stone-500 hover:text-stone-800">
            Files are stored on this computer in <code className="font-mono">data/books/</code>
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-stone-200 bg-stone-50/90 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu aria-hidden="true" className="h-4 w-4" />
          </button>
          <span className="truncate font-serif text-sm font-semibold text-stone-900">
            {currentBook?.title || 'Book Thesis Lab'}
          </span>
          <Link to="/search" className="btn btn-secondary btn-sm" aria-label="Search">
            <Search aria-hidden="true" className="h-4 w-4" />
          </Link>
        </header>

        <main className="min-w-0 flex-1">
          <Outlet context={outletContext} />
        </main>
      </div>
    </div>
  )
}
