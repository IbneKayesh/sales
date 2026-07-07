import { useState, useEffect, useRef } from "react";
import { FiDollarSign, FiCheckCircle, FiSearch, FiX } from "react-icons/fi";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";
import { load, save, KEYS } from "../../utils/storage";
import SearchInput from "../../components/ui/SearchInput";
import InvoiceCollectionPayModal from "./InvoiceCollectionPayModal";
import "./InvoiceCollectionPage.css";

export default function InvoiceCollectionPage() {
  const { showToast, setBusy, isBusy } = useUI();
  const { user, isCustomer, isShop } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchTimerRef = useRef(null);
  const [payModal, setPayModal] = useState(null);
  const [payAmount, setPayAmount] = useState(0);

  useEffect(() => {
    setInvoices(load(KEYS.INVOICES));
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  const roleFiltered = isCustomer
    ? invoices.filter((inv) => inv.customer?.name === user?.name)
    : isShop
      ? invoices.filter((inv) => inv.shop === (user?.shopName || user?.name))
      : invoices;

  const dueInvoices = roleFiltered.filter(
    (inv) => inv.paymentStatus !== "paid" &&
      (inv.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase())),
  );

  const totalDue = dueInvoices.reduce((s, inv) => {
    const paid = inv.paymentStatus === "partial_paid" ? inv.paidAmount || 0 : 0;
    return s + (inv.grandTotal - paid);
  }, 0);

  const recordPayment = (id) => {
    setBusy(true);
    setInvoices((prev) => {
      const next = prev.map((inv) => {
        if (inv.id !== id) return inv;
        const newPaid = inv.paymentStatus === "partial_paid" ? (inv.paidAmount || 0) + Number(payAmount) : Number(payAmount);
        const newStatus = newPaid >= inv.grandTotal ? "paid" : "partial_paid";
        return { ...inv, paymentStatus: newStatus, paidAmount: newPaid };
      });
      save(KEYS.INVOICES, next);
      return next;
    });
    setPayModal(null);
    setPayAmount(0);
    showToast("Payment recorded successfully");
    setBusy(false);
  };

  const getDue = (inv) => {
    const paid = inv.paymentStatus === "partial_paid" ? inv.paidAmount || 0 : 0;
    return inv.grandTotal - paid;
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Collections</p>
          <h1 className="page-heading">Invoice Collections</h1>
        </div>
        <div className="ui-badge"><FiDollarSign /></div>
      </div>

      {/* Summary card */}
      <div className="ui-card collect-summary-card">
        <div className="collect-summary-row">
          <div>
            <div className="collect-summary-label">Total Outstanding</div>
            <div className="collect-summary-amount">₹{totalDue.toFixed(2)}</div>
          </div>
          <div className="collect-summary-right">
            <div className="collect-summary-subtle">Due Invoices</div>
            <div className="collect-summary-count">{dueInvoices.length}</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <SearchInput
        id="invoice-collection-search"
        placeholder="Search by customer or invoice..."
        value={searchInput}
        onChange={(e) => {
          const val = e.target.value;
          setSearchInput(val);
          setIsSearching(true);
          if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
          searchTimerRef.current = setTimeout(() => {
            setSearch(val);
            setIsSearching(false);
          }, 300);
        }}
        loading={isSearching}
      />

      {dueInvoices.length === 0 ? (
        <div className="collect-empty-state">
          <div className="collect-empty-icon"
            style={{ background: search ? "var(--error-bg)" : "var(--accent-soft)", color: search ? "var(--error)" : "var(--accent)" }}>
            {search ? "🔍" : "🎉"}
          </div>
          <div>
            <h3 className="collect-empty-title">{search ? "No matching invoices" : "All invoices are paid!"}</h3>
            <p className="collect-empty-desc">{search ? `No invoices match "${search}"` : "Nothing due right now."}</p>
          </div>
        </div>
      ) : (
        <div className="ui-card">
          <h3 className="ui-card-title">Due Invoices ({dueInvoices.length})</h3>
          <div className="collect-list">
            {dueInvoices.map((inv) => {
              const due = getDue(inv);
              return (
                <div key={inv.id} className="collect-item">
                  <div className="collect-item-top">
                    <div>
                      <div className="collect-item-name">{inv.customer.name}</div>
                      <div className="collect-item-number">{inv.invoiceNumber}</div>
                      <div className="collect-item-status-row">
                        <span className="collect-item-badge"
                          style={{ background: inv.paymentStatus === "partial_paid" ? "orange" : "var(--error)" }}>
                          {inv.paymentStatus?.replace(/_/g, " ") || "due"}
                        </span>
                        <span className="collect-item-meta">{inv.items?.length || 0} items</span>
                      </div>
                    </div>
                    <div className="collect-summary-right">
                      <div className="collect-item-amount">₹{due.toFixed(2)}</div>
                      <div className="collect-item-due-label">due</div>
                    </div>
                  </div>
                  {inv.paymentStatus === "partial_paid" && (
                    <div className="collect-partial-info">Paid: ₹{(inv.paidAmount || 0).toFixed(2)} of ₹{inv.grandTotal.toFixed(2)}</div>
                  )}
                  <button className="ui-btn ui-btn-primary collect-pay-btn"
                    onClick={() => { setPayModal(inv.id); setPayAmount(due); }}>
                    <FiCheckCircle /> Collect Payment
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {payModal && (
        <InvoiceCollectionPayModal
          payModal={payModal}
          invoices={invoices}
          getDue={getDue}
          payAmount={payAmount}
          setPayAmount={setPayAmount}
          isBusy={isBusy}
          recordPayment={recordPayment}
          closePayModal={() => { setPayModal(null); setPayAmount(0); }}
        />
      )}
    </section>
  );
}
