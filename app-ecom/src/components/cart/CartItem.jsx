import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { CloseIcon } from '@/icons';
import QuantitySelector from '@/components/common/QuantitySelector';
import formatCurrency from '@/utils/formatCurrency';
import { productSlug } from '@/utils/slugify';
import { getVendorById } from '@/data/vendors';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart, toggleItemSelection, isItemSelected } = useCart();
  const vendor = getVendorById(item.vendor_id);
  const selected = isItemSelected(item.id);

  return (
    <div className={`cart-item ${selected ? 'cart-item-selected' : ''}`}>
      <label className="cart-item-checkbox">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => toggleItemSelection(item.id)}
          aria-label={`Select ${item.name}`}
        />
        <span className="cart-item-checkbox-custom" />
      </label>

      <Link to={`/product/${productSlug(item.name, item.id)}`} className="cart-item-image-link">
        <img
          src={item.image}
          alt={item.name}
          className="cart-item-image"
        />
      </Link>

      <div className="cart-item-details">
        <Link to={`/product/${productSlug(item.name, item.id)}`} className="cart-item-name">
          {item.name}
        </Link>
        {vendor && (
          <Link to={`/seller/${vendor.slug}`} className="cart-item-vendor">
            Sold by: {vendor.name}
            {vendor.verified && <span className="vendor-verified-mini">✓</span>}
          </Link>
        )}
        <p className="cart-item-price">{formatCurrency(item.price)}</p>

        <div className="cart-item-actions">
          <QuantitySelector
            quantity={item.quantity}
            onChange={(qty) => updateQuantity(item.id, qty)}
            min={1}
            max={item.stock || 99}
          />
          <button
            onClick={() => removeFromCart(item.id)}
            className="cart-item-remove"
            aria-label={`Remove ${item.name} from cart`}
          >
            <CloseIcon size={12} /> Remove
          </button>
        </div>
      </div>

      <div className="cart-item-subtotal">
        <span className="cart-item-subtotal-label">Subtotal</span>
        <span className="cart-item-subtotal-value">
          {formatCurrency(item.price * item.quantity)}
        </span>
      </div>
    </div>
  );
};

export default CartItem;
