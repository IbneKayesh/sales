import { Link } from 'react-router-dom';
import { CartIcon } from '@/icons';
import ProductCard from '@/components/product/ProductCard';

const EmptyCart = ({ suggestedProducts = [] }) => {
  return (
    <div className="empty-cart">
      <div className="empty-cart-icon"><CartIcon size={48} /></div>
      <h2 className="empty-cart-title">Your cart is empty</h2>
      <p className="empty-cart-message">
        Looks like you haven't added any products yet. Start shopping to fill your cart!
      </p>
      <Link to="/" className="btn btn-primary">
        Continue Shopping
      </Link>

      {suggestedProducts.length > 0 && (
        <div className="empty-cart-suggested">
          <h3 className="empty-cart-suggested-title">You might like</h3>
          <div className="empty-cart-suggested-grid">
            {suggestedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmptyCart;
