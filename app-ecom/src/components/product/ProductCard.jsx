import { Link, useNavigate } from 'react-router-dom';
import formatCurrency from '@/utils/formatCurrency';
import { productSlug } from '@/utils/slugify';
import { getVendorById } from '@/data/vendors';
import { getProductTags } from '@/utils/productTags';

const ProductCard = ({ product }) => {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const tags = getProductTags(product);

  const navigate = useNavigate();

  const handleVendorClick = (e, slug) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/seller/${slug}`);
  };

  return (
    <div className={`product-card ${product.stock <= 0 ? 'product-card-sold-out' : ''}`}>
      <Link to={`/product/${productSlug(product.name, product.id)}`} className="product-card-link">
        <div className="product-card-image-wrapper">
          <img
            src={product.image}
            alt={product.name}
            className="product-card-image"
            loading="lazy"
          />
          {hasDiscount && (
            <span className="product-card-badge">-{discountPercent}%</span>
          )}
          {tags.length > 0 && (
            <div className="product-card-tags">
              {tags.map((tag, i) => (
                <span key={i} className={`product-tag product-tag-${tag.type}`}>
                  {tag.type === 'hot' && '🔥 '}
                  {tag.type === 'flash-sale' && '⚡ '}
                  {tag.type === 'popular' && '🏆 '}
                  {tag.type === 'trending' && '📈 '}
                  {tag.type === 'new' && '🆕 '}
                  {tag.type === 'low-stock' && '⏰ '}
                  {tag.label}
                </span>
              ))}
            </div>
          )}
          {product.stock <= 0 && (
            <div className="product-card-sold-out-overlay">
              <span>SOLD OUT</span>
            </div>
          )}
        </div>
        <div className="product-card-content">
          {product.vendor_id && (() => {
            const vendor = getVendorById(product.vendor_id);
            return vendor ? (
              <span className="product-card-vendor" onClick={(e) => handleVendorClick(e, vendor.slug)}>
                {vendor.name}
                {vendor.verified && <span className="vendor-verified-mini" title="Verified">✓</span>}
              </span>
            ) : null;
          })()}
          <h3 className="product-card-name">{product.name}</h3>
          <p className="product-card-description">{product.description}</p>
          <div className="product-card-rating" aria-label={`${product.rating} out of 5 stars`}>
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`rating-star ${i < Math.floor(product.rating) ? '' : 'empty'}`}
              >
                ★
              </span>
            ))}
            <span className="product-card-review-count">({product.reviewCount})</span>
          </div>
          <div className="product-card-pricing">
            <span className="price">{formatCurrency(product.price)}</span>
            {hasDiscount && (
              <span className="price-original">{formatCurrency(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
