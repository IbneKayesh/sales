import {
  Children,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { IconChevronLeft, IconChevronRight, IconClose } from '../icons'

/**
 * ImageGallery — Responsive grid gallery with lightbox preview.
 *
 * Usage:
 *   <ImageGallery columns={3}>
 *     <ImageGalleryItem
 *       bg="linear-gradient(135deg, var(--primary-bg), var(--surface-alt))"
 *       icon={<IconChart size={24} />}
 *       label="Revenue Dashboard"
 *       caption="Revenue Dashboard"
 *       subtitle="Q2 2026 performance"
 *     />
 *   </ImageGallery>
 *
 * Each item renders a default thumbnail from `bg`/`icon`/`label`; pass children
 * to replace it with custom thumbnail content. `caption`/`subtitle` render the
 * overlay caption, and the same content is shown in the lightbox.
 *
 * The lightbox is uncontrolled by default. Pass `lightboxIndex` (null = closed)
 * together with `onLightboxChange` to control it and observe which image is open.
 */

const ImageGalleryContext = createContext(null)
const ImageGalleryItemIndexContext = createContext(null)

export default function ImageGallery({
  columns = 3,                        // 2 | 3 | 4
  gap = 'var(--sp-3)',
  lightbox = true,
  lightboxIndex,
  onLightboxChange,
  className = '',
  children,
  ...rest
}) {
  const items = Children.toArray(children)
  const len = items.length
  const [localIndex, setLocalIndex] = useState(null)
  const currentIndex = lightboxIndex !== undefined ? lightboxIndex : localIndex
  const lightboxOpen = currentIndex !== null && currentIndex !== undefined

  const setIndex = useCallback(
    (next) => {
      if (lightboxIndex === undefined) setLocalIndex(next)
      onLightboxChange?.(next)
    },
    [lightboxIndex, onLightboxChange],
  )

  const openLightbox = useCallback(
    (index) => {
      if (!lightbox || !len) return
      setIndex(index)
    },
    [lightbox, len, setIndex],
  )

  const closeLightbox = useCallback(() => setIndex(null), [setIndex])

  const goNext = useCallback(() => {
    if (!lightboxOpen) return
    setIndex((currentIndex + 1) % len)
  }, [lightboxOpen, currentIndex, len, setIndex])

  const goPrev = useCallback(() => {
    if (!lightboxOpen) return
    setIndex((currentIndex - 1 + len) % len)
  }, [lightboxOpen, currentIndex, len, setIndex])

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback(
    (e) => {
      if (!lightboxOpen) return
      if (e.key === 'Escape') {
        e.preventDefault()
        closeLightbox()
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
    },
    [lightboxOpen, closeLightbox, goNext, goPrev],
  )

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

  const activeItem = lightboxOpen ? items[currentIndex]?.props ?? {} : {}

  const gridClass = `image-gallery image-gallery--cols-${Math.min(Math.max(columns, 2), 4)}${className ? ' ' + className : ''}`

  return (
    <ImageGalleryContext.Provider value={{ open: openLightbox, count: len }}>
      <div className={gridClass} style={{ gap }} {...rest}>
        {items.map((item, i) => (
          <ImageGalleryItemIndexContext.Provider key={item.key ?? i} value={i}>
            {item}
          </ImageGalleryItemIndexContext.Provider>
        ))}
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
                style={{ background: activeItem.bg || 'var(--surface-alt)' }}
              >
                {activeItem.icon && (
                  <span className="image-gallery__lightbox-icon">
                    {activeItem.icon}
                  </span>
                )}
                {activeItem.label && (
                  <span className="image-gallery__lightbox-label">
                    {activeItem.label}
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
                {currentIndex + 1} / {len}
              </span>
              {activeItem.caption && (
                <span className="image-gallery__lightbox-caption">
                  {activeItem.caption}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </ImageGalleryContext.Provider>
  )
}

/* ---------- Item ---------- */

export function ImageGalleryItem({
  bg,
  icon,
  label,
  alt,
  caption,
  subtitle,
  children,
  className = '',
  ...rest
}) {
  const gallery = useContext(ImageGalleryContext)
  const index = useContext(ImageGalleryItemIndexContext)

  if (!gallery || index === null) return null

  return (
    <button
      type="button"
      className={`image-gallery__item${className ? ' ' + className : ''}`}
      onClick={() => gallery.open(index)}
      aria-label={`View ${alt || label || `image ${index + 1}`}`}
      {...rest}
    >
      {children ?? (
        <div
          className="image-gallery__thumb"
          style={{ background: bg || 'var(--surface-alt)' }}
        >
          {icon && <span className="image-gallery__thumb-icon">{icon}</span>}
          {label && (
            <span className="image-gallery__thumb-label">{label}</span>
          )}
        </div>
      )}

      {caption && (
        <div className="image-gallery__caption">
          <span className="image-gallery__caption-title">{caption}</span>
          {subtitle && (
            <span className="image-gallery__caption-sub">{subtitle}</span>
          )}
        </div>
      )}
    </button>
  )
}
