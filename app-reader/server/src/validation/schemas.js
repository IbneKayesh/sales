import { z } from 'zod'
import { badRequest } from '../utils/errors.js'

export function validate(schema, data) {
  const result = schema.safeParse(data ?? {})
  if (!result.success) {
    throw badRequest(
      'Validation failed',
      result.error.issues.map((issue) => ({
        field: issue.path.join('.') || '(body)',
        message: issue.message,
      })),
    )
  }
  return result.data
}

const trimmed = (max) => z.string().trim().max(max)
const optionalText = (max) => trimmed(max).optional()

export const NODE_TYPES = ['story', 'chapter', 'passage', 'line', 'word', 'note', 'concept']
export const IMPORTANCE_LEVELS = ['low', 'medium', 'high']

/** Tags arrive either as a comma-separated string from the form or as an array. */
const tagsInput = z.union([z.string().max(2000), z.array(trimmed(50)).max(50)]).optional()
const ids = z.array(z.string()).max(500).optional()
const body = z.string().max(500000).optional()

export const bookCreateSchema = z.object({
  title: trimmed(200).min(1, 'Title is required'),
  author: optionalText(200),
  year: optionalText(20),
  edition: optionalText(200),
  publisher: optionalText(200),
  researchQuestion: optionalText(2000),
  thesisObjective: optionalText(2000),
  description: body,
})

export const bookUpdateSchema = bookCreateSchema.partial()

export const nodeCreateSchema = z.object({
  type: z.enum(NODE_TYPES),
  slNo: optionalText(100),
  parentId: z.string().nullable().optional(),
  importance: z.enum(IMPORTANCE_LEVELS).optional(),
  tags: tagsInput,
  title: optionalText(300),
  subtitles: z.array(trimmed(500)).max(50).optional(),
  notes: body,
  text: body,
  relatedNodeIds: ids,
  favorite: z.boolean().optional(),
  currentTopic: z.boolean().optional(),
  themes: optionalText(5000),
  audioFile: z.string().nullable().optional(),
  audioOriginalName: optionalText(200).nullable(),
})

export const nodeUpdateSchema = nodeCreateSchema.partial().extend({
  order: z.number().int().min(0).optional(),
})

/**
 * Normalise the tag input (comma-separated string or array) into a de-duplicated,
 * lower-cased list.
 */
export function cleanTags(value) {
  const source = typeof value === 'string' ? value.split(',') : Array.isArray(value) ? value : []
  const seen = new Set()
  const out = []
  for (const tag of source) {
    const normalized = String(tag).trim().toLowerCase()
    if (!normalized || seen.has(normalized)) continue
    seen.add(normalized)
    out.push(normalized)
  }
  return out
}
