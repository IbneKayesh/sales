import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

const ProductActions = ({ product, quantity, onQuantityChange }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="product-actions">
      <div className="product-actions-buttons">
        <button
          className="btn btn-primary btn-lg"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          aria-label={`Add ${product.name} to cart`}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
        <button
          className="btn btn-secondary btn-lg"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
        >
          Buy Now
        </button>
      </div>
      <div className="product-actions-stock">
        {isOutOfStock ? (
          <span className="badge badge-danger">Out of Stock</span>
        ) : product.stock <= 10 ? (
          <span className="badge badge-warning">Only {product.stock} left in stock</span>
        ) : (
          <span className="badge badge-success">In Stock ({product.stock} available)</span>
        )}
      </div>
    </div>
  );
};

export default ProductActions;
