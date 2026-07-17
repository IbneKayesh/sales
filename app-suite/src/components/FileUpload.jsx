import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { IconUpload, IconClose, IconFile } from '../icons'

/**
 * Formats bytes into a human-readable string.
 */
function formatSize(bytes) {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const val = bytes / 1024 ** i
  return `${val.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

/**
 * Returns a simple file-type label + colour hint for preview cards.
 */
function fileTypeLabel(name) {
  const ext = name.split('.').pop()?.toLowerCase() || ''
  const map = {
    pdf:      { label: 'PDF',  color: 'var(--danger)' },
    doc:      { label: 'DOC',  color: 'var(--primary)' },
    docx:     { label: 'DOCX', color: 'var(--primary)' },
    xls:      { label: 'XLS',  color: 'var(--success)' },
    xlsx:     { label: 'XLSX', color: 'var(--success)' },
    csv:      { label: 'CSV',  color: 'var(--success)' },
    png:      { label: 'PNG',  color: 'var(--info)' },
    jpg:      { label: 'JPG',  color: 'var(--info)' },
    jpeg:     { label: 'JPEG', color: 'var(--info)' },
    gif:      { label: 'GIF',  color: 'var(--warning)' },
    svg:      { label: 'SVG',  color: 'var(--info)' },
    zip:      { label: 'ZIP',  color: 'var(--text-secondary)' },
    rar:      { label: 'RAR',  color: 'var(--text-secondary)' },
    json:     { label: 'JSON', color: 'var(--text-secondary)' },
    txt:      { label: 'TXT',  color: 'var(--text-secondary)' },
  }
  return map[ext] || { label: ext.toUpperCase() || 'FILE', color: 'var(--text-secondary)' }
}

export default function FileUpload({
  label,
  value = [],
  onChange,
  accept,
  multiple = false,
  maxSize,           // bytes
  maxFiles,
  disabled = false,
  required = false,
  error,
  hint,
  name,
  className = '',
  ...rest
}) {
  const inputRef = useRef(null)
  const blobUrlsRef = useRef(new Map())
  const [dragOver, setDragOver] = useState(false)
  const [focused, setFocused] = useState(false)
  const [localErrors, setLocalErrors] = useState([])
  const inputId = name || `fu-${Math.random().toString(36).slice(2, 8)}`

  // Compute image preview URLs — runs at top level, not inside .map()
  // Revokes stale URLs for removed files, creates new ones for added files
  const previewUrls = useMemo(() => {
    const map = blobUrlsRef.current
    // Revoke URLs for files that no longer exist in value
    map.forEach((url, key) => {
      const stillExists = value.some((f) => `${f.name}-${f.size}` === key)
      if (!stillExists) {
        URL.revokeObjectURL(url)
        map.delete(key)
      }
    })
    // Create URLs for new image files
    value.forEach((file) => {
      if (file.type?.startsWith('image/')) {
        const key = `${file.name}-${file.size}`
        if (!map.has(key)) {
          map.set(key, URL.createObjectURL(file))
        }
      }
    })
    return map
  }, [value])

  // Clean up remaining blob URLs on unmount only
  useEffect(() => {
    return () => {
      const map = blobUrlsRef.current
      map.forEach((url) => URL.revokeObjectURL(url))
      map.clear()
    }
  }, [])

  /** Validate a single file and return an error string or null. */
  const validateFile = useCallback((file) => {
    if (maxSize && file.size > maxSize) {
      return `"${file.name}" exceeds the ${formatSize(maxSize)} size limit (${formatSize(file.size)}).`
    }
    return null
  }, [maxSize])

  /** Process a FileList into our controlled value. */
  const processFiles = useCallback((fileList) => {
    const incoming = Array.from(fileList)
    const errors = []

    // Check maxFiles
    if (maxFiles && !multiple) {
      // single-file mode — replace
    } else if (maxFiles && value.length + incoming.length > maxFiles) {
      errors.push(`You can only upload up to ${maxFiles} file${maxFiles > 1 ? 's' : ''}.`)
    }

    const valid = incoming.filter((f) => {
      const err = validateFile(f)
      if (err) { errors.push(err); return false }
      return true
    })

    setLocalErrors(errors)

    if (valid.length === 0) return

    const next = multiple ? [...value, ...valid] : [valid[0]]
    if (onChange) onChange(next)
  }, [value, multiple, maxFiles, onChange, validateFile])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setDragOver(true)
  }, [disabled])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    if (disabled) return
    if (e.dataTransfer?.files?.length) {
      processFiles(e.dataTransfer.files)
    }
  }, [disabled, processFiles])

  const handleInputChange = useCallback((e) => {
    if (e.target.files?.length) {
      processFiles(e.target.files)
    }
    // Reset so selecting the same file again triggers onChange
    e.target.value = ''
  }, [processFiles])

  const removeFile = useCallback((index) => {
    const next = value.filter((_, i) => i !== index)
    if (onChange) onChange(next)
  }, [value, onChange])

  const openFileDialog = useCallback(() => {
    if (!disabled) inputRef.current?.click()
  }, [disabled])

  // The error shown below the drop zone
  const displayError = error || localErrors[0] || ''

  return (
    <div
      className={`file-upload${focused ? ' file-upload--focused' : ''}${dragOver ? ' file-upload--drag-over' : ''}${error || localErrors.length > 0 ? ' file-upload--error' : ''}${disabled ? ' file-upload--disabled' : ''}${className ? ' ' + className : ''}`}
    >
      {label && (
        <label className="file-upload__label" htmlFor={inputId}>
          {label}
          {required && <span className="file-upload__required">*</span>}
        </label>
      )}

      {/* ── Drop Zone ── */}
      <div
        id={inputId}
        className={`file-upload__dropzone${dragOver ? ' file-upload__dropzone--active' : ''}`}
        onClick={openFileDialog}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-label="Upload files"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openFileDialog()
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleInputChange}
          className="file-upload__input"
          tabIndex={-1}
          {...rest}
        />

        {dragOver ? (
          <div className="file-upload__dropzone-inner">
            <span className="file-upload__dropzone-icon file-upload__dropzone-icon--active">
              <IconUpload size={28} />
            </span>
            <span className="file-upload__dropzone-text">Drop files here</span>
          </div>
        ) : (
          <div className="file-upload__dropzone-inner">
            <span className="file-upload__dropzone-icon">
              <IconUpload size={24} />
            </span>
            <span className="file-upload__dropzone-text">
              <span className="file-upload__dropzone-browse">Browse files</span>
              <span className="file-upload__dropzone-drag"> or drag & drop here</span>
            </span>
            {accept && (
              <span className="file-upload__dropzone-hint">
                Accepted: {accept}
              </span>
            )}
            {maxSize && (
              <span className="file-upload__dropzone-hint">
                Max size: {formatSize(maxSize)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Hint ── */}
      {hint && !displayError && (
        <span className="file-upload__hint">{hint}</span>
      )}

      {/* ── Error ── */}
      {displayError && (
        <span className="file-upload__error">{displayError}</span>
      )}

      {/* ── File List ── */}
      {value.length > 0 && (
        <ul className="file-upload__list">
          {value.map((file, i) => {
            const type = fileTypeLabel(file.name)
            const isImage = file.type?.startsWith('image/')
            const previewUrl = isImage
              ? previewUrls.get(`${file.name}-${file.size}`)
              : null

            return (
              <li key={`${file.name}-${file.size}-${i}`} className="file-upload__file">
                <div className="file-upload__file-icon" style={{ '--file-color': type.color }}>
                  {isImage && previewUrl ? (
                    <img src={previewUrl} alt={file.name} className="file-upload__file-thumb" />
                  ) : (
                    <>
                      <IconFile size={18} className="file-upload__file-icon-svg" />
                      <span className="file-upload__file-ext">{type.label}</span>
                    </>
                  )}
                </div>
                <div className="file-upload__file-info">
                  <span className="file-upload__file-name" title={file.name}>
                    {file.name}
                  </span>
                  <span className="file-upload__file-size">{formatSize(file.size)}</span>
                </div>
                <button
                  type="button"
                  className="file-upload__file-remove"
                  onClick={() => removeFile(i)}
                  disabled={disabled}
                  aria-label={`Remove ${file.name}`}
                >
                  <IconClose size={14} />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
