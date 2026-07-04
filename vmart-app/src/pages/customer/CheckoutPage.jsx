import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, CreditCard, Banknote } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import QtyStepper from "@/components/ui/QtyStepper";
import "./CheckoutPage.css";

const PAYMENT_OPTIONS = [
  { id: "COD", label: "Cash on Delivery", icon: Banknote },
  { id: "CARD", label: "Card (Demo)", icon: CreditCard },
];

const CheckoutPage = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, updateCartQty, removeFromCart, placeOrder } = useCart();
  const { showToast } = useToast();

  const shopCart = cart[Number(shopId)];
  const [address, setAddress] = useState(user?.address || "");
  const [payment, setPayment] = useState("COD");
  const [placing, setPlacing] = useState(false);

  if (!shopCart?.items?.length) {
    return (
      <div className="page-container checkout-page">
        <div className="checkout-header">
          <button type="button" onClick={() => navigate("/customer/cart")} className="back-btn">
            <ArrowLeft size={18} />
          </button>
          <h2>Checkout</h2>
        </div>
        <div style={{ textAlign: "center", padding: "32px 16px" }}>
          <p>Nothing to checkout</p>
          <button type="button" className="btn-primary" style={{ marginTop: "12px" }} onClick={() => navigate("/customer/cart")}>
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  const shopTotal = shopCart.items.reduce((a, i) => a + i.price * i.qty, 0);
  const deliveryFee = 30;

  const handlePlaceOrder = () => {
    if (!address.trim()) {
      showToast("warn", "Address required", "Please enter a delivery address");
      return;
    }
    setPlacing(true);
    const order = placeOrder(Number(shopId), {
      paymentMethod: payment,
      deliveryAddress: address.trim(),
    });
    if (order) {
      showToast("success", "Order placed", `${order.orderNo} — ৳${order.total + deliveryFee}`);
      navigate("/customer/orders");
    }
    setPlacing(false);
  };

  return (
    <div className="page-container checkout-page">
      <div className="checkout-header">
        <button type="button" onClick={() => navigate("/customer/cart")} className="back-btn">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="checkout-title">Checkout</h2>
          <p className="checkout-subtitle">{shopCart.shopName}</p>
        </div>
      </div>

      <div className="checkout-content">
        <div className="card checkout-section">
          <h3><MapPin size={14} /> Delivery Address</h3>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter delivery address"
            rows={2}
            className="checkout-address-input"
          />
        </div>

        <div className="card checkout-section">
          <h3>Payment Method</h3>
          <div className="checkout-payment-options">
            {PAYMENT_OPTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                className={`checkout-payment-btn ${payment === id ? "active" : ""}`}
                onClick={() => setPayment(id)}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="card checkout-section">
          <h3>Order Summary</h3>
          {shopCart.items.map((item) => (
            <div key={item.productId} className="checkout-item">
              <div className="checkout-item-info">
                <div className="checkout-item-name">{item.name}</div>
                <div className="checkout-item-price">৳{item.price}</div>
              </div>
              <QtyStepper
                qty={item.qty}
                onDecrease={() => updateCartQty(Number(shopId), item.productId, item.qty - 1)}
                onIncrease={() => {
                  const r = updateCartQty(Number(shopId), item.productId, item.qty + 1);
                  if (r && !r.success) showToast("warn", "Stock limit", r.message);
                }}
                onRemove={() => removeFromCart(Number(shopId), item.productId)}
              />
            </div>
          ))}
          <div className="checkout-totals">
            <div className="checkout-total-row">
              <span>Subtotal</span><span>৳{shopTotal}</span>
            </div>
            <div className="checkout-total-row">
              <span>Delivery</span><span>৳{deliveryFee}</span>
            </div>
            <div className="checkout-total-row checkout-grand">
              <span>Total</span><span>৳{shopTotal + deliveryFee}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="checkout-footer">
        <button
          type="button"
          className="btn-primary"
          disabled={placing}
          onClick={handlePlaceOrder}
        >
          Place Order — ৳{shopTotal + deliveryFee}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
