import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle } from "lucide-react";
import { DEMO_INVOICES } from "@/hooks/useVmartData";
import { useAuth } from "@/context/AuthContext";
import StatusBadge from "@/components/ui/StatusBadge";
import "./CustomerInvoiceDetail.css";

const CustomerInvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const invoice = DEMO_INVOICES.find((i) => i.id === id && i.customerId === user?.id);

  if (!invoice) {
    return (
      <div className="page-container">
        <div style={{ textAlign: "center", padding: "32px 16px" }}>
          <div style={{ fontSize: "40px" }}>🧾</div>
          <h3>Invoice not found</h3>
          <button type="button" className="btn-primary" style={{ marginTop: "12px" }} onClick={() => navigate("/customer/invoices")}>
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container customer-invoice-detail">
      <div className="cid-header">
        <button type="button" onClick={() => navigate("/customer/invoices")} className="back-btn">
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="cid-title">{invoice.invoiceNo}</div>
          <div className="cid-date">{invoice.date}</div>
        </div>
        <StatusBadge status={invoice.status} />
      </div>

      <div className="card cid-summary">
        <div className="cid-row"><span>Due Date</span><span>{invoice.dueDate}</span></div>
        <div className="cid-row"><span>Subtotal</span><span>৳{invoice.subtotal}</span></div>
        {invoice.discount > 0 && (
          <div className="cid-row"><span>Discount</span><span>-৳{invoice.discount}</span></div>
        )}
        <div className="cid-row cid-total"><span>Total</span><span>৳{invoice.total}</span></div>
        <div className="cid-row">
          <span>Paid</span>
          <span className="cid-paid">৳{invoice.paid}</span>
        </div>
        {invoice.due > 0 ? (
          <div className="cid-due-box">
            <Clock size={14} /> Due: ৳{invoice.due}
          </div>
        ) : (
          <div className="cid-paid-box">
            <CheckCircle size={14} /> Fully Paid
          </div>
        )}
      </div>

      <div className="card cid-items">
        <h3>Items</h3>
        {invoice.items.map((item) => (
          <div key={item.productId} className="cid-item">
            <span>{item.name}</span>
            <span>৳{item.price} × {item.qty}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerInvoiceDetail;
