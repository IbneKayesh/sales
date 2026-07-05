import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import "./DueCollectionsPage.css";

const DueCollectionsPage = () => {
  const navigate = useNavigate();
  const { dueInvoices, recordPayment } = useShop();
  const [payInputs, setPayInputs] = useState({});
  const [paid, setPaid] = useState({});

  const totalDue = dueInvoices.reduce((acc, i) => acc + i.due, 0);

  const handlePay = (invoiceId, maxDue) => {
    const amount = parseFloat(payInputs[invoiceId]);
    if (!amount || amount <= 0 || amount > maxDue) {
      alert(`Enter amount between 1 and ${maxDue}`); return;
    }
    recordPayment(invoiceId, amount);
    setPaid((prev) => ({ ...prev, [invoiceId]: true }));
    setPayInputs((prev) => ({ ...prev, [invoiceId]: "" }));
  };

  return (
    <div className="app-container due-page">
      <div className="due-page-header">
        <button onClick={() => navigate("/")} className="due-page-back-btn">
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="due-page-title">Due Collections</div>
          <div className="due-page-subtitle">{dueInvoices.length} invoice{dueInvoices.length !== 1 ? "s" : ""} pending</div>
        </div>
      </div>

      <div className="due-banner">
        <div className="due-banner-label">Total Outstanding</div>
        <div className="due-banner-amount">৳{totalDue.toLocaleString()}</div>
        <div className="due-banner-note">{dueInvoices.length} invoices need collection</div>
      </div>

      {dueInvoices.length === 0 ? (
        <div className="due-empty">
          <div className="due-empty-icon"><CheckCircle size={48} color="#22c55e" /></div>
          <h3 className="due-empty-title">All Cleared!</h3>
          <p className="due-empty-text">No outstanding dues</p>
        </div>
      ) : (
        <div className="due-list">
          {dueInvoices.map((inv) => (
            <div key={inv.id} className="card due-card">
              <div className="due-card-header">
                <div className="due-card-left">
                  <div className="due-card-inv-no">{inv.invoiceNo}</div>
                  <div className="due-card-name">{inv.customerName}</div>
                  {inv.customerMobile && <div className="due-card-phone">📱 {inv.customerMobile}</div>}
                  <div className="due-card-date">Due date: {inv.dueDate}</div>
                </div>
                <div className="due-card-right">
                  <div className="due-card-total">Total: ৳{inv.total}</div>
                  <div className="due-card-paid">Paid: ৳{inv.paid}</div>
                  <div className="due-card-due">Due: ৳{inv.due}</div>
                </div>
              </div>

              {paid[inv.id] ? (
                <div className="due-card-paid-msg">
                  <CheckCircle size={16} color="#16a34a" />
                  <span className="due-card-paid-text">Payment recorded!</span>
                </div>
              ) : (
                <div className="due-card-pay-row">
                  <input
                    type="number" placeholder={`Amount (max ৳${inv.due})`}
                    value={payInputs[inv.id] || ""}
                    onChange={(e) => setPayInputs((prev) => ({ ...prev, [inv.id]: e.target.value }))}
                    className="due-card-pay-input"
                  />
                  <button onClick={() => handlePay(inv.id, inv.due)} className="due-card-collect-btn">Collect</button>
                  <button onClick={() => setPayInputs((prev) => ({ ...prev, [inv.id]: String(inv.due) }))} className="due-card-full-btn">Full</button>
                </div>
              )}

              <button onClick={() => navigate(`/invoice/view/${inv.id}`)} className="due-card-view-btn">
                View Invoice →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DueCollectionsPage;
