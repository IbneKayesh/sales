import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useProduct from '@/hooks/useProduct';
import ProductGallery from '@/components/product/ProductGallery';
import ProductDetails from '@/components/product/ProductDetails';
import SuggestedProducts from '@/components/product/SuggestedProducts';
import ReviewList from '@/components/review/ReviewList';


const ProductDetailsPage = () => {
  const { slug } = useParams();
  const {
    product,
    reviews,
    suggestedProducts,
    averageRating,
    ratingBreakdown,
    reviewCount,
    error
  } = useProduct(slug);

  if (error) {
    return (
      <main className="page">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h1 style={{ marginBottom: 'var(--spacing-4)' }}>Product Not Found</h1>
          <p style={{ color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-6)' }}>
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="page">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div className="spinner" style={{ margin: '0 auto' }} />
          <p style={{ marginTop: 'var(--spacing-4)', color: 'var(--color-gray-500)' }}>Loading...</p>
        </div>
      </main>
    );
  }

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | ShopEasy`;
    } else {
      document.title = 'ShopEasy - Online Shopping';
    }

    return () => {
      document.title = 'ShopEasy - Online Shopping';
    };
  }, [product]);

  const [specsExpanded, setSpecsExpanded] = useState(false);

  // Ad banners based on category
  const adBanners = {
    electronics: { title: 'Tech Deals', subtitle: 'Up to 40% off on electronics & accessories', image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200', color: '#2563eb' },
    clothing: { title: 'Fashion Sale', subtitle: 'New arrivals this week — shop the latest trends', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200', color: '#8b5cf6' },
    home: { title: 'Home Essentials', subtitle: 'Free shipping on orders $50+', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200', color: '#059669' },
    sports: { title: 'Fitness Gear', subtitle: 'Gear up for your next workout', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200', color: '#dc2626' },
    accessories: { title: 'Accessories', subtitle: 'Complete your look with premium accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200', color: '#d97706' },
    food: { title: 'Fresh Deals', subtitle: 'Organic & natural products — farm to table', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200', color: '#16a34a' },
  };
  const ad = adBanners[product.category] || { title: 'ShopEasy Deals', subtitle: 'Save big on top products today', image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200', color: '#2563eb' };

  return (
    <main className="page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to={`/?category=${product.category}`}>{product.category}</Link>
          <span>/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        {/* Ad Banner - Top */}
        <Link to={`/?category=${product.category}`} className="product-ad-banner">
          <img src={ad.image} alt={ad.title} className="product-ad-image" />
          <div className="product-ad-overlay" style={{ backgroundColor: `${ad.color}cc` }} />
          <div className="product-ad-content">
            <span className="product-ad-title">{ad.title}</span>
            <span className="product-ad-subtitle">{ad.subtitle}</span>
          </div>
          <span className="product-ad-cta">Shop Now →</span>
        </Link>

        <div className="product-details-layout">
          <div className="product-details-gallery">
            <ProductGallery
              images={product.images || [
                product.image,
                product.image + (product.image.includes('?') ? '&' : '?') + 'fit=crop&h=600',
                product.image + (product.image.includes('?') ? '&' : '?') + 'fit=crop&w=400&h=600'
              ]}
              productName={product.name}
            />
          </div>
          <div className="product-details-info">
            <ProductDetails product={product} />
          </div>
        </div>

        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <section className="section" aria-labelledby="specs-title">
            <h2 id="specs-title" className="section-title">Specifications</h2>
            <div className={`product-details-specifications ${specsExpanded ? 'expanded' : ''}`}>
              <table className="product-details-spec-table">
                <tbody>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key}>
                      <td className="spec-label">{key}</td>
                      <td className="spec-value">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="specs-toggle-btn"
              onClick={() => setSpecsExpanded(!specsExpanded)}
            >
              {specsExpanded ? 'Show Less' : 'Show More'}
              <span className={`specs-toggle-icon ${specsExpanded ? 'rotated' : ''}`}>▼</span>
            </button>
          </section>
        )}

        <section className="section" aria-labelledby="reviews-title">
          <h2 id="reviews-title" className="section-title">Customer Reviews</h2>
          <ReviewList
            reviews={reviews}
            averageRating={averageRating}
            ratingBreakdown={ratingBreakdown}
            reviewCount={reviewCount}
          />
        </section>
      </div>

      <SuggestedProducts products={suggestedProducts} />
    </main>
  );
};

export default ProductDetailsPage;
