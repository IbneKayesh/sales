import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import CartItem from '@/components/cart/CartItem';
import { getVendorById } from '@/data/vendors';
import { useCart } from '@/context/CartContext';

const CartList = ({ items }) => {
  const { allItemsSelected, someItemsSelected, selectAllItems, deselectAllItems, selectedItems, removeFromCart } = useCart();

  const handleDeleteSelected = () => {
    selectedItems.forEach(item => removeFromCart(item.id));
  };

  const groupedItems = useMemo(() => {
    const groups = {};
    items.forEach(item => {
      const vid = item.vendor_id || 'unknown';
      if (!groups[vid]) {
        groups[vid] = {
          vendor: getVendorById(vid),
          vendorId: vid,
          items: [],
          subtotal: 0
        };
      }
      groups[vid].items.push(item);
      groups[vid].subtotal += item.price * item.quantity;
    });
    return Object.values(groups);
  }, [items]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="cart-list">
      {/* Select All Header */}
      <div className="cart-select-all">
        <label className="cart-item-checkbox">
          <input
            type="checkbox"
            checked={allItemsSelected}
            ref={el => { if (el) el.indeterminate = someItemsSelected; }}
            onChange={() => allItemsSelected ? deselectAllItems() : selectAllItems()}
            aria-label="Select all items"
          />
          <span className="cart-item-checkbox-custom" />
        </label>
        <span className="cart-select-all-text">
          {allItemsSelected ? 'All items selected' : someItemsSelected ? 'Some items selected' : 'Select all items'}
        </span>
        {(allItemsSelected || someItemsSelected) && (
          <button className="cart-delete-selected" onClick={handleDeleteSelected}>
            Delete Selected ({selectedItems.length})
          </button>
        )}
      </div>

      {groupedItems.map(group => (
        <div key={group.vendorId} className="cart-vendor-group">
          <div className="cart-vendor-header">
            {group.vendor ? (
              <Link to={`/seller/${group.vendor.slug}`} className="cart-vendor-info">
                <img
                  src={group.vendor.logo}
                  alt={group.vendor.name}
                  className="cart-vendor-logo"
                />
                <span className="cart-vendor-name">
                  {group.vendor.name}
                  {group.vendor.verified && (
                    <span className="vendor-verified-mini">✓ Verified Seller</span>
                  )}
                </span>
              </Link>
            ) : (
              <span className="cart-vendor-name">Other Seller</span>
            )}
            <span className="cart-vendor-subtotal">
              Subtotal: ${group.subtotal.toFixed(2)}
            </span>
          </div>
          {group.items.map(item => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default CartList;
