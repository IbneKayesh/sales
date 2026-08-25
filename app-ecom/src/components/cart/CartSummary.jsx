import { Link } from 'react-router-dom';
import formatCurrency from '@/utils/formatCurrency';
import { useCart } from '@/context/CartContext';
import { getVendorDeliveryFee } from '@/data/vendors';

const CartSummary = ({ subtotal, deliveryFee, discount, total, itemCount }) => {
  const {
    cartByVendor, selectedItems, selectedByVendor, vendorCoupons,
    getVendorDiscount, totalDeliveryFee, selectedItemIds
  } = useCart();

  // Calculate totals from selected items only
  const selectedSubtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedCount = selectedItems.reduce((count, item) => count + item.quantity, 0);

  // Calculate selected vendor delivery
  const selectedTotalDelivery = selectedByVendor.reduce((sum, group) => {
    return sum + getVendorDeliveryFee(group.vendorId, group.subtotal);
  }, 0);

  // Calculate selected vendor discounts
  const selectedVendorDiscount = selectedByVendor.reduce((sum, group) => {
    return sum + getVendorDiscount(group.vendorId, group.subtotal);
  }, 0);

  const selectedTotal = Math.max(0, selectedSubtotal + selectedTotalDelivery - selectedVendorDiscount);

  return (
    <div className="cart-summary">
      <h3 className="cart-summary-title">Order Summary</h3>

      {/* Per-vendor breakdown for selected items */}
      {selectedByVendor.length > 0 && (
        <div className="cart-summary-vendors">
          {selectedByVendor.map(group => {
            const vendorDiscount = getVendorDiscount(group.vendorId, group.subtotal);
            const vendorDelivery = getVendorDeliveryFee(group.vendorId, group.subtotal);
            const vendor = group.vendor;
            const freeShipping = vendor?.freeShippingThreshold && group.subtotal >= vendor.freeShippingThreshold;

            return (
              <div key={group.vendorId} className="cart-summary-vendor">
                <div className="cart-summary-vendor-top">
                  <span className="cart-summary-vendor-name">
                    {vendor?.name || 'Seller'}
                  </span>
                  <span className="cart-summary-vendor-items">
                    {group.items.length} item{group.items.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="cart-summary-vendor-details">
                  <span>Subtotal: {formatCurrency(group.subtotal)}</span>
                  <span className={`cart-summary-vendor-delivery ${vendorDelivery === 0 ? 'free' : ''}`}>
                    Delivery: {vendorDelivery === 0 ? (
                      <span className="cart-summary-free">Free{freeShipping ? ` (over $${vendor.freeShippingThreshold})` : ''}</span>
                    ) : formatCurrency(vendorDelivery)}
                  </span>
                  {vendorDiscount > 0 && (
                    <span className="cart-summary-vendor-discount">
                      Coupon: -{formatCurrency(vendorDiscount)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedItems.length === 0 && (
        <div className="cart-summary-empty">
          No items selected. Check items to proceed.
        </div>
      )}

      <div className="cart-summary-details">
        <div className="cart-summary-row">
          <span>Subtotal ({selectedCount} items)</span>
          <span>{formatCurrency(selectedSubtotal)}</span>
        </div>
        <div className="cart-summary-row">
          <span>Delivery ({selectedByVendor.length} seller{selectedByVendor.length !== 1 ? 's' : ''})</span>
          <span>{selectedTotalDelivery > 0 ? formatCurrency(selectedTotalDelivery) : 'All Free'}</span>
        </div>
        {selectedVendorDiscount > 0 && (
          <div className="cart-summary-row cart-summary-discount">
            <span>Discount</span>
            <span>-{formatCurrency(selectedVendorDiscount)}</span>
          </div>
        )}
        <div className="cart-summary-divider" />
        <div className="cart-summary-row cart-summary-total">
          <span>Total</span>
          <span>{formatCurrency(selectedTotal)}</span>
        </div>
      </div>

      <Link
        to={selectedItems.length > 0 ? '/checkout' : '#'}
        className={`btn btn-primary cart-summary-checkout ${selectedItems.length === 0 ? 'btn-disabled' : ''}`}
        onClick={(e) => { if (selectedItems.length === 0) e.preventDefault(); }}
      >
        Proceed to Checkout
      </Link>

      <Link to="/" className="btn btn-outline cart-summary-continue">
        Continue Shopping
      </Link>
    </div>
  );
};

export default CartSummary;
