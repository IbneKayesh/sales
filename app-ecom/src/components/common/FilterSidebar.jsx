import useCategories from '@/hooks/useCategories';

const FilterSidebar = ({
  filterCategory, setFilterCategory,
  filterStock, setFilterStock,
  filterRating, setFilterRating,
  filterVendor, setFilterVendor,
  priceMin, setPriceMin,
  priceMax, setPriceMax,
  appliedPriceMin, appliedPriceMax,
  onApplyPrice,
  totalFiltered, totalProducts
}) => {
  const { categories } = useCategories();

  const clearFilters = () => {
    setFilterCategory('all');
    setFilterStock('all');
    setFilterRating('all');
    setFilterVendor('all');
    setPriceMin('');
    setPriceMax('');
    onApplyPrice('', '');
  };

  const hasActiveFilters = filterCategory !== 'all' || filterStock !== 'all' || filterRating !== 'all' || filterVendor !== 'all' || appliedPriceMin !== '' || appliedPriceMax !== '';

  return (
    <aside className="filter-sidebar">
      <div className="filter-sidebar-header">
        <h3 className="filter-sidebar-title">Filters</h3>
        {hasActiveFilters && (
          <button className="filter-clear-btn" onClick={clearFilters}>
            Clear All
          </button>
        )}
      </div>

      <div className="filter-sidebar-count">
        {totalFiltered} of {totalProducts} products
      </div>

      {/* Categories */}
      <div className="filter-section">
        <h4 className="filter-section-title">Categories</h4>
        <ul className="filter-category-list">
          <li>
            <button
              className={`filter-category-item ${filterCategory === 'all' ? 'active' : ''}`}
              onClick={() => setFilterCategory('all')}
            >
              All Categories
            </button>
          </li>
          {categories.map(cat => (
            <li key={cat.id}>
              <button
                className={`filter-category-item ${filterCategory === cat.id ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat.id)}
              >
                {cat.name}
                <span className="filter-category-count">{cat.productCount}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <h4 className="filter-section-title">Price Range</h4>
        <div className="filter-price-inputs">
          <div className="filter-price-field">
            <span className="filter-price-symbol">$</span>
            <input
              type="number"
              className="filter-price-input"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              min="0"
            />
          </div>
          <span className="filter-price-separator">–</span>
          <div className="filter-price-field">
            <span className="filter-price-symbol">$</span>
            <input
              type="number"
              className="filter-price-input"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              min="0"
            />
          </div>
        </div>
        <button
          className="filter-price-btn"
          onClick={() => onApplyPrice(priceMin, priceMax)}
        >
          Filter
        </button>
      </div>

      {/* Ratings */}
      <div className="filter-section">
        <h4 className="filter-section-title">Rating</h4>
        <div className="filter-radio-group">
          {[
            { value: 'all', label: 'All Ratings' },
            { value: '4+', label: '★★★★☆ & Up' },
            { value: '3+', label: '★★★☆☆ & Up' },
            { value: '2+', label: '★★☆☆☆ & Up' }
          ].map(opt => (
            <label key={opt.value} className="filter-radio">
              <input
                type="radio"
                name="rating"
                value={opt.value}
                checked={filterRating === opt.value}
                onChange={(e) => setFilterRating(e.target.value)}
              />
              <span className="filter-radio-label">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Stock */}
      <div className="filter-section">
        <h4 className="filter-section-title">Availability</h4>
        <div className="filter-radio-group">
          {[
            { value: 'all', label: 'All Items' },
            { value: 'inStock', label: 'In Stock' },
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'outOfStock', label: 'Out of Stock' }
          ].map(opt => (
            <label key={opt.value} className="filter-radio">
              <input
                type="radio"
                name="stock"
                value={opt.value}
                checked={filterStock === opt.value}
                onChange={(e) => setFilterStock(e.target.value)}
              />
              <span className="filter-radio-label">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

    </aside>
  );
};

export default FilterSidebar;
