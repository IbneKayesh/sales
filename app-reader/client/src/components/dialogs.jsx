import { useId, useState } from 'react'
import { api } from '../lib/api.js'
import { IMPORTANCE, NODE_TYPES, NODE_TYPE_LABEL } from '../lib/format.js'
import { descendantIds, flattenNodes } from '../lib/hierarchy.js'
import { CheckList, ErrorBlock, MarkdownEditor, Modal, Spinner, TagInput } from './ui.jsx'

function DialogForm({ title, description, onClose, onSubmit, submitLabel = 'Save', busy, error, children, size }) {
  const formId = useId()
  return (
    <Modal
      open
      onClose={busy ? () => {} : onClose}
      title={title}
      description={description}
      size={size}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="submit" form={formId} className="btn btn-primary" disabled={busy}>
            {busy ? <Spinner /> : null}
            {submitLabel}
          </button>
        </>
      }
    >
      <form id={formId} className="space-y-4" onSubmit={onSubmit}>
        {error ? <ErrorBlock error={error} /> : null}
        {children}
      </form>
    </Modal>
  )
}

function TextField({ id, label, value, onChange, required, placeholder, hint, type = 'text', ...rest }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </label>
      <input
        id={id}
        className="input"
        type={type}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        {...rest}
      />
      {hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  )
}

