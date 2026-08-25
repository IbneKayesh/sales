import { useState } from 'react';
import { Link } from 'react-router-dom';
import formatCurrency from '@/utils/formatCurrency';
import QuantitySelector from '@/components/common/QuantitySelector';
import ProductActions from '@/components/product/ProductActions';
import { getVendorById } from '@/data/vendors';

const ProductDetails = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.price) * 100)
    : 0;

  return (
    <div className="product-details">
      <div className="product-details-category">
        <span className="badge badge-success">{product.category}</span>
      </div>

      <h1 className="product-details-name">{product.name}</h1>

      {product.vendor_id && (() => {
        const vendor = getVendorById(product.vendor_id);
        return vendor ? (
          <Link to={`/seller/${vendor.slug}`} className="product-details-vendor">
            <img src={vendor.logo} alt={vendor.name} className="product-details-vendor-logo" />
            <div className="product-details-vendor-info">
              <span className="product-details-vendor-name">
                {vendor.name}
                {vendor.verified && <span className="vendor-verified-mini">✓ Verified Seller</span>}
              </span>
              <span className="product-details-vendor-meta">
                ★ {vendor.rating} · {vendor.reviewCount} reviews · {vendor.location}
              </span>
            </div>
          </Link>
        ) : null;
      })()}

      <div className="product-details-rating">
        <div className="rating" aria-label={`${product.rating} out of 5 stars`}>
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`rating-star ${i < Math.floor(product.rating) ? '' : 'empty'}`}
            >
              ★
            </span>
          ))}
        </div>
        <span className="product-details-review-count">{product.reviewCount} reviews</span>
      </div>

      <div className="product-details-pricing">
        <span className="product-details-price">{formatCurrency(product.price)}</span>
        {hasDiscount && (
          <>
            <span className="price-original">{formatCurrency(product.originalPrice)}</span>
            <span className="price-discount">Save {discountPercent}%</span>
          </>
        )}
      </div>

      <p className="product-details-description">{product.description}</p>

      <div className="product-details-quantity">
        <label className="form-label">Quantity</label>
        <QuantitySelector
          quantity={quantity}
          onChange={setQuantity}
          min={1}
          max={product.stock}
        />
      </div>

      <ProductActions
        product={product}
        quantity={quantity}
        onQuantityChange={setQuantity}
      />
    </div>
  );
};

export default ProductDetails;
