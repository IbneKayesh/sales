import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useOutletContext, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  List,
  Maximize2,
  Minimize2,
  Star,
} from 'lucide-react'
import { api } from '../lib/api.js'
import {
  Badge,
  EmptyState,
  ErrorBlock,
  LoadingBlock,
  MarkdownView,
  Spinner,
} from '../components/ui.jsx'
import { flattenNodes, nodeDisplay, nodeLabel } from '../lib/hierarchy.js'
import {
  NODE_TYPE_LABEL,
  cx,
  importanceLabel,
  importanceTone,
  pageLabel,
  typeTone,
} from '../lib/format.js'

const THEMES = {
  paper: {
    name: 'Warm Paper',
    bg: 'bg-amber-50/60',
    sheetBg: 'bg-[#fcfaf6]',
    text: 'text-stone-800',
    subtext: 'text-stone-500',
    border: 'border-amber-200/70',
    headerBg: 'bg-amber-100/40',
  },
  white: {
    name: 'Clean White',
    bg: 'bg-stone-100',
    sheetBg: 'bg-white',
    text: 'text-stone-900',
    subtext: 'text-stone-500',
    border: 'border-stone-200',
    headerBg: 'bg-stone-50',
  },
  sepia: {
    name: 'Sepia Book',
    bg: 'bg-[#f4ecd8]',
    sheetBg: 'bg-[#faf4e6]',
    text: 'text-[#433422]',
    subtext: 'text-[#846b4c]',
    border: 'border-[#dfd3b9]',
    headerBg: 'bg-[#ede3cb]',
  },
  dark: {
    name: 'Night Desk',
    bg: 'bg-stone-950',
    sheetBg: 'bg-stone-900',
    text: 'text-stone-100',
    subtext: 'text-stone-400',
    border: 'border-stone-800',
    headerBg: 'bg-stone-900/90',
  },
}

const FONT_SIZES = {
  sm: { label: 'Small', prose: 'text-sm leading-relaxed' },
  base: { label: 'Medium', prose: 'text-base leading-relaxed' },
  lg: { label: 'Large', prose: 'text-lg leading-loose' },
  xl: { label: 'Extra Large', prose: 'text-xl leading-loose' },
}

