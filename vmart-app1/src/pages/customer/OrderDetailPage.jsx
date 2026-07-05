import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Check, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { DEMO_PRODUCTS } from "@/hooks/useVmartData";
import StatusBadge from "@/components/ui/StatusBadge";
import QtyStepper from "@/components/ui/QtyStepper";
import EmptyState from "@/components/ui/EmptyState";
import "./OrderDetailPage.css";

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById, addProductToOrder, removeProductFromOrder, updateOrderItemQty, submitOrder } = useCart();
  const { showToast } = useToast();

  const order = getOrderById(id);
  const [showAddProduct, setShowAddProduct] = useState(false);

  if (!order) {
    return (
      <div className="page-container order-detail-page">
        <EmptyState
          icon="❓"
          title="Order not found"
          action={
            <button type="button" onClick={() => navigate("/customer/orders")} className="btn-primary">
              Back to Orders
            </button>
          }
        />
      </div>
    );
  }

  const isDraft = order.status === "DRAFT";
  const shopProducts = DEMO_PRODUCTS.filter((p) => p.shopId === order.shopId);

  return (
    <div className="page-container order-detail-page">
      <div className="order-detail-header">
        <button type="button" onClick={() => navigate("/customer/orders")} className="order-detail-back-btn">
          <ArrowLeft size={18} />
        </button>
        <div className="order-detail-meta">
          <div className="order-detail-order-no">{order.orderNo}</div>
          <div className="order-detail-shop-date">{order.shopName} · {order.date}</div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {isDraft && (
        <div className="order-detail-draft-hint">
          ✏️ DRAFT — edit items before placing
        </div>
      )}

      <div className="card order-detail-items-card">
        <div className="order-detail-items-header">
          <h3 className="order-detail-items-title">Order Items</h3>
          {isDraft && (
            <button type="button" onClick={() => setShowAddProduct(!showAddProduct)} className="order-detail-add-btn">
              <Plus size={14} /> Add
            </button>
          )}
        </div>

        {isDraft && showAddProduct && (
          <div className="order-detail-add-panel">
            {shopProducts.map((p) => (
              <div key={p.id} className="order-detail-add-item">
                <div>
                  <div className="order-detail-add-item-name">{p.icon} {p.name}</div>
                  <div className="order-detail-add-item-price">৳{p.price}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const r = addProductToOrder(order.id, p);
                    if (!r.success) showToast("warn", "Stock limit", r.message);
                  }}
                  className="order-detail-add-item-btn"
                >
                  + Add
                </button>
              </div>
            ))}
          </div>
        )}

        {order.items.map((item) => (
          <div key={item.productId} className="order-detail-item">
            <div className="order-detail-item-info">
              <div className="order-detail-item-name">{item.name}</div>
              <div className="order-detail-item-price">৳{item.price} × {item.qty} = ৳{item.price * item.qty}</div>
            </div>
            {isDraft ? (
              <QtyStepper
                qty={item.qty}
                size={12}
                onDecrease={() => updateOrderItemQty(order.id, item.productId, item.qty - 1)}
                onIncrease={() => {
                  const r = updateOrderItemQty(order.id, item.productId, item.qty + 1);
                  if (r && !r.success) showToast("warn", "Stock limit", r.message);
                }}
                onRemove={() => removeProductFromOrder(order.id, item.productId)}
              />
            ) : (
              <div className="order-detail-qty-fixed">×{item.qty}</div>
            )}
          </div>
        ))}

        {order.items.length === 0 && (
          <EmptyState icon="📦" message="No items in this order" />
        )}
      </div>

      <div className="card order-detail-total-card">
        <div className="order-detail-total-row">
          <span className="order-detail-total-label">Total</span>
          <span className="order-detail-total-val">৳{order.total}</span>
        </div>
      </div>

      {isDraft && order.items.length > 0 && (
        <div className="order-detail-place-wrap">
          <button
            type="button"
            onClick={() => {
              submitOrder(order.id);
              showToast("success", "Order placed", order.orderNo);
              navigate("/customer/orders");
            }}
            className="order-detail-place-btn"
          >
            <Check size={18} /> Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
