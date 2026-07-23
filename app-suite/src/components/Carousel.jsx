import { useState, useEffect, useCallback, useRef } from 'react'
import { IconChevronLeft, IconChevronRight } from '../icons'

/**
 * Carousel — Auto-rotating slideshow with navigation, swipe, and keyboard support.
 *
 * Usage:
 *   <Carousel
 *     slides={[
 *       { content: <SlideContent />, label: 'Slide 1' },
 *       ...
 *     ]}
 *     autoPlay={5000}
 *     showArrows
 *     showDots
 *   />
 */

export default function Carousel({
  slides = [],
  autoPlay = 0,         // ms interval; 0 = no auto-play
  pauseOnHover = true,
  showArrows = true,
  showDots = true,
  loop = true,
  transition = 'slide', // 'slide' | 'fade'
  className = '',
  onChange,
  renderSlide,
  ...rest
}) {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchX, setTouchX] = useState(null)
  const timerRef = useRef(null)
  const containerRef = useRef(null)

  const len = slides.length
  const hasMultiple = len > 1

  const goTo = useCallback((index) => {
    if (!len) return
    const next = loop
      ? ((index % len) + len) % len
      : Math.max(0, Math.min(index, len - 1))
    setCurrent(next)
    onChange?.(next)
  }, [len, loop, onChange])

  const next = useCallback(() => goTo(current + 1), [goTo, current])
  const prev = useCallback(() => goTo(current - 1), [goTo, current])

  // Auto-play
  useEffect(() => {
    if (!autoPlay || !hasMultiple || isPaused) {
      clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => {
      goTo(current + 1)
    }, autoPlay)
    return () => clearInterval(timerRef.current)
  }, [autoPlay, hasMultiple, isPaused, current, goTo])

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!hasMultiple) return
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
    if (e.key === 'ArrowRight') { e.preventDefault(); next() }
  }, [hasMultiple, prev, next])

  // Touch/swipe handlers
  const handleTouchStart = useCallback((e) => {
    if (!hasMultiple) return
    setTouchX(e.touches[0].clientX)
  }, [hasMultiple])

  const handleTouchEnd = useCallback((e) => {
    if (touchX === null || !hasMultiple) return
    const dx = e.changedTouches[0].clientX - touchX
    if (Math.abs(dx) > 50) {
      if (dx > 0) prev()
      else next()
    }
    setTouchX(null)
  }, [touchX, hasMultiple, prev, next])

  if (!len) return null

  const containerClasses = [
    'carousel',
    `carousel--${transition}`,
    className,
  ].filter(Boolean).join(' ')

  return (
    <div
      className={containerClasses}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={hasMultiple ? 0 : -1}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image carousel"
      aria-live={autoPlay && !isPaused ? 'off' : 'polite'}
      ref={containerRef}
      {...rest}
    >
      {/* Slides track */}
      <div className="carousel__track" style={{ transform: transition === 'slide' ? `translateX(-${current * 100}%)` : undefined }}>
        {slides.map((slide, i) => {
          const isActive = i === current
          const content = renderSlide ? renderSlide(slide, i) : slide.content
          return (
            <div
              key={slide.key ?? i}
              className={`carousel__slide${isActive ? ' carousel__slide--active' : ''}${transition === 'fade' ? ` carousel__slide--${isActive ? 'enter' : 'exit'}` : ''}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} of ${len}${slide.label ? ` — ${slide.label}` : ''}`}
              aria-hidden={!isActive}
              style={transition === 'fade' ? { opacity: isActive ? 1 : 0 } : undefined}
            >
              {content}
            </div>
          )
        })}
      </div>

      {/* Arrows */}
      {showArrows && hasMultiple && (
        <>
          <button
            type="button"
            className="carousel__arrow carousel__arrow--left"
            onClick={prev}
            disabled={!loop && current === 0}
            aria-label="Previous slide"
          >
            <IconChevronLeft size={20} />
          </button>
          <button
            type="button"
            className="carousel__arrow carousel__arrow--right"
            onClick={next}
            disabled={!loop && current === len - 1}
            aria-label="Next slide"
          >
            <IconChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && hasMultiple && (
        <div className="carousel__dots" role="tablist" aria-label="Slide navigation">
          {slides.map((slide, i) => (
            <button
              key={slide.key ?? i}
              type="button"
              className={`carousel__dot${i === current ? ' carousel__dot--active' : ''}`}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to slide ${i + 1}${slide.label ? ` — ${slide.label}` : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
