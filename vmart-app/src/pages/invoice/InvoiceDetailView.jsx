import {
  FiArrowLeft,
  FiEdit2,
  FiExternalLink,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { formatDate, calcSubtotal } from "../../utils/helpers";
import InvoiceTrackingTimeline from "./InvoiceTrackingTimeline";

export default function InvoiceDetailView({ invoice, onBack, onEdit }) {
  const navigate = useNavigate();

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">{invoice.invoiceNumber}</p>
          <h1 className="page-heading inv-detail-heading">{invoice.customer.name}</h1>
        </div>
        <div className="inv-action-row">
          <button className="ui-btn ui-btn-secondary inv-detail-btn" onClick={onBack}><FiArrowLeft /></button>
          <button className="ui-btn ui-btn-secondary inv-detail-btn" onClick={() => onEdit(invoice.id)}><FiEdit2 /></button>
          <button className="ui-btn ui-btn-secondary no-print inv-detail-btn--wide"
            onClick={() => navigate(`/invoice/${invoice.invoiceNumber}`)}>
            <FiExternalLink /> Receipt
          </button>
          <button className="ui-btn ui-btn-primary inv-detail-btn"
            onClick={() => navigate(`/invoice/${invoice.invoiceNumber}?print=true`)}>
            <FiExternalLink />
          </button>
        </div>
      </div>

      {/* Tracking timeline */}
      <div className="ui-card inv-timeline-card">
        <InvoiceTrackingTimeline status={invoice.status} />
      </div>

      <div className="inv-receipt-card">
        <div className="inv-receipt-header">
          <h2 className="inv-receipt-title">VIRTUAL MART</h2>
          <p className="inv-receipt-number">{invoice.invoiceNumber}</p>
        </div>
        <div className="inv-receipt-body">
          {/* Status badges */}
          <div className="inv-status-badge-row">
            <span className="inv-status-badge"
              style={{ background: invoice.status === "delivered" ? "var(--accent-primary)" : "var(--text-subtle)" }}>
              {invoice.status?.replace(/_/g, " ") || "draft"}
            </span>
            <span className="inv-status-badge"
              style={{ background: invoice.paymentStatus === "paid" ? "green" : invoice.paymentStatus === "partial_paid" ? "orange" : "var(--error)" }}>
              {invoice.paymentStatus?.replace(/_/g, " ") || "due"}
            </span>
            {invoice.paymentStatus === "partial_paid" && (
              <span className="inv-partial-text">
                Paid: ₹{invoice.paidAmount?.toFixed(2)} / ₹{invoice.grandTotal.toFixed(2)}
              </span>
            )}
          </div>
          <div className="inv-bill-section">
            <div>
              <div className="inv-bill-label">Bill To</div>
              <div className="inv-bill-name">{invoice.customer.name}</div>
              {invoice.customer.contact && <div className="inv-bill-detail">{invoice.customer.contact}</div>}
              {invoice.customer.address && <div className="inv-bill-subtle">{invoice.customer.address}</div>}
            </div>
            <div className="inv-bill-right">
              <div className="inv-bill-label">Date</div>
              <div className="inv-bill-name">{formatDate(invoice.createdAt)}</div>
            </div>
          </div>
          {/* Items */}
          <div>
            <div className="inv-items-header">
              <span>Item</span><span className="inv-item-qty">Qty</span><span className="inv-item-price">Price</span>
              <span className="inv-item-qty">Disc</span><span className="inv-item-total">Total</span>
            </div>
            {invoice.items.map((item, idx) => (
              <div key={idx} className="inv-item-row">
                <span className="inv-item-name">{item.name}</span>
                <span className="inv-item-qty">{item.qty}</span>
                <span className="inv-item-price">₹{item.price.toFixed(2)}</span>
                <span className="inv-item-disc">{item.discount > 0 ? `${item.discount}%` : "\u2014"}</span>
                <span className="inv-item-total">₹{calcSubtotal(item).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="inv-totals">
            <div className="inv-total-row">
              <span className="inv-total-label">Subtotal</span>
              <span className="inv-total-value">₹{invoice.itemsTotal.toFixed(2)}</span>
            </div>
            {invoice.deliveryCharge > 0 && (
              <div className="inv-total-row">
                <span className="inv-total-label">Delivery</span>
                <span className="inv-total-value">₹{Number(invoice.deliveryCharge).toFixed(2)}</span>
              </div>
            )}
            {invoice.deliveryAgent && (
              <div className="inv-total-row">
                <span className="inv-total-label">Delivered by</span>
                <span className="inv-total-value">{invoice.deliveryAgent}</span>
              </div>
            )}
            <div className="inv-grand-total-row">
              <span className="inv-grand-total-label">Total</span>
              <span className="inv-grand-total-value">₹{invoice.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="inv-footer-text">Thank you for your business!</div>
      </div>
    </section>
  );
}
