import { useState } from 'react';
import formatCurrency from '@/utils/formatCurrency';
import { useCart } from '@/context/CartContext';
import { getVendorById, PAYMENT_METHOD_LABELS, PAYMENT_METHOD_ICONS } from '@/data/vendors';

const COUPONS = {
  'SAVE10': { type: 'percent', value: 10, label: '10% Off' },
  'SAVE20': { type: 'percent', value: 20, label: '20% Off' },
  'FLAT15': { type: 'fixed', value: 15, label: '$15 Off' },
  'FREESHIP': { type: 'freeshipping', value: 0, label: 'Free Shipping' },
};

const OrderSummary = ({ cartItems, subtotal, deliveryFee, discount, total, onApplyCoupon, couponCode, couponError }) => {
  const {
    cartByVendor, vendorCoupons, applyVendorCoupon, removeVendorCoupon,
    getVendorDiscount, totalDeliveryFee,
    vendorDeliveryMethods, setVendorDeliveryMethod, getVendorDeliveryMethod,
    vendorPaymentMethods, setVendorPaymentMethod, getVendorPaymentMethod,
    getVendorDelivery
  } = useCart();

  const [vendorInputs, setVendorInputs] = useState({});
  const [vendorErrors, setVendorErrors] = useState({});

  const handleApply = (vendorId) => {
    const code = (vendorInputs[vendorId] || '').trim().toUpperCase();
    if (COUPONS[code]) {
      applyVendorCoupon(vendorId, code, COUPONS[code]);
      setVendorErrors(prev => ({ ...prev, [vendorId]: null }));
    } else {
      setVendorErrors(prev => ({ ...prev, [vendorId]: 'Invalid coupon code' }));
    }
  };

  const handleRemove = (vendorId) => {
    setVendorInputs(prev => ({ ...prev, [vendorId]: '' }));
    removeVendorCoupon(vendorId);
    setVendorErrors(prev => ({ ...prev, [vendorId]: null }));
  };

  const handleVendorInputChange = (vendorId, value) => {
    setVendorInputs(prev => ({ ...prev, [vendorId]: value }));
    if (vendorErrors[vendorId]) {
      setVendorErrors(prev => ({ ...prev, [vendorId]: null }));
    }
  };

  const totalVendorDiscount = cartByVendor.reduce((sum, group) => {
    return sum + getVendorDiscount(group.vendorId, group.subtotal);
  }, 0);

  return (
    <div className="checkout-order-summary">
      <h3 className="checkout-section-title">Order Summary</h3>

      <div className="order-summary-items">
        {cartItems.map(item => (
          <div key={item.id} className="order-summary-item">
            <img src={item.image} alt={item.name} className="order-summary-item-image" />
            <div className="order-summary-item-details">
              <span className="order-summary-item-name">{item.name}</span>
              <span className="order-summary-item-qty">Qty: {item.quantity}</span>
            </div>
            <span className="order-summary-item-price">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Per-vendor sections */}
      {cartByVendor.map(group => {
        const vendor = group.vendor;
        const appliedCoupon = vendorCoupons[group.vendorId];
        const vendorDiscount = getVendorDiscount(group.vendorId, group.subtotal);
        const methodId = getVendorDeliveryMethod(group.vendorId);
        const vendorDelivery = getVendorDelivery(group.vendorId, group.subtotal);
        const paymentId = getVendorPaymentMethod(group.vendorId);
        const selectedMethod = vendor?.deliveryMethods?.find(m => m.id === methodId);
        const isFreeShipping = selectedMethod?.freeOver && group.subtotal >= selectedMethod.freeOver;

        return (
          <div key={group.vendorId} className="coupon-vendor-section">
            <div className="coupon-vendor-header">
              <span className="coupon-vendor-name">
                {vendor?.name || 'Seller'}
                {vendor?.verified && <span className="vendor-verified-mini">✓</span>}
              </span>
              <span className="coupon-vendor-subtotal">{formatCurrency(group.subtotal)}</span>
            </div>

            {/* Delivery Method Selector */}
            {vendor?.deliveryMethods && (
              <div className="vendor-delivery-selector">
                <label className="vendor-selector-label">Delivery Method</label>
                <div className="vendor-delivery-options">
                  {vendor.deliveryMethods.map(method => {
                    const isFree = method.freeOver && group.subtotal >= method.freeOver;
                    return (
                      <label
                        key={method.id}
                        className={`vendor-delivery-option ${methodId === method.id ? 'selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name={`delivery-${group.vendorId}`}
                          value={method.id}
                          checked={methodId === method.id}
                          onChange={() => setVendorDeliveryMethod(group.vendorId, method.id)}
                        />
                        <div className="vendor-delivery-option-content">
                          <span className="vendor-delivery-option-name">{method.name}</span>
                          <span className="vendor-delivery-option-desc">{method.description}</span>
                        </div>
                        <span className={`vendor-delivery-option-price ${isFree ? 'free' : ''}`}>
                          {isFree ? 'Free' : formatCurrency(method.price)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Payment Method Selector */}
            {vendor?.paymentMethods && (
              <div className="vendor-payment-selector">
                <label className="vendor-selector-label">Payment Method</label>
                <div className="vendor-payment-options">
                  {vendor.paymentMethods.map(pmId => (
                    <label
                      key={pmId}
                      className={`vendor-payment-option ${paymentId === pmId ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`payment-${group.vendorId}`}
                        value={pmId}
                        checked={paymentId === pmId}
                        onChange={() => setVendorPaymentMethod(group.vendorId, pmId)}
                      />
                      <span className="vendor-payment-icon">{PAYMENT_METHOD_ICONS[pmId]}</span>
                      <span className="vendor-payment-name">{PAYMENT_METHOD_LABELS[pmId]}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Coupon Input */}
            <div className="coupon-input-row">
              <input
                type="text"
                className="coupon-input"
                placeholder="Coupon code"
                value={vendorInputs[group.vendorId] || ''}
                onChange={(e) => handleVendorInputChange(group.vendorId, e.target.value)}
                disabled={!!appliedCoupon}
              />
              {appliedCoupon ? (
                <button type="button" className="coupon-remove-btn" onClick={() => handleRemove(group.vendorId)}>
                  Remove
                </button>
              ) : (
                <button type="button" className="coupon-apply-btn" onClick={() => handleApply(group.vendorId)}>
                  Apply
                </button>
              )}
            </div>

            {appliedCoupon && (
              <div className="coupon-success">
                ✓ {COUPONS[appliedCoupon.code]?.label || appliedCoupon.code} applied
                {vendorDiscount > 0 && ` — -${formatCurrency(vendorDiscount)}`}
              </div>
            )}

            {vendorErrors[group.vendorId] && (
              <div className="coupon-error">{vendorErrors[group.vendorId]}</div>
            )}

            {/* Vendor Subtotals */}
            <div className="coupon-vendor-totals">
              <div className="coupon-vendor-total-row">
                <span>Subtotal</span>
                <span>{formatCurrency(group.subtotal)}</span>
              </div>
              <div className="coupon-vendor-total-row">
                <span>Delivery ({selectedMethod?.name})</span>
                <span className={isFreeShipping ? 'cart-summary-free' : ''}>
                  {isFreeShipping ? 'Free' : formatCurrency(vendorDelivery)}
                </span>
              </div>
              {vendorDiscount > 0 && (
                <div className="coupon-vendor-total-row coupon-vendor-total-discount">
                  <span>Discount</span>
                  <span>-{formatCurrency(vendorDiscount)}</span>
                </div>
              )}
              <div className="coupon-vendor-total-row coupon-vendor-total-final">
                <span>Seller Total</span>
                <span>{formatCurrency(Math.max(0, group.subtotal - vendorDiscount + vendorDelivery))}</span>
              </div>
            </div>
          </div>
        );
      })}

      <div className="coupon-hint">
        Try: SAVE10, SAVE20, FLAT15, FREESHIP
      </div>

      <div className="order-summary-totals">
        <div className="order-summary-row">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="order-summary-row">
          <span>Delivery ({cartByVendor.length} seller{cartByVendor.length !== 1 ? 's' : ''})</span>
          <span>{totalDeliveryFee > 0 ? formatCurrency(totalDeliveryFee) : 'All Free'}</span>
        </div>
        {discount > 0 && (
          <div className="order-summary-row order-summary-discount">
            <span>Platform Discount</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        {totalVendorDiscount > 0 && (
          <div className="order-summary-row order-summary-discount">
            <span>Seller Coupons</span>
            <span>-{formatCurrency(totalVendorDiscount)}</span>
          </div>
        )}
        <div className="order-summary-divider" />
        <div className="order-summary-row order-summary-total">
          <span>Total</span>
          <span>{formatCurrency(Math.max(0, total))}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
