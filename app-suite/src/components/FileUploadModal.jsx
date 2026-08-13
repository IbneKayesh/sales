import { useState, useRef, useCallback, useEffect } from 'react'
import Modal, { ModalHeader, ModalTitle, ModalBody, ModalFooter } from './Modal'
import Button from './Button'
import Confirm from './Confirm'
import { toast } from './ToastBox'
import {
  IconUpload,
  IconClose,
  IconFile,
  IconDownload,
  IconDelete,
  IconRefresh,
} from '../icons'

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

/**
 * FileUploadModal — small popup (Modal) that walks through
 * select → preview → upload, then lets the user manage the uploaded file
 * with download / delete (via Confirm) / replace actions.
 *
 * The uploaded file is controlled via `value`/`onChange`, so it persists
 * between modal opens (e.g. next open shows the uploaded preview).
 *
 * Props:
 *   open       — controls modal visibility
 *   onClose    — close callback
 *   value      — currently uploaded File (or null)
 *   onChange   — called with the new File on upload, or null on delete
 *   onUpload   — optional async hook (file) => Promise; drives the loading
 *                state on the upload button. Omit for instant upload.
 *   accept     — accepted file types passed to the file input
 *   maxSize    — max file size in bytes
 *   maxFiles   — max number of files that can be uploaded
 *   title/subtitle — modal heading text
 */
