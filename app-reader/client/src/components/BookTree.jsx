import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlignLeft,
  BookMarked,
  BookOpen,
  ChevronRight,
  Headphones,
  Lightbulb,
  MessageSquare,
  Star,
  Type,
} from 'lucide-react'
import { NODE_TYPE_LABEL, cx, pageLabel } from '../lib/format.js'

const ICONS = {
  story: BookMarked,
  chapter: BookOpen,
  passage: BookMarked,
  line: AlignLeft,
  word: Type,
  note: MessageSquare,
  concept: Lightbulb,
}

function TreeItem({ node, bookId, selectedId, depth }) {
  const [open, setOpen] = useState(true)
  const hasChildren = node.children?.length > 0
  const Icon = ICONS[node.type] || BookOpen
  const selected = node.id === selectedId

  return (
    <li>
      <div
        className={cx(
          'group flex items-center gap-1 rounded-md pr-1',
          selected ? 'bg-white shadow-sm ring-1 ring-stone-200' : 'hover:bg-stone-200/50',
        )}
        style={{ paddingLeft: `${Math.min(depth, 6) * 10}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded p-1 text-stone-400 hover:text-stone-800"
            aria-label={`${open ? 'Collapse' : 'Expand'} ${node.label || node.type}`}
            aria-expanded={open}
          >
            <ChevronRight aria-hidden="true" className={cx('h-3.5 w-3.5 transition-transform', open && 'rotate-90')} />
          </button>
        ) : (
          <span className="w-5 shrink-0" aria-hidden="true" />
        )}
        <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-stone-400" />
        <Link
          to={`/books/${bookId}?node=${node.id}`}
          className={cx(
            'min-w-0 flex-1 truncate py-1.5 text-[13px]',
            selected ? 'font-medium text-stone-900' : 'text-stone-600 group-hover:text-stone-900',
          )}
          title={`${NODE_TYPE_LABEL[node.type] || node.type}${node.slNo ? ` · sl. ${node.slNo}` : ''}: ${node.label || ''}`}
          aria-current={selected ? 'page' : undefined}
        >
          {node.slNo ? <span className="mr-1 text-stone-400 tabular-nums">{node.slNo}.</span> : null}
          {node.label || NODE_TYPE_LABEL[node.type] || node.type}
        </Link>
        {node.importance === 'high' ? (
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"
            title="Marked important"
            aria-label="Marked important"
          />
        ) : null}
        {node.currentTopic ? (
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500"
            title="Current topic"
            aria-label="Current topic"
          />
        ) : null}
        {node.favorite ? (
          <Star aria-hidden="true" className="h-3 w-3 shrink-0 fill-amber-400 text-amber-500" aria-label="Favourite" />
        ) : null}
        {node.audioFile ? (
          <Headphones aria-hidden="true" className="h-3 w-3 shrink-0 text-emerald-600" title="Has audio recording" aria-label="Has audio recording" />
        ) : null}
        {pageLabel(node) ? (
          <span className="shrink-0 pr-1 text-[10px] text-stone-400 tabular-nums">{pageLabel(node)}</span>
        ) : null}
      </div>
      {hasChildren && open ? (
        <ul className="mt-0.5 space-y-0.5">
          {node.children.map((child) => (
            <TreeItem key={child.id} node={child} bookId={bookId} selectedId={selectedId} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

export default function BookTree({ tree, bookId, selectedId }) {
  if (!tree?.length) {
    return (
      <p className="rounded-md border border-dashed border-stone-300 px-3 py-4 text-xs leading-relaxed text-stone-500">
        No nodes yet. Open the workspace to add your first chapter or passage.
      </p>
    )
  }

  return (
    <ul className="space-y-0.5">
      {tree.map((node) => (
        <TreeItem key={node.id} node={node} bookId={bookId} selectedId={selectedId} depth={0} />
      ))}
    </ul>
  )
}
