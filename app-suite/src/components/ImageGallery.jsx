import { useState, useEffect, useCallback } from 'react'
import { IconChevronLeft, IconChevronRight, IconClose } from '../icons'

/**
 * ImageGallery — Responsive grid gallery with lightbox preview.
 *
 * Usage:
 *   <ImageGallery
 *     items={[
 *       { src: '...', thumbnail: '...', alt: '...', caption: '...' },
 *       ...
 *     ]}
 *     columns={3}
 *   />
 */

export default function ImageGallery({
  items = [],
  columns = 3,           // 2 | 3 | 4
  gap = 'var(--sp-3)',
  lightbox = true,
  className = '',
  renderThumbnail,
  ...rest
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(0)
  const len = items.length

  const openLightbox = useCallback((index) => {
    if (!lightbox || !len) return
    setLightboxIdx(index)
    setLightboxOpen(true)
  }, [lightbox, len])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const goNext = useCallback(() => {
    setLightboxIdx((prev) => (prev + 1) % len)
  }, [len])

  const goPrev = useCallback(() => {
    setLightboxIdx((prev) => (prev - 1 + len) % len)
  }, [len])

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback((e) => {
    if (!lightboxOpen) return
    if (e.key === 'Escape') { e.preventDefault(); closeLightbox() }
    if (e.key === 'ArrowRight') { e.preventDefault(); goNext() }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev() }
  }, [lightboxOpen, closeLightbox, goNext, goPrev])

  useEffect(() => {
    if (!lightboxOpen) return
    document.addEventListener('keydown', handleKeyDown)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = prev
    }
  }, [lightboxOpen, handleKeyDown])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) closeLightbox()
  }

  if (!len) return null

  const gridClass = `image-gallery image-gallery--cols-${Math.min(Math.max(columns, 2), 4)}${className ? ' ' + className : ''}`

  return (
    <>
      <div className={gridClass} style={{ gap }} {...rest}>
        {items.map((item, i) => {
          const thumb = renderThumbnail ? renderThumbnail(item, i) : (
            <div className="image-gallery__thumb" style={{ background: item.bg || 'var(--surface-alt)' }}>
              {item.icon && (
                <span className="image-gallery__thumb-icon">{item.icon}</span>
              )}
              {item.label && (
                <span className="image-gallery__thumb-label">{item.label}</span>
              )}
            </div>
          )

          return (
            <button
              key={item.key ?? i}
              type="button"
              className="image-gallery__item"
              onClick={() => openLightbox(i)}
              aria-label={`View ${item.alt || item.label || `image ${i + 1}`}`}
            >
              {thumb}
              {item.caption && (
                <div className="image-gallery__caption">
                  <span className="image-gallery__caption-title">{item.caption}</span>
                  {item.subtitle && <span className="image-gallery__caption-sub">{item.subtitle}</span>}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Lightbox */}
      {lightbox && lightboxOpen && (
        <div
          className="image-gallery__lightbox-overlay"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <div className="image-gallery__lightbox">
            {/* Close */}
            <button
              type="button"
              className="image-gallery__lightbox-close"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <IconClose size={20} />
            </button>

            {/* Previous */}
            {len > 1 && (
              <button
                type="button"
                className="image-gallery__lightbox-arrow image-gallery__lightbox-arrow--left"
                onClick={goPrev}
                aria-label="Previous image"
              >
                <IconChevronLeft size={24} />
              </button>
            )}

            {/* Image area */}
            <div className="image-gallery__lightbox-image-wrap">
              <div
                className="image-gallery__lightbox-image"
                style={{
                  background: items[lightboxIdx]?.bg || 'var(--surface-alt)',
                }}
              >
                {items[lightboxIdx]?.icon && (
                  <span className="image-gallery__lightbox-icon">
                    {items[lightboxIdx].icon}
                  </span>
                )}
                {items[lightboxIdx]?.label && (
                  <span className="image-gallery__lightbox-label">
                    {items[lightboxIdx].label}
                  </span>
                )}
              </div>
            </div>

            {/* Next */}
            {len > 1 && (
              <button
                type="button"
                className="image-gallery__lightbox-arrow image-gallery__lightbox-arrow--right"
                onClick={goNext}
                aria-label="Next image"
              >
                <IconChevronRight size={24} />
              </button>
            )}

            {/* Counter + caption */}
            <div className="image-gallery__lightbox-info">
              <span className="image-gallery__lightbox-counter">
                {lightboxIdx + 1} / {len}
              </span>
              {items[lightboxIdx]?.caption && (
                <span className="image-gallery__lightbox-caption">
                  {items[lightboxIdx].caption}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
