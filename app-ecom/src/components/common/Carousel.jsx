import { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@/icons';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200',
    title: 'Summer Collection',
    subtitle: 'Up to 50% off on selected items',
    link: '/?category=clothing'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200',
    title: 'New Arrivals',
    subtitle: 'Check out the latest electronics',
    link: '/?category=electronics'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200',
    title: 'Home Essentials',
    subtitle: 'Everything for your home at great prices',
    link: '/?category=home'
  }
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="carousel" role="region" aria-label="Featured promotions">
      <div className="carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {slides.map(slide => (
          <a key={slide.id} href={slide.link} className="carousel-slide">
            <img src={slide.image} alt={slide.title} className="carousel-image" />
            <div className="carousel-overlay">
              <div className="carousel-content">
                <h2 className="carousel-title">{slide.title}</h2>
                <p className="carousel-subtitle">{slide.subtitle}</p>
                <span className="btn btn-primary carousel-btn">Shop Now</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <button className="carousel-arrow carousel-prev" onClick={prev} aria-label="Previous slide">
        <ChevronLeftIcon size={20} />
      </button>
      <button className="carousel-arrow carousel-next" onClick={next} aria-label="Next slide">
        <ChevronRightIcon size={20} />
      </button>

      <div className="carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