export default function FileUploadModal({
  open = false,
  onClose,
  value = null,
  onChange,
  onUpload,
  accept,
  maxSize,
  maxFiles = 1,
  title = 'Upload File',
  subtitle = 'Select a file, preview it, then upload',
  uploadText = 'Upload',
  cancelText = 'Cancel',
  doneText = 'Done',
}) {
  const inputRef = useRef(null)
  const previewUrlRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [pending, setPending] = useState(null)     // selected, not yet uploaded
  const [uploading, setUploading] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [replacing, setReplacing] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  // Object URL for image previews — created/revoked in event handlers
  const clearPreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
    setPreviewUrl(null)
  }, [])

  const setPreview = useCallback((file) => {
    clearPreview()
    if (file?.type?.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      previewUrlRef.current = url
      setPreviewUrl(url)
    }
  }, [clearPreview])

  // Revoke any remaining preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
        previewUrlRef.current = null
      }
    }
  }, [])

  // Reset transient state whenever the popup closes
  const handleClose = useCallback(() => {
    clearPreview()
    setPending(null)
    setUploading(false)
    setShowActions(false)
    setConfirmDelete(false)
    setReplacing(false)
    setDragOver(false)
    onClose?.()
  }, [onClose, clearPreview])

  const openFileDialog = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleSelect = useCallback((fileList) => {
    const incoming = Array.from(fileList)
    if (incoming.length === 0) return

    const file = incoming[0]
    const errors = []

    // During replace the new file simply replaces the old one
    const currentCount = value && !replacing ? 1 : 0
    if (maxFiles && currentCount + incoming.length > maxFiles) {
      errors.push(`You can only upload up to ${maxFiles} file${maxFiles > 1 ? 's' : ''}.`)
    }
    if (maxSize && file.size > maxSize) {
      errors.push(`"${file.name}" exceeds the ${formatSize(maxSize)} size limit (${formatSize(file.size)}).`)
    }

    if (errors.length > 0) {
      toast.error(errors[0])
      setPending(null)
      clearPreview()
      return
    }

    setPending(file)
    setPreview(file)
    setShowActions(false)
  }, [value, replacing, maxFiles, maxSize, clearPreview, setPreview])

  const handleInputChange = useCallback((e) => {
    if (e.target.files?.length) {
      handleSelect(e.target.files)
    }
    // Reset so selecting the same file again triggers onChange
    e.target.value = ''
  }, [handleSelect])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    if (e.dataTransfer?.files?.length) {
      handleSelect(e.dataTransfer.files)
    }
  }, [handleSelect])

  const handleUpload = async () => {
    if (!pending || uploading) return
    if (onUpload) {
      setUploading(true)
      try {
        await onUpload(pending)
      } catch {
        toast.error('Upload failed. Please try again.')
        setUploading(false)
        return
      }
      setUploading(false)
    }
    // Keep the preview URL alive — the uploaded value is the same file
    onChange?.(pending)
    setPending(null)
    setReplacing(false)
    setShowActions(false)
  }

  const handleDownload = () => {
    if (!value) return
    const url = URL.createObjectURL(value)
    const a = document.createElement('a')
    a.href = url
    a.download = value.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setShowActions(false)
  }

  const handleDelete = () => {
    setConfirmDelete(false)
    clearPreview()
    onChange?.(null)
  }

  const handleReplace = () => {
    setReplacing(true)
    setPending(null)
    setShowActions(false)
  }

  const previewFile = pending || value
  const isImage = previewFile?.type?.startsWith('image/')
  const type = previewFile ? fileTypeLabel(previewFile.name) : null

  const renderPreview = (file) => (
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
  )

  const showPicker = !value || replacing

  return (
    <>
      <Modal open={open} onClose={handleClose} size="sm">
        <ModalHeader>
          <ModalTitle title={title} subtitle={subtitle} onClose={handleClose} />
        </ModalHeader>
        <ModalBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {showPicker ? (
              <>
                {/* ── Drop zone — select file for preview ── */}
                {replacing && value && (
                  <span className="file-upload__hint">
                    Select a new file to replace &quot;{value.name}&quot;
                  </span>
                )}
                <div
                  className={`file-upload__dropzone${dragOver ? ' file-upload__dropzone--active' : ''}`}
                  onClick={openFileDialog}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setDragOver(true)
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setDragOver(false)
                  }}
                  onDrop={handleDrop}
                  role="button"
                  tabIndex={0}
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
                    onChange={handleInputChange}
                    className="file-upload__input"
                    tabIndex={-1}
                  />
                  <div className="file-upload__dropzone-inner">
                    <span className="file-upload__dropzone-icon">
                      <IconUpload size={24} />
                    </span>
                    <span className="file-upload__dropzone-text">
                      <span className="file-upload__dropzone-browse">Browse files</span>
                      <span className="file-upload__dropzone-drag"> or drag & drop here</span>
                    </span>
                    {accept && (
                      <span className="file-upload__dropzone-hint">Accepted: {accept}</span>
                    )}
                    {maxSize && (
                      <span className="file-upload__dropzone-hint">
                        Max size: {formatSize(maxSize)}
                      </span>
                    )}
                  </div>
                </div>

                {/* ── Pending selection preview ── */}
                {pending && (
                  <div className="file-upload__list">
                    <div className="file-upload__file">
                      {renderPreview(pending)}
                      <span className="file-upload__file-info">
                        <span className="file-upload__file-name" title={pending.name}>
                          {pending.name}
                        </span>
                        <span className="file-upload__file-size">{formatSize(pending.size)}</span>
                      </span>
                      <button
                        type="button"
                        className="file-upload__file-remove"
                        onClick={() => {
                          clearPreview()
                          setPending(null)
                        }}
                        aria-label="Remove selected file"
                      >
                        <IconClose size={14} />
                      </button>
                    </div>
                  </div>
                )}

              </>
            ) : (
              <>
                {/* ── Uploaded file preview — click to show manage options ── */}
                <div className="file-upload__list">
                  <button
                    type="button"
                    className="file-upload__file"
                    style={{ width: '100%', cursor: 'pointer', textAlign: 'left' }}
                    onClick={() => setShowActions((s) => !s)}
                    title="Click to manage file"
                  >
                    {renderPreview(value)}
                    <span className="file-upload__file-info">
                      <span className="file-upload__file-name" title={value.name}>
                        {value.name}
                      </span>
                      <span className="file-upload__file-size">{formatSize(value.size)}</span>
                    </span>
                    <IconRefresh size={14} style={{ color: 'var(--text-muted)' }} />
                  </button>
                </div>

                {showActions && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 'var(--sp-2)',
                    }}
                  >
                    <Button variant="outline" size="sm" icon={<IconDownload size={14} />} onClick={handleDownload}>
                      Download
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={<IconDelete size={14} />}
                      onClick={() => setConfirmDelete(true)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<IconRefresh size={14} />}
                      onClick={handleReplace}
                    >
                      Replace
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          {value && !replacing ? (
            <Button variant="primary" size="sm" onClick={handleClose}>
              {doneText}
            </Button>
          ) : (
            <>
              <Button variant="secondary" size="sm" onClick={handleClose} disabled={uploading}>
                {cancelText}
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<IconUpload size={14} />}
                onClick={handleUpload}
                disabled={!pending}
                loading={uploading}
              >
                {uploadText}
              </Button>
            </>
          )}
        </ModalFooter>
      </Modal>

      {/* ── Confirm for delete decision ── */}
      <Confirm
        open={confirmDelete}
        title="Delete File"
        message={`Are you sure you want to delete "${value?.name || 'this file'}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  )
}
