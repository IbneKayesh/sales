import { useMemo, useEffect } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckIcon, CartIcon } from '@/icons';
import formatCurrency from '@/utils/formatCurrency';
import { products } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';
import { getVendorById } from '@/data/vendors';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const orderData = location.state?.orderData;

  useEffect(() => {
    document.title = 'Order Confirmed | ShopEasy';
  }, []);

  if (!orderData) {
    return <Navigate to="/" replace />;
  }

  const suggestedProducts = useMemo(() => {
    const orderedIds = orderData.items.map(i => i.id);
    return [...products]
      .filter(p => !orderedIds.includes(p.id))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  }, [orderData.items]);

  const vendorOrders = orderData.vendorOrders || [];
  const hasMultipleVendors = vendorOrders.length > 1;

  return (
    <main className="page">
      <div className="container">
        <div className="confirmation-card">
          <div className="confirmation-header">
            <div className="confirmation-icon"><CheckIcon size={32} /></div>
            <h1 className="confirmation-title">Order Confirmed!</h1>
            <p className="confirmation-message">
              Thank you for your order. We'll send you a confirmation soon.
            </p>
          </div>

          <div className="confirmation-details">
            <div className="confirmation-section">
              <h3 className="confirmation-section-title">Order Reference</h3>
              <p className="confirmation-order-id">{orderData.orderId}</p>
              {hasMultipleVendors && (
                <div className="confirmation-multi-vendor-note">
                  <p>This order contains items from {vendorOrders.length} sellers.
                  Each seller will process and ship their items separately.</p>
                  <div className="confirmation-vendor-order-ids">
                    {vendorOrders.map(vo => (
                      <div key={vo.vendorId} className="confirmation-vendor-order-id">
                        <span className="confirmation-voi-label">{vo.vendorName}:</span>
                        <span className="confirmation-voi-value">{vo.vendorOrderId}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="confirmation-section">
              <h3 className="confirmation-section-title">Customer Information</h3>
              <div className="confirmation-info-grid">
                <div className="confirmation-info-item">
                  <span className="info-label">Name</span>
                  <span className="info-value">{orderData.customer.fullName}</span>
                </div>
                <div className="confirmation-info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{orderData.customer.phone}</span>
                </div>
                {orderData.customer.email && (
                  <div className="confirmation-info-item">
                    <span className="info-label">Email</span>
                    <span className="info-value">{orderData.customer.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="confirmation-section">
              <h3 className="confirmation-section-title">Delivery Information</h3>
              <div className="confirmation-info-grid">
                <div className="confirmation-info-item">
                  <span className="info-label">Address</span>
                  <span className="info-value">{orderData.delivery.address}</span>
                </div>
                <div className="confirmation-info-item">
                  <span className="info-label">City</span>
                  <span className="info-value">{orderData.delivery.city}</span>
                </div>
                {orderData.delivery.postalCode && (
                  <div className="confirmation-info-item">
                    <span className="info-label">Postal Code</span>
                    <span className="info-value">{orderData.delivery.postalCode}</span>
                  </div>
                )}
                <div className="confirmation-info-item">
                  <span className="info-label">Method</span>
                  <span className="info-value">{orderData.delivery.method?.name}</span>
                </div>
                <div className="confirmation-info-item">
                  <span className="info-label">Estimated Delivery</span>
                  <span className="info-value">{orderData.delivery.estimatedDelivery}</span>
                </div>
                {orderData.delivery.instructions && (
                  <div className="confirmation-info-item confirmation-info-full">
                    <span className="info-label">Instructions</span>
                    <span className="info-value">{orderData.delivery.instructions}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Vendor-separated order sections */}
            {hasMultipleVendors ? (
              vendorOrders.map(vo => {
                const vendor = getVendorById(vo.vendorId);
                return (
                  <div key={vo.vendorId} className="confirmation-section confirmation-vendor-section">
                    <div className="confirmation-vendor-header">
                      {vendor && (
                        <Link to={`/seller/${vendor.slug}`} className="confirmation-vendor-logo-link">
                          <img src={vendor.logo} alt={vendor.name} className="confirmation-vendor-logo" />
                        </Link>
                      )}
                      <div className="confirmation-vendor-info">
                        <h3 className="confirmation-section-title confirmation-vendor-title">
                          {vendor ? (
                            <Link to={`/seller/${vendor.slug}`}>{vo.vendorName}</Link>
                          ) : vo.vendorName}
                          {vendor?.verified && <span className="vendor-verified-mini">✓ Verified</span>}
                        </h3>
                        <span className="confirmation-vendor-sub">
                          Sub Order: <strong>{vo.vendorOrderId}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="confirmation-items">
                      {vo.items.map(item => (
                        <div key={item.id} className="confirmation-item">
                          <img src={item.image} alt={item.name} className="confirmation-item-image" />
                          <div className="confirmation-item-details">
                            <span className="confirmation-item-name">{item.name}</span>
                            <span className="confirmation-item-qty">Qty: {item.quantity}</span>
                          </div>
                          <span className="confirmation-item-price">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="confirmation-vendor-meta">
                      {vo.deliveryMethod && (
                        <div className="confirmation-vendor-meta-item">
                          <span className="confirmation-vm-label">Delivery:</span>
                          <span className="confirmation-vm-value">{vo.deliveryMethod.name} ({vo.deliveryMethod.description})</span>
                        </div>
                      )}
                      {vo.paymentMethodLabel && (
                        <div className="confirmation-vendor-meta-item">
                          <span className="confirmation-vm-label">Payment:</span>
                          <span className="confirmation-vm-value">{vo.paymentMethodLabel}</span>
                        </div>
                      )}
                    </div>

                    <div className="confirmation-vendor-totals">
                      <div className="confirmation-total-row">
                        <span>Subtotal</span>
                        <span>{formatCurrency(vo.subtotal)}</span>
                      </div>
                      {vo.deliveryFee > 0 ? (
                        <div className="confirmation-total-row">
                          <span>Delivery</span>
                          <span>{formatCurrency(vo.deliveryFee)}</span>
                        </div>
                      ) : (
                        <div className="confirmation-total-row">
                          <span>Delivery</span>
                          <span className="cart-summary-free">Free</span>
                        </div>
                      )}
                      {vo.discount > 0 && (
                        <div className="confirmation-total-row confirmation-total-discount">
                          <span>
                            Coupon ({vo.couponLabel || vo.couponCode})
                          </span>
                          <span>-{formatCurrency(vo.discount)}</span>
                        </div>
                      )}
                      <div className="confirmation-total-row confirmation-total-sub">
                        <span>Seller Total</span>
                        <span>{formatCurrency(vo.total)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              /* Single vendor or no vendor info — flat list */
              <div className="confirmation-section">
                <h3 className="confirmation-section-title">Order Items</h3>
                <div className="confirmation-items">
                  {orderData.items.map(item => {
                    const vendor = getVendorById(item.vendor_id);
                    return (
                      <div key={item.id} className="confirmation-item">
                        <img src={item.image} alt={item.name} className="confirmation-item-image" />
                        <div className="confirmation-item-details">
                          <span className="confirmation-item-name">{item.name}</span>
                          {vendor && (
                            <span className="confirmation-item-vendor">
                              {vendor.name}
                            </span>
                          )}
                          <span className="confirmation-item-qty">Qty: {item.quantity}</span>
                        </div>
                        <span className="confirmation-item-price">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="confirmation-section">
              <h3 className="confirmation-section-title">Billing Information</h3>
              <div className="confirmation-info-grid">
                <div className="confirmation-info-item">
                  <span className="info-label">Name</span>
                  <span className="info-value">{orderData.billing.name}</span>
                </div>
                <div className="confirmation-info-item">
                  <span className="info-label">Address</span>
                  <span className="info-value">{orderData.billing.address}</span>
                </div>
                <div className="confirmation-info-item">
                  <span className="info-label">City</span>
                  <span className="info-value">{orderData.billing.city}</span>
                </div>
                {orderData.billing.postalCode && (
                  <div className="confirmation-info-item">
                    <span className="info-label">Postal Code</span>
                    <span className="info-value">{orderData.billing.postalCode}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="confirmation-section">
              <h3 className="confirmation-section-title">Payment & Total</h3>
              {hasMultipleVendors ? (
                <div className="confirmation-info-grid">
                  {vendorOrders.map(vo => (
                    <div key={vo.vendorId} className="confirmation-info-item">
                      <span className="info-label">{vo.vendorName}</span>
                      <span className="info-value">{vo.paymentMethodLabel || 'Cash on Delivery'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="confirmation-info-grid">
                  <div className="confirmation-info-item">
                    <span className="info-label">Payment Method</span>
                    <span className="info-value">
                      {vendorOrders[0]?.paymentMethodLabel || 'Cash on Delivery'}
                    </span>
                  </div>
                </div>
              )}

              <div className="confirmation-totals">
                <div className="confirmation-total-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(orderData.subtotal)}</span>
                </div>
                <div className="confirmation-total-row">
                  <span>Delivery</span>
                  <span>{orderData.deliveryFee > 0 ? formatCurrency(orderData.deliveryFee) : 'Free'}</span>
                </div>
                {orderData.discount > 0 && (
                  <div className="confirmation-total-row confirmation-total-discount">
                    <span>Discount</span>
                    <span>-{formatCurrency(orderData.discount)}</span>
                  </div>
                )}
                <div className="confirmation-total-divider" />
                <div className="confirmation-total-row confirmation-total-final">
                  <span>Total</span>
                  <span>{formatCurrency(orderData.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="confirmation-actions">
            <Link to="/" className="btn btn-primary">
              <CartIcon size={16} /> Continue Shopping
            </Link>
          </div>

          {suggestedProducts.length > 0 && (
            <div className="confirmation-suggested">
              <h3 className="confirmation-suggested-title">You Might Also Like</h3>
              <div className="confirmation-suggested-grid">
                {suggestedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default OrderConfirmationPage;
