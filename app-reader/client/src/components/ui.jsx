import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { AlertCircle, Check, Loader2, Plus, Search, X } from 'lucide-react'
import { cx } from '../lib/format.js'

export function Spinner({ className = 'h-4 w-4' }) {
  return <Loader2 aria-hidden="true" className={cx('animate-spin', className)} />
}

export function LoadingBlock({ label = 'Loading…' }) {
  return (
    <div className="flex items-center gap-3 p-6 text-sm text-stone-500" role="status">
      <Spinner />
      <span>{label}</span>
    </div>
  )
}

export function ErrorBlock({ error, onRetry }) {
  if (!error) return null
  return (
    <div className="card border-red-200 bg-red-50 p-4" role="alert">
      <div className="flex items-start gap-3">
        <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-red-900">{error.message || 'Something went wrong.'}</p>
          {onRetry ? (
            <button type="button" className="btn btn-secondary btn-sm mt-3" onClick={onRetry}>
              Try again
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 bg-stone-50/70 px-6 py-10 text-center">
      {Icon ? (
        <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-400 ring-1 ring-stone-200">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
      ) : null}
      <h3 className="text-sm font-semibold text-stone-800">{title}</h3>
      {description ? <p className="mt-1 max-w-md text-sm text-stone-500">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

export function Badge({ children, className, title }) {
  return (
    <span className={cx('pill', className)} title={title}>
      {children}
    </span>
  )
}

export function Modal({ open, onClose, title, description, children, footer, size = 'md' }) {
  const titleId = useId()
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const previouslyFocused = document.activeElement
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    const focusable = panelRef.current?.querySelector(
      'input:not([type="hidden"]), textarea, select, button, [href], [tabindex]:not([tabindex="-1"])',
    )
    focusable?.focus()
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
      previouslyFocused?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  const widths = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl' }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-stone-900/40 p-4 sm:items-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cx('my-4 w-full rounded-xl bg-white shadow-xl ring-1 ring-stone-200', widths[size])}
      >
        <div className="flex items-start justify-between gap-4 border-b border-stone-200 px-5 py-4">
          <div>
            <h2 id={titleId} className="font-serif text-lg font-semibold text-stone-900">
              {title}
            </h2>
            {description ? <p className="mt-1 text-sm text-stone-500">{description}</p> : null}
          </div>
          <button type="button" className="btn btn-ghost btn-sm -mr-1" onClick={onClose} aria-label="Close dialog">
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer ? <div className="flex justify-end gap-2 border-t border-stone-200 px-5 py-3">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  )
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onClose,
  busy = false,
  children,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? <Spinner /> : null}
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-stone-700">{message}</p>
      {children}
    </Modal>
  )
}

export function MarkdownView({ children, className }) {
  if (!children || !String(children).trim()) {
    return <p className="text-sm text-stone-400 italic">Nothing written yet.</p>
  }
  return (
    <div className={cx('markdown', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: (props) => <a {...props} target="_blank" rel="noreferrer noopener" />,
        }}
      >
        {String(children)}
      </ReactMarkdown>
    </div>
  )
}

export function MarkdownEditor({ id, label = 'Markdown', value, onChange, rows = 8, hint, error }) {
  const [mode, setMode] = useState('write')
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <label htmlFor={id} className="label mb-0">
          {label}
        </label>
        <div className="flex rounded-md border border-stone-200 bg-stone-50 p-0.5" role="group" aria-label="Editor mode">
          {['write', 'preview'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              aria-pressed={mode === option}
              className={cx(
                'rounded px-2 py-1 text-xs font-medium capitalize',
                mode === option ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800',
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      {mode === 'write' ? (
        <textarea
          id={id}
          className="markdown-editor"
          rows={rows}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={hint ? `${id}-hint` : undefined}
        />
      ) : (
        <div className="min-h-32 rounded-md border border-stone-200 bg-stone-50 p-3">
          <MarkdownView>{value}</MarkdownView>
        </div>
      )}
      {hint ? (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      ) : null}
      {error ? <p className="mt-1 text-xs text-red-700">{error}</p> : null}
    </div>
  )
}

export function TagInput({ id, value = [], onChange, hint }) {
  const [draft, setDraft] = useState('')

  const addTags = (raw) => {
    const additions = raw
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean)
    if (!additions.length) return
    const next = [...new Set([...value, ...additions])]
    onChange(next)
    setDraft('')
  }

  const remove = (tag) => onChange(value.filter((item) => item !== tag))

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-stone-300 bg-white p-2 focus-within:border-stone-500 focus-within:ring-2 focus-within:ring-stone-200">
        {value.map((tag) => (
          <span key={tag} className="pill border-stone-200 bg-stone-100 text-stone-700">
            {tag}
            <button
              type="button"
              onClick={() => remove(tag)}
              className="rounded-full text-stone-400 hover:text-stone-800"
              aria-label={`Remove tag ${tag}`}
            >
              <X aria-hidden="true" className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          className="min-w-24 flex-1 border-0 bg-transparent px-1 py-0.5 text-sm placeholder:text-stone-400 focus:outline-none"
          value={draft}
          placeholder={value.length ? 'Add tag…' : 'freedom, memory, power…'}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault()
              addTags(draft)
            } else if (event.key === 'Backspace' && !draft && value.length) {
              remove(value[value.length - 1])
            }
          }}
          onBlur={() => addTags(draft)}
        />
      </div>
      {hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  )
}

export function CheckList({
  items,
  selectedIds = [],
  onChange,
  emptyLabel = 'Nothing available yet.',
  label = 'Link items',
  renderLabel,
  renderMeta,
  searchable = true,
  searchPlaceholder = 'Filter…',
  matches,
}) {
  const [filter, setFilter] = useState('')
  const selected = new Set(selectedIds)
  const filtered = items.filter((item) => {
    if (!filter.trim()) return true
    if (matches) return matches(filter, item)
    return String(renderLabel(item)).toLowerCase().includes(filter.trim().toLowerCase())
  })

  const toggle = (id) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onChange([...next])
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="label mb-0">{label}</span>
        <span className="text-xs text-stone-400">{selectedIds.length} selected</span>
      </div>
      {searchable && (items.length > 6 || matches) ? (
        <div className="relative mb-2">
          <Search aria-hidden="true" className="pointer-events-none absolute top-2.5 left-2.5 h-4 w-4 text-stone-400" />
          <input
            className="input pl-8"
            placeholder={searchPlaceholder}
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label={`Filter ${label.toLowerCase()}`}
          />
        </div>
      ) : null}
      <div className="max-h-48 overflow-y-auto rounded-md border border-stone-200 bg-stone-50">
        {filtered.length === 0 ? (
          <p className="p-3 text-sm text-stone-400">{emptyLabel}</p>
        ) : (
          <ul className="divide-y divide-stone-200">
            {filtered.map((item) => {
              const id = item.id
              const isSelected = selected.has(id)
              return (
                <li key={id}>
                  <label className="flex cursor-pointer items-start gap-2 px-3 py-2 text-sm hover:bg-white">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-stone-300 accent-stone-800"
                      checked={isSelected}
                      onChange={() => toggle(id)}
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-stone-800">{renderLabel(item)}</span>
                      {renderMeta ? <span className="block text-xs text-stone-400">{renderMeta(item)}</span> : null}
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export function Toasts({ toasts, onDismiss }) {
  return (
    <div className="fixed right-4 bottom-4 z-[60] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.tone === 'error' ? 'alert' : 'status'}
          className={cx(
            'flex items-start gap-2 rounded-lg border p-3 text-sm shadow-lg',
            toast.tone === 'error'
              ? 'border-red-200 bg-red-50 text-red-900'
              : 'border-stone-200 bg-white text-stone-800',
          )}
        >
          {toast.tone === 'error' ? (
            <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          ) : (
            <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          )}
          <span className="min-w-0 flex-1">{toast.message}</span>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="-mr-1 rounded p-0.5 text-stone-400 hover:text-stone-800"
            aria-label="Dismiss message"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

export function AddButton({ children, onClick, ...props }) {
  return (
    <button type="button" className="btn btn-secondary btn-sm" onClick={onClick} {...props}>
      <Plus aria-hidden="true" className="h-3.5 w-3.5" />
      {children}
    </button>
  )
}
