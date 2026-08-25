import { useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, SearchIcon, CartIcon } from '@/icons';
import ProductCard from '@/components/product/ProductCard';
import useProducts from '@/hooks/useProducts';

const NotFoundPage = () => {
  const { allProducts } = useProducts();

  useEffect(() => {
    document.title = 'Page Not Found | ShopEasy';
  }, []);

  const suggestedProducts = useMemo(() => {
    return [...allProducts]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  }, [allProducts]);

  return (
    <main className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">
          <CartIcon size={64} />
        </div>
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-message">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            <HomeIcon size={16} /> Go Home
          </Link>
          <Link to="/cart" className="btn btn-outline">
            <CartIcon size={16} /> View Cart
          </Link>
        </div>
      </div>

      {suggestedProducts.length > 0 && (
        <div className="not-found-suggested">
          <div className="container">
            <h3 className="not-found-suggested-title">You might like these products</h3>
            <div className="not-found-suggested-grid">
              {suggestedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default NotFoundPage;
