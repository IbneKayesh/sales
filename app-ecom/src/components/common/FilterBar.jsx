import useCategories from '@/hooks/useCategories';

const FilterBar = ({
  sortBy, setSortBy,
  filterCategory, setFilterCategory,
  filterStock, setFilterStock,
  filterRating, setFilterRating,
  priceRange, setPriceRange,
  totalFiltered, totalProducts
}) => {
  const { categories } = useCategories();

  const handleCategoryChange = (e) => {
    setFilterCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleStockChange = (e) => {
    setFilterStock(e.target.value);
  };

  const handleRatingChange = (e) => {
    setFilterRating(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPriceRange(e.target.value);
  };

  const clearFilters = () => {
    setFilterCategory('all');
    setSortBy('name');
    setFilterStock('all');
    setFilterRating('all');
    setPriceRange('all');
  };

  const hasActiveFilters = filterCategory !== 'all' || filterStock !== 'all' || filterRating !== 'all' || priceRange !== 'all' || sortBy !== 'name';

  return (
    <div className="filter-bar">
      <div className="filter-bar-row">
        <div className="filter-bar-results">
          <span className="filter-bar-count">
            {totalFiltered} of {totalProducts} products
          </span>
        </div>

        <div className="filter-bar-controls">
          <div className="filter-group">
            <label htmlFor="filter-category" className="filter-label">Category</label>
            <select
              id="filter-category"
              className="filter-select"
              value={filterCategory}
              onChange={handleCategoryChange}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-price" className="filter-label">Price</label>
            <select
              id="filter-price"
              className="filter-select"
              value={priceRange}
              onChange={handlePriceChange}
            >
              <option value="all">All Prices</option>
              <option value="under25">Under $25</option>
              <option value="under50">$25 - $50</option>
              <option value="under100">$50 - $100</option>
              <option value="over100">Over $100</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-rating" className="filter-label">Rating</label>
            <select
              id="filter-rating"
              className="filter-select"
              value={filterRating}
              onChange={handleRatingChange}
            >
              <option value="all">All Ratings</option>
              <option value="4+">4★ & above</option>
              <option value="3+">3★ & above</option>
              <option value="2+">2★ & above</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-stock" className="filter-label">Stock</label>
            <select
              id="filter-stock"
              className="filter-select"
              value={filterStock}
              onChange={handleStockChange}
            >
              <option value="all">All</option>
              <option value="inStock">In Stock</option>
              <option value="outOfStock">Out of Stock</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-by" className="filter-label">Sort by</label>
            <select
              id="sort-by"
              className="filter-select"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="stock">Most in Stock</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button className="filter-clear-btn" onClick={clearFilters}>
              ✕ Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
