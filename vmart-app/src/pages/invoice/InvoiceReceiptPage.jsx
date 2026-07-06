import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiPrinter, FiShare2, FiArrowLeft, FiCheck, FiCopy } from "react-icons/fi";
import { load, KEYS } from "../../utils/storage";
import "./InvoiceReceiptPage.css";

function formatDate(iso) {
  try { return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return ""; }
}

const calcSubtotal = (item) => {
  const t = item.qty * item.price;
  const d = item.discount > 0 ? (t * item.discount) / 100 : 0;
  return t - d;
};

export default function InvoiceReceiptPage() {
  const { invoiceNumber } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [shop, setShop] = useState(null);
  const [notFound, setNotFound] = useState(false);

  /* Auto-print if ?print param is present */
  useEffect(() => {
    if (window.location.search.includes("print=true")) {
      /* Small delay to let the DOM render the receipt */
      const timer = setTimeout(() => window.print(), 300);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const invoices = load(KEYS.INVOICES);
    const inv = invoices.find((i) => i.invoiceNumber === invoiceNumber);
    if (!inv) { setNotFound(true); return; }
    setInvoice(inv);

    /* Look up shop info from KEYS.SHOPS */
    if (inv.shop) {
      const shops = load(KEYS.SHOPS);
      const foundShop = shops.find((s) => s.name === inv.shop);
      setShop(foundShop || null);
    }
  }, [invoiceNumber]);

  const handlePrint = () => window.print();

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback */
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /* ── Not Found ── */
  if (notFound) {
    return (
      <section className="page-section" style={{ alignItems: "center", justifyContent: "center", minHeight: "60dvh", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "var(--space-3)" }}>🧾</div>
        <h2 style={{ margin: 0, color: "var(--text-h)" }}>Invoice not found</h2>
        <p style={{ color: "var(--text-subtle)", marginTop: "var(--space-2)" }}>
          No invoice with number <strong>{invoiceNumber}</strong> exists.
        </p>
        <button className="ui-btn ui-btn-primary" onClick={() => navigate("/invoice")} style={{ marginTop: "var(--space-4)" }}>
          <FiArrowLeft /> Back to Invoices
        </button>
      </section>
    );
  }

  if (!invoice) {
    return (
      <section className="page-section" style={{ alignItems: "center", justifyContent: "center", minHeight: "60dvh" }}>
        <div className="spinner" style={{ fontSize: "2rem" }}>⏳</div>
      </section>
    );
  }

  const statusColor = invoice.status === "delivered" ? "var(--accent-primary)"
    : invoice.status === "in_process" ? "var(--accent)"
    : "var(--text-subtle)";

  const paymentColor = invoice.paymentStatus === "paid" ? "green"
    : invoice.paymentStatus === "partial_paid" ? "orange"
    : "var(--error)";

  return (
    <section className="page-section" style={{ alignItems: "center" }}>
      {/* Toolbar */}
      <div className="page-header" style={{ width: "100%", maxWidth: 440, margin: "0 auto" }}>
        <div className="page-title-group">
          <p className="page-eyebrow">Receipt</p>
          <h1 className="page-heading" style={{ fontSize: "1.2rem" }}>{invoice.invoiceNumber}</h1>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button className="ui-btn ui-btn-secondary" onClick={() => navigate(-1)}
            style={{ width: 44, height: 44, padding: 0, display: "grid", placeItems: "center" }}><FiArrowLeft /></button>
          <button className="ui-btn ui-btn-primary no-print" onClick={handlePrint}
            style={{ width: 44, height: 44, padding: 0, display: "grid", placeItems: "center" }}><FiPrinter /></button>
          <button className={`ui-btn ${copied ? "ui-btn-primary" : "ui-btn-secondary"} no-print`}
            onClick={handleShare}
            style={{ width: 44, height: 44, padding: 0, display: "grid", placeItems: "center" }}>
            {copied ? <FiCheck /> : <FiShare2 />}
          </button>
        </div>
      </div>

      {/* ── POS Receipt ── */}
      <div className="receipt" style={{ width: "100%", maxWidth: 440, margin: "0 auto" }}>
        <div className="receipt-paper">
          {/* Header — Shop Info */}
          <div className="receipt-header">
            <h1 className="receipt-store-name">{shop?.name || invoice.shop || "Virtual Mart"}</h1>
            {shop?.address && <p className="receipt-line">{shop.address}</p>}
            {shop?.contact && <p className="receipt-line">📞 {shop.contact}</p>}
            <div className="receipt-divider" />
            <h2 className="receipt-title">INVOICE</h2>
            <p className="receipt-ref">{invoice.invoiceNumber}</p>
            <p className="receipt-date">{formatDate(invoice.createdAt)}</p>
          </div>

          <div className="receipt-divider" />

          {/* Customer Info */}
          <div className="receipt-section">
            <p className="receipt-label">Bill To</p>
            <p className="receipt-value">{invoice.customer.name}</p>
            {invoice.customer.contact && <p className="receipt-line">{invoice.customer.contact}</p>}
            {invoice.customer.address && <p className="receipt-line">{invoice.customer.address}</p>}
          </div>

          <div className="receipt-divider" />

          {/* Items */}
          <div className="receipt-section">
            <div className="receipt-table-header">
              <span className="receipt-th-desc">Item</span>
              <span className="receipt-th-qty">Qty</span>
              <span className="receipt-th-price">Price</span>
              <span className="receipt-th-total">Total</span>
            </div>
            {invoice.items.map((item, idx) => (
              <div key={idx} className="receipt-item-row">
                <span className="receipt-td-desc">
                  {item.name}
                  {item.discount > 0 && <span className="receipt-discount">(-{item.discount}%)</span>}
                </span>
                <span className="receipt-td-qty">{item.qty}</span>
                <span className="receipt-td-price">₹{item.price.toFixed(2)}</span>
                <span className="receipt-td-total">₹{calcSubtotal(item).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="receipt-divider" />

          {/* Summary */}
          <div className="receipt-section receipt-summary">
            <div className="receipt-summary-row">
              <span>Subtotal</span>
              <span>₹{invoice.itemsTotal.toFixed(2)}</span>
            </div>
            {invoice.deliveryCharge > 0 && (
              <div className="receipt-summary-row">
                <span>Delivery Charge</span>
                <span>₹{Number(invoice.deliveryCharge).toFixed(2)}</span>
              </div>
            )}
            {invoice.deliveryAgent && (
              <div className="receipt-summary-row receipt-delivery-agent">
                <span>Delivered by</span>
                <span>{invoice.deliveryAgent}</span>
              </div>
            )}
            <div className="receipt-divider" />
            <div className="receipt-summary-row receipt-grand-total">
              <span>Total (incl. delivery)</span>
              <span>₹{invoice.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="receipt-divider" />

          {/* Status */}
          <div className="receipt-section receipt-status">
            <div className="receipt-badge-row">
              <span className="receipt-badge" style={{ background: statusColor }}>{invoice.status?.replace(/_/g, " ") || "draft"}</span>
              <span className="receipt-badge" style={{ background: paymentColor }}>{invoice.paymentStatus?.replace(/_/g, " ") || "due"}</span>
            </div>
            {invoice.paymentStatus === "partial_paid" && (
              <p className="receipt-line" style={{ marginTop: "var(--space-2)", textAlign: "center" }}>
                Paid: ₹{invoice.paidAmount?.toFixed(2)} / ₹{invoice.grandTotal.toFixed(2)}
              </p>
            )}
          </div>

          <div className="receipt-divider" />

          {/* Footer */}
          <div className="receipt-footer">
            <p>Thank you for your business!</p>
            <p className="receipt-print-date">Printed: {new Date().toLocaleString("en-IN")}</p>
            {invoice.linkedOrderId && <p className="receipt-sm">Order: {invoice.linkedOrderId}</p>}
          </div>
        </div>
      </div>

      {/* ── Print styles injected ── */}
      <style>{`
        @media print {
          /* Hide UI chrome */
          .app-header, .nav-bar, .drawer-overlay, .drawer-panel,
          .no-print, .page-header, .left-flyout, .app-header,
          .bottom-navigation, .BottomBar, [class*="BottomBar"],
          .drawer-*, [class*="drawer"] {
            display: none !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .app-main {
            padding: 0 !important;
            overflow: visible !important;
          }
          .app-shell {
            box-shadow: none !important;
            border-radius: 0 !important;
            max-height: none !important;
            overflow: visible !important;
            width: 100% !important;
          }
          .page-section {
            gap: 0 !important;
          }
          .receipt {
            max-width: 100% !important;
          }
          .receipt-paper {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 0.6in 0.4in !important;
            page-break-after: avoid !important;
          }
          .receipt-divider {
            border-color: #333 !important;
          }
          @page {
            margin: 0;
            size: auto;
          }
        }
      `}</style>
    </section>
  );
}
