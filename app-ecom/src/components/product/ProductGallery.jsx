import { useState, useRef } from 'react';
import { ZoomIcon } from '@/icons';

const ProductGallery = ({ images, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageRef = useRef(null);

  const allImages = images || [];
  const mainImage = allImages[selectedIndex] || '';

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => setIsZoomed(false);

  return (
    <div className="product-gallery">
      <div
        className={`product-gallery-main ${isZoomed ? 'zoomed' : ''}`}
        ref={imageRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={mainImage}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          className="product-gallery-main-image"
          style={isZoomed ? {
            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
          } : undefined}
        />

        {!isZoomed && (
          <div className="zoom-hint"><ZoomIcon size={14} /> Hover to zoom</div>
        )}

        {isZoomed && (
          <div className="zoom-active-hint"><ZoomIcon size={14} /> Move mouse to pan</div>
        )}
      </div>

      {allImages.length > 1 && (
        <div className="product-gallery-thumbnails">
          {allImages.map((image, index) => (
            <button
              key={index}
              className={`product-gallery-thumbnail ${index === selectedIndex ? 'active' : ''}`}
              onClick={() => setSelectedIndex(index)}
              onMouseEnter={() => setSelectedIndex(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img src={image} alt={`${productName} thumbnail ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
