const BASE = '/api'

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

async function request(path, { method = 'GET', body } = {}) {
  let response
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError('Cannot reach the local server. Is it running on port 5174?', 0)
  }

  if (!response.ok) {
    let payload = null
    try {
      payload = await response.json()
    } catch {
      // Non-JSON error body; keep the status text.
    }
    const message = payload?.error || `Request failed (${response.status})`
    const details = payload?.details
    const suffix =
      Array.isArray(details) && details.length
        ? ` — ${details.map((item) => `${item.field}: ${item.message}`).join('; ')}`
        : ''
    throw new ApiError(`${message}${suffix}`, response.status, details)
  }
  return response.json()
}

const enc = encodeURIComponent

export const api = {
  listBooks: () => request('/books'),
  createBook: (body) => request('/books', { method: 'POST', body }),
  getBook: (bookId) => request(`/books/${enc(bookId)}`),
  updateBook: (bookId, body) => request(`/books/${enc(bookId)}`, { method: 'PATCH', body }),
  deleteBook: (bookId) => request(`/books/${enc(bookId)}?confirm=delete`, { method: 'DELETE' }),
  createSampleBook: () => request('/books/sample'),
  getFile: (bookId, path) => request(`/books/${enc(bookId)}/files?path=${enc(path)}`),

  getNode: (bookId, nodeId) => request(`/books/${enc(bookId)}/nodes/${enc(nodeId)}`),
  createNode: (bookId, body) => request(`/books/${enc(bookId)}/nodes`, { method: 'POST', body }),
  updateNode: (bookId, nodeId, body) =>
    request(`/books/${enc(bookId)}/nodes/${enc(nodeId)}`, { method: 'PATCH', body }),
  deleteNode: (bookId, nodeId) => request(`/books/${enc(bookId)}/nodes/${enc(nodeId)}`, { method: 'DELETE' }),
  reorderNode: (bookId, nodeId, direction) =>
    request(`/books/${enc(bookId)}/nodes/${enc(nodeId)}/reorder`, { method: 'POST', body: { direction } }),
  listNodes: (bookId) => request(`/books/${enc(bookId)}/nodes`),

  nodeAudioUrl: (bookId, nodeId, download = false, version = '') => {
    const params = new URLSearchParams()
    if (download) params.set('download', '1')
    if (version) params.set('v', String(version))
    const q = params.toString()
    return `${BASE}/books/${enc(bookId)}/nodes/${enc(nodeId)}/audio${q ? `?${q}` : ''}`
  },

  uploadNodeAudio: async (bookId, nodeId, file) => {
    let response
    try {
      const buffer = await file.arrayBuffer()
      response = await fetch(
        `${BASE}/books/${enc(bookId)}/nodes/${enc(nodeId)}/audio?name=${enc(file.name)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': file.type || 'application/octet-stream',
          },
          body: buffer,
        },
      )
    } catch (err) {
      console.error('Audio upload network error:', err)
      throw new ApiError(
        err?.message && !err.message.includes('fetch')
          ? `Upload failed: ${err.message}`
          : 'Cannot reach the local server. Is it running on port 5174?',
        0,
      )
    }
    if (!response.ok) {
      let payload = null
      try {
        payload = await response.json()
      } catch {
        // Non-JSON response body
      }
      throw new ApiError(payload?.error || `Upload failed (${response.status})`, response.status)
    }
    return response.json()
  },

  deleteNodeAudio: (bookId, nodeId) =>
    request(`/books/${enc(bookId)}/nodes/${enc(nodeId)}/audio`, { method: 'DELETE' }),

  search: ({ q, bookId, limit }) => {
    const params = new URLSearchParams({ q })
    if (bookId) params.set('bookId', bookId)
    if (limit) params.set('limit', String(limit))
    return request(`/search?${params.toString()}`)
  },

  markdownExportUrl: (bookId, { nodeIds } = {}) => {
    const params = new URLSearchParams()
    if (nodeIds?.length) params.set('nodeIds', nodeIds.join(','))
    const query = params.toString()
    return `${BASE}/books/${enc(bookId)}/export/markdown${query ? `?${query}` : ''}`
  },
  archiveUrl: (bookId) => `${BASE}/books/${enc(bookId)}/export/archive`,
  backupUrl: () => `${BASE}/export/all`,

  async importArchive(file, { mode } = {}) {
    let response
    try {
      response = await fetch(`${BASE}/import${mode ? `?mode=${enc(mode)}` : ''}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/zip' },
        body: file,
      })
    } catch {
      throw new ApiError('Cannot reach the local server. Is it running on port 5174?', 0)
    }
    let payload = null
    try {
      payload = await response.json()
    } catch {
      // Ignore non-JSON responses.
    }
    if (!response.ok) {
      throw new ApiError(payload?.error || `Import failed (${response.status})`, response.status, payload?.details)
    }
    return payload
  },
}
