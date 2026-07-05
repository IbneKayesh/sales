import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import QtyStepper from "@/components/ui/QtyStepper";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import { useToast } from "@/context/ToastContext";
import "./CartPage.css";

const CartPage = () => {
  const navigate = useNavigate();
  const { cartShops, cartTotalItems, removeFromCart, updateCartQty } = useCart();
  const { showToast } = useToast();

  const grandTotal = cartShops.reduce(
    (acc, shop) => acc + shop.items.reduce((a, i) => a + i.price * i.qty, 0),
    0
  );

  if (cartTotalItems === 0) {
    return (
      <div className="page-container cart-page-empty-container">
        <EmptyState
          icon="🛒"
          title="Cart is empty"
          message="Browse shops and add some products"
          action={
            <button type="button" onClick={() => navigate("/")} className="btn-primary">
              <ShoppingCart size={16} /> Browse Products
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="page-container cart-page-container">
      <PageHeader
        title="My Cart"
        subtitle={`${cartTotalItems} item${cartTotalItems !== 1 ? "s" : ""} · grouped by shop`}
      />

      {cartShops.map((shop) => {
        const shopTotal = shop.items.reduce((a, i) => a + i.price * i.qty, 0);
        return (
          <div key={shop.shopId} className="card cart-page-shop-card">
            <div className="cart-page-shop-header">
              <div className="cart-page-shop-info">
                <span className="cart-page-shop-icon">🏪</span>
                <div>
                  <div className="cart-page-shop-name">{shop.shopName}</div>
                  <div className="cart-page-shop-note">One order per shop</div>
                </div>
              </div>
              <span className="cart-page-shop-total">৳{shopTotal}</span>
            </div>

            {shop.items.map((item) => (
              <div key={item.productId} className="cart-page-item">
                <div className="cart-page-item-info">
                  <div className="cart-page-item-name">{item.name}</div>
                  <div className="cart-page-item-price">৳{item.price} × {item.qty} = ৳{item.price * item.qty}</div>
                </div>
                <QtyStepper
                  qty={item.qty}
                  onDecrease={() => updateCartQty(shop.shopId, item.productId, item.qty - 1)}
                  onIncrease={() => {
                    const r = updateCartQty(shop.shopId, item.productId, item.qty + 1);
                    if (r && !r.success) showToast("warn", "Stock limit", r.message);
                  }}
                  onRemove={() => removeFromCart(shop.shopId, item.productId)}
                />
              </div>
            ))}

            <div className="cart-page-place-order-wrapper">
              <button
                type="button"
                onClick={() => navigate(`/customer/checkout/${shop.shopId}`)}
                className="cart-page-place-order-btn"
              >
                Checkout — ৳{shopTotal} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        );
      })}

      {cartShops.length > 1 && (
        <div className="card cart-page-grand-summary">
          <div className="cart-page-grand-summary-inner">
            <div>
              <div className="cart-page-grand-label">All shops total</div>
              <div className="cart-page-grand-value">৳{grandTotal}</div>
            </div>
            <span className="cart-page-grand-hint">Checkout each shop separately</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
