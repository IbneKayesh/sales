import { useState } from "react";
import { FiArrowLeft, FiEdit2, FiFileText, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";
import {
  formatDate,
  calcSubtotal,
  invoiceNumberFromId,
} from "../../utils/helpers";
import OrderTrackingTimeline from "./OrderTrackingTimeline";

const statusOptions = [
  "pending",
  "in_process",
  "delivered_to_courier",
  "delivered",
];

export default function OrderDetailView({ order, onBack, onEdit, onDelete }) {
  const navigate = useNavigate();
  const { isShop } = useAuth();
  const { showToast } = useUI();
  const [detailStatus, setDetailStatus] = useState("");

  const updateOrderStatus = () => {
    if (!detailStatus) return;
    const allOrders = load(KEYS.ORDERS);
    const next = allOrders.map((o) =>
      o.id === order.id
        ? { ...o, status: detailStatus, updatedAt: new Date().toISOString() }
        : o,
    );
    save(KEYS.ORDERS, next);

    /* Sync to linked invoice */
    const updatedOrder = next.find((o) => o.id === order.id);
    if (updatedOrder?.invoiceId) {
      const allInvoices = load(KEYS.INVOICES);
      const updatedInvoices = allInvoices.map((inv) =>
        inv.id === updatedOrder.invoiceId
          ? {
              ...inv,
              status: detailStatus,
              updatedAt: new Date().toISOString(),
            }
          : inv,
      );
      save(KEYS.INVOICES, updatedInvoices);
    }

    showToast(`Order status updated to "${detailStatus.replace(/_/g, " ")}"`);
  };

  const invoices = load(KEYS.INVOICES);

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Order Details</p>
          <h1 className="page-heading order-detail-heading">
            {order.customer.name}
          </h1>
        </div>
        <div className="order-action-row">
          <button
            className="ui-btn ui-btn-secondary order-detail-btn"
            onClick={onBack}
          >
            <FiArrowLeft />
          </button>
          <button
            className="ui-btn ui-btn-secondary order-detail-btn"
            onClick={() => onEdit(order.id)}
          >
            <FiEdit2 />
          </button>
          {order.invoiceId && (
            <button
              className="ui-btn ui-btn-secondary order-detail-btn--wide"
              onClick={() =>
                navigate(
                  `/invoice/${invoiceNumberFromId(invoices, order.invoiceId)}`,
                )
              }
            >
              <FiFileText /> Invoice
            </button>
          )}
        </div>
      </div>

      {/* Tracking timeline */}
      <div className="ui-card order-timeline-card">
        <OrderTrackingTimeline status={order.status} variant="detail" />
      </div>

      {/* Order info */}
      <div className="ui-card">
        <div className="order-detail-grid">
          <div>
            <div className="order-detail-label">Customer</div>
            <div className="order-detail-value">{order.customer.name}</div>
            {order.customer.contact && (
              <div className="order-detail-sm">{order.customer.contact}</div>
            )}
            {order.customer.address && (
              <div className="order-detail-subtle">
                {order.customer.address}
              </div>
            )}
          </div>
          <div className="order-detail-right">
            {order.shop && (
              <>
                <div className="order-detail-label">Shop</div>
                <div className="order-detail-value">🏪 {order.shop}</div>
              </>
            )}
          </div>
        </div>
        {/* Inline status update (shop only) */}
        <div className="order-status-update-row">
          {isShop ? (
            <>
              <div className="ui-select-wrapper order-status-select-wrapper">
                <select
                  className="ui-select order-status-select"
                  value={detailStatus || order.status}
                  onChange={(e) => setDetailStatus(e.target.value)}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="ui-btn ui-btn-primary order-status-update-btn"
                onClick={updateOrderStatus}
                disabled={!detailStatus || detailStatus === order.status}
              >
                Update
              </button>
            </>
          ) : (
            <span
              className={`order-status-badge ${order.status === "delivered" ? "order-status-badge--success" : "order-status-badge--neutral"}`}
            >
              {order.status?.replace(/_/g, " ") || "pending"}
            </span>
          )}
          <span
            className={`order-payment-badge ${order.paymentStatus === "paid" ? "order-payment-badge--paid" : order.paymentStatus === "partial_paid" ? "order-payment-badge--partial" : "order-payment-badge--due"}`}
          >
            {order.paymentStatus?.replace(/_/g, " ") || "due"}
          </span>
          {order.paymentStatus === "partial_paid" && (
            <span className="order-partial-text">
              Paid: ₹{order.paidAmount?.toFixed(2)} / ₹
              {order.grandTotal.toFixed(2)}
            </span>
          )}
        </div>
        <div className="order-detail-meta">{formatDate(order.createdAt)}</div>
      </div>

      {/* Products */}
      <div className="ui-card">
        <h3 className="ui-card-title">Products ({order.products.length})</h3>
        <div>
          <div className="order-products-grid-header">
            <span>Item</span>
            <span className="order-grid-center">Qty</span>
            <span className="order-grid-center">Disc</span>
            <span className="order-grid-right">Total</span>
          </div>
          {order.products.map((item, idx) => (
            <div key={idx} className="order-product-row">
              <span className="order-product-name">{item.name}</span>
              <span className="order-product-qty">{item.qty}</span>
              <span
                className={`order-product-disc${item.discount > 0 ? " order-product-disc--active" : ""}`}
              >
                {item.discount > 0 ? `${item.discount}%` : "—"}
              </span>
              <span className="order-product-total">
                ₹{calcSubtotal(item).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="order-totals">
          <div className="order-total-row">
            <span className="order-total-label">Subtotal</span>
            <span className="order-total-value">
              ₹{order.itemsTotal.toFixed(2)}
            </span>
          </div>
          {order.deliveryCharge > 0 && (
            <div className="order-total-row">
              <span className="order-total-label">Delivery</span>
              <span className="order-total-value">
                ₹{Number(order.deliveryCharge).toFixed(2)}
              </span>
            </div>
          )}
          <div className="order-grand-total-row">
            <span className="order-grand-total-label">Total</span>
            <span className="order-grand-total-value">
              ₹{order.grandTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {order.invoiceId && (
        <div className="ui-card order-invoice-link">
          <p className="order-invoice-text">This order has an invoice.</p>
          <button
            className="ui-btn ui-btn-primary order-invoice-btn"
            onClick={() =>
              navigate(
                `/invoice/${invoiceNumberFromId(invoices, order.invoiceId)}`,
              )
            }
          >
            <FiFileText /> View Invoice
          </button>
        </div>
      )}

      <button
        className="ui-btn ui-btn-secondary order-delete-btn"
        onClick={() => onDelete(order.id)}
      >
        <FiTrash2 /> Delete Order
      </button>
    </section>
  );
}
