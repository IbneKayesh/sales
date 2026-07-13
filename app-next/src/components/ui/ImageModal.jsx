import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Full-screen image/media modal with zoom, pan, and keyboard navigation.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {Function} props.onClose
 * @param {string} props.src — Image URL
 * @param {string} props.alt — Alt text
 * @param {string} props.title — Optional title shown in header bar
 * @param {Array} props.gallery — Array of { src, alt, title } for prev/next navigation
 * @param {number} props.initialIndex — Starting index in gallery
 */
export default function ImageModal({ open, onClose, src, alt = '', title, gallery, initialIndex = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);

  // Reset zoom/pan when image changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [currentIndex, src]);

  // Keyboard controls
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      switch (e.key) {
        case 'Escape': onClose(); break;
        case '+': case '=': setZoom(z => Math.min(5, z + 0.25)); break;
        case '-': setZoom(z => Math.max(0.25, z - 0.25)); break;
        case '0': setZoom(1); setPan({ x: 0, y: 0 }); break;
        case 'ArrowLeft':
          if (gallery && currentIndex > 0) setCurrentIndex(i => i - 1);
          break;
        case 'ArrowRight':
          if (gallery && currentIndex < gallery.length - 1) setCurrentIndex(i => i + 1);
          break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose, gallery, currentIndex]);

  // Mouse wheel zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(z => Math.max(0.25, Math.min(5, z + delta)));
  }, []);

  // Pan drag handlers
  const handleMouseDown = useCallback((e) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [zoom, pan]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const currentSrc = gallery ? gallery[currentIndex]?.src : src;
  const currentAlt = gallery ? gallery[currentIndex]?.alt : alt;
  const currentTitle = gallery ? gallery[currentIndex]?.title : title;

  if (!open) return null;

  return (
    <>
      <div className="image-modal-backdrop" onClick={onClose} />
      <div className="image-modal-container" onWheel={handleWheel}>
        {/* Top toolbar */}
        <div className="image-modal-toolbar">
          <div className="image-modal-toolbar-left">
            {currentTitle && <span className="image-modal-title">{currentTitle}</span>}
            {gallery && (
              <span className="image-modal-counter">
                {currentIndex + 1} / {gallery.length}
              </span>
            )}
          </div>
          <div className="image-modal-toolbar-right">
            <button className="image-modal-btn" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} title="Reset zoom (0)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M12 3v18"/></svg>
            </button>
            <button className="image-modal-btn" onClick={() => setZoom(z => Math.max(0.25, z - 0.25))} title="Zoom out (-)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <span className="image-modal-zoom-level">{Math.round(zoom * 100)}%</span>
            <button className="image-modal-btn" onClick={() => setZoom(z => Math.min(5, z + 0.25))} title="Zoom in (+)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <div className="image-modal-divider" />
            <button className="image-modal-close" onClick={onClose} title="Close (Esc)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* Image area */}
        <div
          className="image-modal-content"
          onMouseDown={handleMouseDown}
          style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
          {/* Gallery arrows */}
          {gallery && currentIndex > 0 && (
            <button
              className="image-modal-nav image-modal-nav-left"
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(i => i - 1); }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
          )}
          {gallery && currentIndex < gallery.length - 1 && (
            <button
              className="image-modal-nav image-modal-nav-right"
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(i => i + 1); }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          )}

          <img
            ref={imgRef}
            src={currentSrc}
            alt={currentAlt}
            className="image-modal-img"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            }}
            draggable={false}
          />
        </div>

        {/* Zoom hint */}
        {zoom === 1 && (
          <div className="image-modal-hint">
            Scroll to zoom · Drag to pan · ← → for gallery
          </div>
        )}
      </div>
    </>
  );
}
