import { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MoreIcon, ChevronLeftIcon } from '@/icons';
import useCategories from '@/hooks/useCategories';

const CategoryBar = () => {
  const { categories } = useCategories();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');
  const [showAll, setShowAll] = useState(false);
  const listRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(10);

  // Measure how many items fit in one row
  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll('.category-bar-item');
    if (items.length < 2) return;

    const firstTop = items[0].getBoundingClientRect().top;
    let count = 0;
    for (let i = 0; i < items.length; i++) {
      if (items[i].getBoundingClientRect().top === firstTop) {
        count++;
      } else {
        break;
      }
    }
    if (count > 0) setVisibleCount(count);
  }, [categories]);

  return (
    <div className="category-bar">
      {!showAll ? (
        <div className="category-bar-list" ref={listRef}>
          {categories.slice(0, visibleCount).map(category => (
            <Link
              key={category.id}
              to={`/?category=${category.id}`}
              className={`category-bar-item ${activeCategory === category.id ? 'active' : ''}`}
            >
              <div className="category-bar-img-wrapper">
                <img
                  src={category.image}
                  alt={category.name}
                  className="category-bar-img"
                  loading="lazy"
                />
              </div>
              <span className="category-bar-name">{category.name}</span>
            </Link>
          ))}

          {categories.length > visibleCount && (
            <button
              className="category-bar-item category-bar-more"
              onClick={() => setShowAll(true)}
            >
              <div className="category-bar-img-wrapper">
                <div className="category-bar-img category-bar-more-icon">
                  <MoreIcon size={28} />
                </div>
              </div>
              <span className="category-bar-name">Show More</span>
            </button>
          )}
        </div>
      ) : (
        <div className="category-bar-list">
          {categories.map(category => (
            <Link
              key={category.id}
              to={`/?category=${category.id}`}
              className={`category-bar-item ${activeCategory === category.id ? 'active' : ''}`}
            >
              <div className="category-bar-img-wrapper">
                <img
                  src={category.image}
                  alt={category.name}
                  className="category-bar-img"
                  loading="lazy"
                />
              </div>
              <span className="category-bar-name">{category.name}</span>
            </Link>
          ))}

          <button
            className="category-bar-item category-bar-more"
            onClick={() => setShowAll(false)}
          >
            <div className="category-bar-img-wrapper">
              <div className="category-bar-img category-bar-more-icon">
                <ChevronLeftIcon size={28} />
              </div>
            </div>
            <span className="category-bar-name">Show Less</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryBar;