export default function ReadingMode() {
  const { bookId, book, index, loading, error, refresh } = useOutletContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedNodeId = searchParams.get('node')

  const [themeKey, setThemeKey] = useState('paper')
  const [fontSizeKey, setFontSizeKey] = useState('base')
  const [fontFamily, setFontFamily] = useState('serif') // serif | sans | mono
  const [showToc, setShowToc] = useState(false)
  const [focusMode, setFocusMode] = useState(false)

  // Current node text loading
  const [nodeDetail, setNodeDetail] = useState(null)
  const [nodeLoading, setNodeLoading] = useState(false)
  const [nodeError, setNodeError] = useState(null)
  const textCache = useRef(new Map())

  const nodes = useMemo(() => index?.nodes || [], [index])
  const orderedNodes = useMemo(() => flattenNodes(nodes), [nodes])

  // Active page index
  const currentIndex = useMemo(() => {
    if (!orderedNodes.length) return -1
    if (!selectedNodeId) return 0
    const found = orderedNodes.findIndex((item) => item.id === selectedNodeId)
    return found === -1 ? 0 : found
  }, [orderedNodes, selectedNodeId])

  const currentNode = orderedNodes[currentIndex] || null

  // Ensure query param is synced
  useEffect(() => {
    if (!orderedNodes.length) return
    if (!selectedNodeId && orderedNodes[0]) {
      setSearchParams({ node: orderedNodes[0].id }, { replace: true })
    }
  }, [orderedNodes, selectedNodeId, setSearchParams])

  // Fetch node text
  const fetchNode = useCallback(
    async (nodeId) => {
      if (!bookId || !nodeId) return
      if (textCache.current.has(nodeId)) {
        setNodeDetail(textCache.current.get(nodeId))
        return
      }
      setNodeLoading(true)
      setNodeError(null)
      try {
        const data = await api.getNode(bookId, nodeId)
        textCache.current.set(nodeId, data)
        setNodeDetail(data)
      } catch (err) {
        setNodeError(err)
      } finally {
        setNodeLoading(false)
      }
    },
    [bookId],
  )

  useEffect(() => {
    if (currentNode?.id) {
      fetchNode(currentNode.id)
    }
  }, [currentNode?.id, fetchNode])

  // Prefetch adjacent pages for zero-latency turning
  useEffect(() => {
    if (!bookId || currentIndex === -1) return
    const prev = orderedNodes[currentIndex - 1]
    const next = orderedNodes[currentIndex + 1]
    if (prev && !textCache.current.has(prev.id)) {
      api.getNode(bookId, prev.id).then((d) => textCache.current.set(prev.id, d)).catch(() => {})
    }
    if (next && !textCache.current.has(next.id)) {
      api.getNode(bookId, next.id).then((d) => textCache.current.set(next.id, d)).catch(() => {})
    }
  }, [bookId, currentIndex, orderedNodes])

  // Navigation handlers
  const goToPage = useCallback(
    (index) => {
      if (index < 0 || index >= orderedNodes.length) return
      const target = orderedNodes[index]
      if (target) {
        setSearchParams({ node: target.id })
      }
    },
    [orderedNodes, setSearchParams],
  )

  const goPrev = useCallback(() => {
    if (currentIndex > 0) goToPage(currentIndex - 1)
  }, [currentIndex, goToPage])

  const goNext = useCallback(() => {
    if (currentIndex < orderedNodes.length - 1) goToPage(currentIndex + 1)
  }, [currentIndex, orderedNodes.length, goToPage])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp' || event.key === 'k') {
        event.preventDefault()
        goPrev()
      } else if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === 'j') {
        event.preventDefault()
        goNext()
      } else if (event.key === 'f') {
        setFocusMode((prev) => !prev)
      } else if (event.key === 'Escape') {
        setShowToc(false)
        setFocusMode(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goPrev, goNext])

  if (!bookId) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <EmptyState
          icon={FileText}
          title="Choose a book to read"
          description="Select a book from the sidebar, or return to the dashboard."
          action={
            <Link to="/" className="btn btn-primary">
              Go to dashboard
            </Link>
          }
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <ErrorBlock error={error} onRetry={refresh} />
      </div>
    )
  }

  if (loading && !index) return <LoadingBlock label="Opening book reader…" />

  if (!orderedNodes.length) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <EmptyState
          icon={BookOpen}
          title="No content to read yet"
          description="Add chapters and passages in the research workspace first."
          action={
            <Link to={`/books/${bookId}`} className="btn btn-primary">
              Open workspace
            </Link>
          }
        />
      </div>
    )
  }

  const activeTheme = THEMES[themeKey] || THEMES.paper
  const activeFontSize = FONT_SIZES[fontSizeKey] || FONT_SIZES.base
  const totalPages = orderedNodes.length
  const pageNumber = currentIndex + 1

  const fontClass =
    fontFamily === 'serif' ? 'font-serif' : fontFamily === 'mono' ? 'font-mono' : 'font-sans'

  return (
    <div className={cx('min-h-screen transition-colors duration-150', activeTheme.bg)}>
      {/* Top Controls Header */}
      {!focusMode && (
        <header
          className={cx(
            'sticky top-0 z-30 flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5 backdrop-blur-md transition-colors sm:px-6',
            activeTheme.border,
            activeTheme.headerBg,
          )}
        >
          <div className="flex items-center gap-3">
            <Link
              to={`/books/${bookId}?node=${currentNode?.id || ''}`}
              className={cx('btn btn-ghost btn-sm', activeTheme.text)}
              title="Return to Workspace"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              <span className="hidden sm:inline">Workspace</span>
            </Link>
            <div className="h-4 w-px bg-stone-300 dark:bg-stone-700" />
            <button
              type="button"
              onClick={() => setShowToc((v) => !v)}
              className={cx(
                'btn btn-sm flex items-center gap-1.5',
                showToc ? 'btn-primary' : 'btn-secondary',
              )}
              aria-label="Table of contents"
              aria-expanded={showToc}
            >
              <List aria-hidden="true" className="h-3.5 w-3.5" />
              <span>Contents</span>
            </button>
            <span className={cx('hidden truncate font-serif text-sm font-medium md:inline', activeTheme.text)}>
              {book?.title}
            </span>
          </div>

          {/* Reader Preferences (Theme, Font Size, Font Family, Fullscreen) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Font Family */}
            <div className="flex items-center rounded-md border border-stone-200 bg-white/70 p-0.5 text-xs shadow-xs dark:border-stone-700 dark:bg-stone-800">
              <button
                type="button"
                onClick={() => setFontFamily('serif')}
                className={cx(
                  'rounded px-2 py-0.5 font-serif transition-colors',
                  fontFamily === 'serif' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 dark:text-stone-300',
                )}
                title="Serif font"
              >
                Serif
              </button>
              <button
                type="button"
                onClick={() => setFontFamily('sans')}
                className={cx(
                  'rounded px-2 py-0.5 font-sans transition-colors',
                  fontFamily === 'sans' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 dark:text-stone-300',
                )}
                title="Sans-serif font"
              >
                Sans
              </button>
            </div>

            {/* Font Size */}
            <div className="flex items-center rounded-md border border-stone-200 bg-white/70 p-0.5 text-xs shadow-xs dark:border-stone-700 dark:bg-stone-800">
              <button
                type="button"
                onClick={() => {
                  const sizes = ['sm', 'base', 'lg', 'xl']
                  const idx = sizes.indexOf(fontSizeKey)
                  if (idx > 0) setFontSizeKey(sizes[idx - 1])
                }}
                disabled={fontSizeKey === 'sm'}
                className="px-1.5 py-0.5 text-xs font-semibold disabled:opacity-30"
                title="Decrease font size"
              >
                A-
              </button>
              <span className="px-1 text-[11px] text-stone-400">Aa</span>
              <button
                type="button"
                onClick={() => {
                  const sizes = ['sm', 'base', 'lg', 'xl']
                  const idx = sizes.indexOf(fontSizeKey)
                  if (idx < sizes.length - 1) setFontSizeKey(sizes[idx + 1])
                }}
                disabled={fontSizeKey === 'xl'}
                className="px-1.5 py-0.5 text-sm font-semibold disabled:opacity-30"
                title="Increase font size"
              >
                A+
              </button>
            </div>

            {/* Color Theme Selector */}
            <select
              value={themeKey}
              onChange={(e) => setThemeKey(e.target.value)}
              className="rounded-md border border-stone-200 bg-white/70 px-2 py-1 text-xs text-stone-700 shadow-xs focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
              aria-label="Color theme"
            >
              {Object.entries(THEMES).map(([key, t]) => (
                <option key={key} value={key}>
                  {t.name}
                </option>
              ))}
            </select>

            {/* Focus / Fullscreen Mode */}
            <button
              type="button"
              onClick={() => setFocusMode(true)}
              className={cx('btn btn-ghost btn-sm', activeTheme.text)}
              title="Focus mode (Esc to exit, F to toggle)"
              aria-label="Focus mode"
            >
              <Maximize2 aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </header>
      )}

      {/* Focus Mode floating exit button */}
      {focusMode && (
        <button
          type="button"
          onClick={() => setFocusMode(false)}
          className="fixed top-4 right-4 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-stone-900/80 text-white shadow-lg backdrop-blur-md transition hover:bg-stone-900"
          title="Exit focus mode (Esc)"
          aria-label="Exit focus mode"
        >
          <Minimize2 aria-hidden="true" className="h-4 w-4" />
        </button>
      )}

      {/* Main Reader Layout */}
      <div className="relative mx-auto flex max-w-7xl items-start justify-center px-4 py-6 sm:px-6 sm:py-10">
        {/* Table of Contents Drawer/Sidebar */}
        {showToc && (
          <aside
            className={cx(
              'fixed inset-y-0 left-0 z-40 w-80 max-w-[85vw] overflow-y-auto border-r p-4 shadow-2xl backdrop-blur-lg transition-transform lg:static lg:mr-6 lg:h-[calc(100vh-6rem)] lg:w-72 lg:rounded-lg lg:border lg:shadow-md',
              activeTheme.sheetBg,
              activeTheme.border,
            )}
            aria-label="Table of contents"
          >
            <div className="mb-3 flex items-center justify-between border-b pb-2 dark:border-stone-800">
              <h2 className={cx('font-serif text-sm font-semibold', activeTheme.text)}>Table of Contents</h2>
              <button
                type="button"
                onClick={() => setShowToc(false)}
                className="btn btn-ghost btn-sm lg:hidden"
                aria-label="Close contents"
              >
                ✕
              </button>
            </div>
            <nav className="space-y-1 text-xs">
              {orderedNodes.map((n, idx) => {
                const isSelected = idx === currentIndex
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => {
                      goToPage(idx)
                      if (window.innerWidth < 1024) setShowToc(false)
                    }}
                    style={{ paddingLeft: `${Math.min(n.depth, 5) * 12 + 8}px` }}
                    className={cx(
                      'flex w-full items-center gap-1.5 rounded py-1.5 pr-2 text-left transition',
                      isSelected
                        ? 'bg-amber-100 font-semibold text-amber-950 dark:bg-stone-800 dark:text-amber-300'
                        : 'text-stone-600 hover:bg-stone-200/50 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200',
                    )}
                  >
                    <span className="shrink-0 text-[10px] text-stone-400 tabular-nums">
                      {n.slNo ? `${n.slNo}.` : `${idx + 1}.`}
                    </span>
                    <span className="truncate">{nodeLabel(n)}</span>
                  </button>
                )
              })}
            </nav>
          </aside>
        )}

        {/* The PDF / Book Leaf Page */}
        <main className="w-full max-w-3xl min-w-0 flex-1">
          <article
            className={cx(
              'relative mx-auto rounded-lg border p-6 shadow-xl transition-all duration-150 sm:p-12 md:p-16',
              activeTheme.sheetBg,
              activeTheme.border,
              'min-h-[720px] flex flex-col justify-between',
            )}
            aria-label={`Page ${pageNumber}: ${currentNode?.label || currentNode?.type}`}
          >
            {/* Top Running Header of the Page */}
            <div>
              <div
                className={cx(
                  'flex items-center justify-between border-b pb-3 text-[11px] tracking-wider uppercase',
                  activeTheme.border,
                  activeTheme.subtext,
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-serif font-semibold tracking-normal text-stone-700 dark:text-stone-300">
                    {book?.title || 'Book'}
                  </span>
                  {currentNode?.slNo ? <span>· sl. {currentNode.slNo}</span> : null}
                  {pageLabel(currentNode) ? <span>· {pageLabel(currentNode)}</span> : null}
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Badge className={typeTone(currentNode?.type)}>
                    {NODE_TYPE_LABEL[currentNode?.type] || currentNode?.type}
                  </Badge>
                  {currentNode?.importance === 'high' ? (
                    <Badge className={importanceTone(currentNode.importance)}>
                      {importanceLabel(currentNode.importance)}
                    </Badge>
                  ) : null}
                  {currentNode?.favorite ? (
                    <Star aria-hidden="true" className="h-3 w-3 fill-amber-400 text-amber-500" />
                  ) : null}
                </div>
              </div>

              {/* Node Title / Heading */}
              <div className="mt-8 mb-6">
                <h1
                  className={cx(
                    'font-serif text-2xl font-semibold sm:text-3xl lg:text-4xl leading-tight',
                    activeTheme.text,
                  )}
                >
                  {nodeDetail?.text
                    ? (nodeDetail.text.split('\n').find((l) => l.trim()) || '').replace(/^#{1,6}\s+/, '')
                    : currentNode?.label || NODE_TYPE_LABEL[currentNode?.type] || 'Untitled'}
                </h1>

                {/* Tags and themes */}
                {((currentNode?.tags && currentNode.tags.length > 0) || currentNode?.themes) && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                    {(currentNode?.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-stone-200/60 px-2 py-0.5 text-[11px] font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300"
                      >
                        #{tag}
                      </span>
                    ))}
                    {currentNode?.themes ? (
                      <span className={cx('italic', activeTheme.subtext)}>
                        Theme: {currentNode.themes}
                      </span>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Page Body Content (Markdown) */}
              <div className={cx('mt-6', fontClass, activeFontSize.prose, activeTheme.text)}>
                {nodeLoading ? (
                  <div className="py-16 text-center">
                    <Spinner className="mx-auto h-6 w-6 text-stone-400" />
                    <p className="mt-2 text-xs text-stone-400">Loading page content…</p>
                  </div>
                ) : nodeError ? (
                  <div className="py-8">
                    <ErrorBlock error={nodeError} onRetry={() => fetchNode(currentNode.id)} />
                  </div>
                ) : (
                  <MarkdownView>{nodeDetail?.text || ''}</MarkdownView>
                )}
              </div>

              {/* Attached Child Nodes / Sub-sections */}
              {nodeDetail?.children && nodeDetail.children.length > 0 && (
                <section
                  className={cx('mt-10 border-t pt-5', activeTheme.border)}
                  aria-label="Child sections"
                >
                  <p className={cx('mb-2 text-xs font-semibold tracking-wider uppercase', activeTheme.subtext)}>
                    Contains {nodeDetail.children.length} sub-item{nodeDetail.children.length === 1 ? '' : 's'}
                  </p>
                  <ul className="divide-y divide-stone-200/50 dark:divide-stone-800">
                    {nodeDetail.children.map((child) => {
                      const childIndex = orderedNodes.findIndex((n) => n.id === child.id)
                      return (
                        <li key={child.id} className="py-1.5">
                          <button
                            type="button"
                            onClick={() => childIndex !== -1 && goToPage(childIndex)}
                            className="flex w-full items-center justify-between text-left text-sm hover:underline"
                          >
                            <span className={cx('truncate', activeTheme.text)}>
                              {child.slNo ? `${child.slNo}. ` : ''}
                              {child.label || NODE_TYPE_LABEL[child.type]}
                            </span>
                            <span className={cx('shrink-0 text-xs', activeTheme.subtext)}>
                              {NODE_TYPE_LABEL[child.type]}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              )}

              {/* Related Nodes */}
              {nodeDetail?.related && nodeDetail.related.length > 0 && (
                <section
                  className={cx('mt-8 border-t pt-4', activeTheme.border)}
                  aria-label="Related nodes"
                >
                  <p className={cx('mb-2 text-xs font-semibold tracking-wider uppercase', activeTheme.subtext)}>
                    Related Evidence
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {nodeDetail.related.map((rel) => {
                      const relIndex = orderedNodes.findIndex((n) => n.id === rel.id)
                      return (
                        <button
                          key={rel.id}
                          type="button"
                          onClick={() => relIndex !== -1 && goToPage(relIndex)}
                          className="rounded-md border border-stone-200 bg-white/70 px-2.5 py-1 text-xs hover:border-amber-400 dark:border-stone-700 dark:bg-stone-800"
                        >
                          {nodeDisplay(rel)}
                        </button>
                      )
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* Bottom Running Footer of the Page */}
            <footer
              className={cx(
                'mt-12 flex items-center justify-between border-t pt-4 text-xs',
                activeTheme.border,
                activeTheme.subtext,
              )}
            >
              <div className="flex items-center gap-2">
                <Link
                  to={`/books/${bookId}?node=${currentNode?.id}`}
                  className="flex items-center gap-1 hover:underline"
                  title="Edit this node in Workspace"
                >
                  <ExternalLink aria-hidden="true" className="h-3 w-3" />
                  Edit in workspace
                </Link>
              </div>

              {/* Page Number & Total */}
              <div className="font-mono text-xs tabular-nums" aria-label={`Page ${pageNumber} of ${totalPages}`}>
                Page {pageNumber} of {totalPages}
              </div>
            </footer>
          </article>

          {/* Floating / Sticky Paged Navigation Controls */}
          <nav
            className={cx(
              'mt-6 flex items-center justify-between gap-4 rounded-lg border p-3 shadow-md backdrop-blur-md',
              activeTheme.sheetBg,
              activeTheme.border,
            )}
            aria-label="Page navigation"
          >
            <button
              type="button"
              onClick={goPrev}
              disabled={currentIndex <= 0}
              className="btn btn-secondary btn-sm flex items-center gap-1"
              title="Previous page (Left Arrow, K)"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
              <span>Previous</span>
            </button>

            {/* Jump slider / Page status */}
            <div className="flex items-center gap-2 text-xs">
              <span className={cx('hidden text-stone-500 sm:inline', activeTheme.subtext)}>
                Jump to page:
              </span>
              <input
                type="range"
                min="0"
                max={Math.max(0, totalPages - 1)}
                value={currentIndex}
                onChange={(e) => goToPage(Number(e.target.value))}
                className="w-24 accent-stone-800 sm:w-40"
                aria-label="Page progress slider"
              />
              <span className={cx('font-mono font-medium tabular-nums', activeTheme.text)}>
                {pageNumber} / {totalPages}
              </span>
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={currentIndex >= totalPages - 1}
              className="btn btn-secondary btn-sm flex items-center gap-1"
              title="Next page (Right Arrow, J)"
            >
              <span>Next</span>
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </nav>
        </main>
      </div>
    </div>
  )
}
