import { Link, useSearchParams } from 'react-router-dom';
import useCategories from '@/hooks/useCategories';
import ProductCard from '@/components/product/ProductCard';

const ProductGrid = ({ products, title, hasMore, onLoadMore, totalFiltered, suggestedProducts, sortBy, setSortBy }) => {
  const { categories } = useCategories();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');

  if (!products || products.length === 0) {
    return (
      <div className="product-grid-empty">
        <p>No products found.</p>
        {suggestedProducts && suggestedProducts.length > 0 && (
          <div className="suggested-section">
            <h3 className="suggested-title">Suggested Products</h3>
            <div className="product-grid">
              {suggestedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="product-grid-section" aria-labelledby="products-title">
      <div className="product-grid-header">
        {title && <h2 id="products-title" className="section-title">{title}</h2>}
        <div className="product-grid-sort">
          <label className="sort-label">Sort by:</label>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name (A-Z)</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="reviews">Most Reviews</option>
            <option value="stock">Most in Stock</option>
          </select>
        </div>
      </div>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div className="load-more-area">
          <div className="bottom-category-bar">
            <Link
              to="/"
              className={`bottom-category-link ${!activeCategory ? 'active' : ''}`}
            >
              All
            </Link>
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/?category=${cat.id}`}
                className={`bottom-category-link ${activeCategory === cat.id ? 'active' : ''}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <button className="btn btn-outline load-more-btn" onClick={onLoadMore}>
            Load More ({products.length} of {totalFiltered})
          </button>
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <p className="products-end">All {products.length} products loaded</p>
      )}
    </section>
  );
};

export default ProductGrid;
