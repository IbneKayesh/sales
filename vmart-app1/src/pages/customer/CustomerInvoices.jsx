import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Clock, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DEMO_INVOICES } from "@/hooks/useVmartData";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import "./CustomerInvoices.css";

const CustomerInvoices = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const customerInvoices = DEMO_INVOICES.filter((i) => i.customerId === user?.id);
  const [activeTab, setActiveTab] = useState("all");

  const displayedInvoices = customerInvoices.filter((i) =>
    activeTab === "due" ? i.due > 0 : true
  );

  return (
    <div className="page-container customer-invoices-page">
      <PageHeader title="My Invoices" subtitle="View shop invoices & dues" />

      <div className="customer-invoices-content">
        <div className="customer-invoices-tabs">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`customer-invoices-tab ${activeTab === "all" ? "customer-invoices-tab-all" : "customer-invoices-tab-all-inactive"}`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("due")}
            className={`customer-invoices-tab ${activeTab === "due" ? "customer-invoices-tab-due" : "customer-invoices-tab-due-inactive"}`}
          >
            Due
          </button>
        </div>

        <div className="customer-invoices-list">
          {displayedInvoices.length > 0 ? (
            displayedInvoices.map((inv) => (
              <div
                key={inv.id}
                onClick={() => navigate(`/customer/invoices/${inv.id}`)}
                className="customer-invoices-card"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/customer/invoices/${inv.id}`)}
              >
                <div className="customer-invoices-card-header">
                  <div className="customer-invoices-card-info">
                    <div className="customer-invoices-card-icon"><FileText size={18} /></div>
                    <div>
                      <div className="customer-invoices-card-no">{inv.invoiceNo}</div>
                      <div className="customer-invoices-card-date">{inv.date}</div>
                    </div>
                  </div>
                  <StatusBadge status={inv.status} />
                </div>
                <div className="customer-invoices-card-footer">
                  <div>
                    <div className="customer-invoices-total-label">Total</div>
                    <div className="customer-invoices-total-val">৳{inv.total}</div>
                  </div>
                  {inv.due > 0 ? (
                    <div className="customer-invoices-due-container">
                      <div className="customer-invoices-due-label"><Clock size={12} /> Due</div>
                      <div className="customer-invoices-due-val">৳{inv.due}</div>
                    </div>
                  ) : (
                    <div className="customer-invoices-due-container">
                      <div className="customer-invoices-paid-label"><CheckCircle size={12} /> Paid</div>
                      <div className="customer-invoices-paid-val">৳{inv.total}</div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <EmptyState icon="🧾" title="No invoices found" />
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerInvoices;
