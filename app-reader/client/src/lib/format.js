export const NODE_TYPES = [
  { value: 'story', label: 'Story' },
  { value: 'chapter', label: 'Chapter' },
  { value: 'passage', label: 'Passage' },
  { value: 'line', label: 'Line' },
  { value: 'word', label: 'Word' },
  { value: 'note', label: 'Note' },
  { value: 'concept', label: 'Concept' },
]

export const IMPORTANCE = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

export const NODE_TYPE_LABEL = Object.fromEntries(NODE_TYPES.map((item) => [item.value, item.label]))

export function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

/** Legacy v1 data can carry page references; they stay read-only in the new model. */
export function pageLabel(node) {
  if (!node) return ''
  if (node.pageStart && node.pageEnd && node.pageEnd !== node.pageStart) return `pp. ${node.pageStart}–${node.pageEnd}`
  if (node.pageStart) return `p. ${node.pageStart}`
  return ''
}

export function importanceTone(importance) {
  if (importance === 'high') return 'border-amber-300 bg-amber-50 text-amber-900'
  if (importance === 'low') return 'border-stone-200 bg-stone-50 text-stone-500'
  return 'border-stone-200 bg-white text-stone-600'
}

export function importanceLabel(importance) {
  return IMPORTANCE.find((item) => item.value === importance)?.label || 'Medium'
}

export function typeTone(type) {
  switch (type) {
    case 'chapter':
    case 'story':
      return 'border-stone-300 bg-stone-100 text-stone-700'
    case 'passage':
      return 'border-amber-200 bg-amber-50 text-amber-900'
    case 'line':
      return 'border-stone-200 bg-white text-stone-600'
    case 'word':
      return 'border-indigo-200 bg-indigo-50 text-indigo-800'
    case 'note':
      return 'border-sky-200 bg-sky-50 text-sky-900'
    case 'concept':
      return 'border-emerald-200 bg-emerald-50 text-emerald-800'
    default:
      return 'border-stone-200 bg-stone-50 text-stone-600'
  }
}

export function cx(...values) {
  return values.filter(Boolean).join(' ')
}

export function pluralize(count, word, plural = `${word}s`) {
  return `${count} ${count === 1 ? word : plural}`
}