export function BookDialog({ book, onClose, onSaved }) {
  const isEdit = Boolean(book)
  const [values, setValues] = useState({
    title: book?.title || '',
    author: book?.author || '',
    year: book?.year || '',
    edition: book?.edition || '',
    publisher: book?.publisher || '',
    researchQuestion: book?.researchQuestion || '',
    thesisObjective: book?.thesisObjective || '',
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const set = (patch) => setValues((current) => ({ ...current, ...patch }))

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const payload = { ...values }
      const result = isEdit ? await api.updateBook(book.id, payload) : await api.createBook(payload)
      await onSaved?.(result, isEdit)
      onClose()
    } catch (err) {
      setError(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <DialogForm
      title={isEdit ? 'Edit book details' : 'Create a book'}
      description={
        isEdit
          ? 'Metadata is written to book.md inside the book folder.'
          : 'A new folder with book.md, index.json and the nodes/ directory is created on disk.'
      }
      onClose={onClose}
      onSubmit={submit}
      busy={busy}
      error={error}
      submitLabel={isEdit ? 'Save details' : 'Create book'}
    >
      <TextField id="book-title" label="Title" required value={values.title} onChange={(title) => set({ title })} />
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField id="book-author" label="Author" value={values.author} onChange={(author) => set({ author })} />
        <TextField id="book-year" label="Year" value={values.year} onChange={(year) => set({ year })} />
        <TextField id="book-edition" label="Edition" value={values.edition} onChange={(edition) => set({ edition })} />
        <TextField
          id="book-publisher"
          label="Publisher"
          value={values.publisher}
          onChange={(publisher) => set({ publisher })}
        />
      </div>
      <div>
        <label htmlFor="book-question" className="label">
          Research question
        </label>
        <textarea
          id="book-question"
          className="input"
          rows="3"
          value={values.researchQuestion}
          onChange={(event) => set({ researchQuestion: event.target.value })}
          placeholder="What question is this reading meant to answer?"
        />
      </div>
      <div>
        <label htmlFor="book-objective" className="label">
          Thesis objective
        </label>
        <textarea
          id="book-objective"
          className="input"
          rows="3"
          value={values.thesisObjective}
          onChange={(event) => set({ thesisObjective: event.target.value })}
          placeholder="What kind of argument are you trying to build?"
        />
      </div>
    </DialogForm>
  )
}

/**
 * Create or edit one node with the simplified field set: serial, type, parent,
 * importance, tags, text, related nodes, favourite, current topic and themes.
 */
export function NodeDialog({ bookId, nodes, node, parentId = null, defaultType = 'chapter', onClose, onSaved }) {
  const isEdit = Boolean(node)
  const [values, setValues] = useState({
    type: node?.type || defaultType,
    slNo: node?.slNo || '',
    parentId: node ? node.parentId || '' : parentId || '',
    importance: node?.importance || 'medium',
    tags: node?.tags || [],
    text: node?._text ?? '',
    relatedNodeIds: node?.relatedNodeIds || [],
    favorite: Boolean(node?.favorite),
    currentTopic: Boolean(node?.currentTopic),
    themes: node?.themes || '',
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const set = (patch) => setValues((current) => ({ ...current, ...patch }))

  const blocked = node ? descendantIds(nodes, node.id) : new Set()
  if (node) blocked.add(node.id)
  const options = flattenNodes(nodes).filter((item) => !blocked.has(item.id))

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const payload = {
        type: values.type,
        slNo: values.slNo,
        parentId: values.parentId || null,
        importance: values.importance,
        tags: values.tags,
        text: values.text,
        relatedNodeIds: values.relatedNodeIds,
        favorite: values.favorite,
        currentTopic: values.currentTopic,
        themes: values.themes,
      }
      if (isEdit) await api.updateNode(bookId, node.id, payload)
      else await api.createNode(bookId, payload)
      await onSaved?.()
      onClose()
    } catch (err) {
      setError(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <DialogForm
      title={isEdit ? 'Edit node' : 'Add node'}
      description="Every record is one node in the hierarchy: serial, type, parent, importance, tags, text, links, favourite, current topic and themes."
      onClose={onClose}
      onSubmit={submit}
      busy={busy}
      error={error}
      submitLabel={isEdit ? 'Save node' : 'Add node'}
      size="lg"
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <TextField
          id="node-sl-no"
          label="sl. no."
          value={values.slNo}
          onChange={(slNo) => set({ slNo })}
          placeholder="e.g. 4"
          hint="Your own serial."
        />
        <div>
          <label htmlFor="node-type" className="label">
            Type
          </label>
          <select
            id="node-type"
            className="input"
            value={values.type}
            onChange={(event) => set({ type: event.target.value })}
          >
            {NODE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="node-parent" className="label">
            Parent node
          </label>
          <select
            id="node-parent"
            className="input"
            value={values.parentId || ''}
            onChange={(event) => set({ parentId: event.target.value })}
          >
            <option value="">(null) top level</option>
            {options.map((item) => (
              <option key={item.id} value={item.id}>
                {`${'— '.repeat(Math.min(item.depth, 6))}${item.label || item.type}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="node-importance" className="label">
            Importance
          </label>
          <select
            id="node-importance"
            className="input"
            value={values.importance}
            onChange={(event) => set({ importance: event.target.value })}
          >
            {IMPORTANCE.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="node-tags" className="label">
            Tags (comma separated)
          </label>
          <TagInput id="node-tags" value={values.tags} onChange={(tags) => set({ tags })} />
        </div>
      </div>

      <MarkdownEditor
        id="node-text"
        label="Text"
        value={values.text}
        onChange={(text) => set({ text })}
        rows={8}
        hint="Markdown supported. The first line becomes the node's display label."
      />

      <div>
        <label htmlFor="node-themes" className="label">
          Themes (any text)
        </label>
        <textarea
          id="node-themes"
          className="input"
          rows="2"
          value={values.themes}
          onChange={(event) => set({ themes: event.target.value })}
          placeholder="e.g. memory as repetition"
        />
      </div>

      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-stone-300 accent-stone-800"
            checked={values.favorite}
            onChange={(event) => set({ favorite: event.target.checked })}
          />
          Favourite
        </label>
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-stone-300 accent-stone-800"
            checked={values.currentTopic}
            onChange={(event) => set({ currentTopic: event.target.checked })}
          />
          Current topic
        </label>
      </div>

      <CheckList
        label="Related nodes"
        items={flattenNodes(nodes).filter((item) => item.id !== node?.id)}
        selectedIds={values.relatedNodeIds}
        onChange={(relatedNodeIds) => set({ relatedNodeIds })}
        renderLabel={(item) => (item.slNo ? `${item.slNo}. ` : '') + (item.label || item.type)}
        renderMeta={(item) => NODE_TYPE_LABEL[item.type] || item.type}
        matches={(filter, item) => {
          const needle = filter.trim().toLowerCase()
          if (!needle) return true
          if (item.slNo && item.slNo.toLowerCase().includes(needle)) return true
          if ((item.tags || []).some((tag) => tag.includes(needle))) return true
          return (item.label || '').toLowerCase().includes(needle)
        }}
        emptyLabel="Add more nodes first, then link related ones here."
      />
    </DialogForm>
  )
}
