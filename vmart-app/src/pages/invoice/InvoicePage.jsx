import { useState, useEffect, useRef } from "react";
import {
  FiFileText,
  FiPlus,
  FiTrash2,
  FiExternalLink,
  FiEdit2,
  FiShoppingBag,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";
import SearchInput from "../../components/ui/SearchInput";
import InvoiceDetailView from "./InvoiceDetailView";
import InvoiceFormModal from "./InvoiceFormModal";
import "./InvoicePage.css";

const emptyCustomer = { name: "", contact: "", address: "" };
const defaultProduct = { name: "", qty: 1, price: 0, discount: 0 };

export default function InvoicePage() {
  const { showToast, showConfirm, setBusy, isBusy } = useUI();
  const { user, isCustomer, isShop } = useAuth();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState(false);

  const [customer, setCustomer] = useState({ ...emptyCustomer });
  const [items, setItems] = useState([{ ...defaultProduct }]);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [invStatus, setInvStatus] = useState("draft");
  const [paymentStatus, setPaymentStatus] = useState("due");
  const [paidAmount, setPaidAmount] = useState(0);
  const [deliveryAgent, setDeliveryAgent] = useState("");
  const [linkedOrderId, setLinkedOrderId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchTimerRef = useRef(null);

  useEffect(() => {
    setInvoices(load(KEYS.INVOICES));
    setOrders(load(KEYS.ORDERS));
    setCustomers(load(KEYS.CUSTOMERS));
    setProducts(load(KEYS.PRODUCTS));
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  const calcItemTotal = (item) => {
    const t = item.qty * item.price;
    const d = item.discount > 0 ? (t * item.discount) / 100 : 0;
    return t - d;
  };
  const itemsTotal = items.reduce((s, i) => s + calcItemTotal(i), 0);
  const grandTotal = itemsTotal + Number(deliveryCharge);

  const resetForm = () => {
    setCustomer({ ...emptyCustomer });
    setItems([{ ...defaultProduct }]);
    setDeliveryCharge(0);
    setInvStatus("draft");
    setPaymentStatus("due");
    setPaidAmount(0);
    setDeliveryAgent("");
    setLinkedOrderId(null);
    setEditingId(null);
  };

  const openAdd = () => { resetForm(); setModal(true); };
  const openEdit = (id) => {
    const inv = invoices.find((i) => i.id === id);
    if (!inv) return;
    setCustomer({ ...inv.customer });
    setItems(inv.items.length > 0 ? inv.items.map((i) => ({ ...i })) : [{ ...defaultProduct }]);
    setDeliveryCharge(inv.deliveryCharge || 0);
    setInvStatus(inv.status || "draft");
    setPaymentStatus(inv.paymentStatus || "due");
    setPaidAmount(inv.paidAmount || 0);
    setDeliveryAgent(inv.deliveryAgent || "");
    setLinkedOrderId(inv.linkedOrderId || null);
    setEditingId(id);
    setModal(true);
  };
  const closeModal = () => { setModal(false); resetForm(); };

  const loadFromOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    setCustomer({ ...order.customer });
    setItems(order.products.map((p) => ({ name: p.name, qty: p.qty, price: p.price, discount: p.discount })));
    setDeliveryCharge(order.deliveryCharge || 0);
    setInvStatus("in_process");
    setDeliveryAgent("");
    setLinkedOrderId(orderId);
    setModal(true);
  };

  const saveInvoice = () => {
    if (!customer.name.trim()) return;
    if (!items.some((i) => i.name.trim())) return;
    setBusy(true);
    const linkedOrder = linkedOrderId ? orders.find((o) => o.id === linkedOrderId) : null;
    const invNum = editingId
      ? invoices.find((i) => i.id === editingId)?.invoiceNumber || `INV-${Date.now().toString(36).slice(0, 8).toUpperCase()}`
      : `INV-${Date.now().toString(36).slice(0, 8).toUpperCase()}`;
    const invoice = {
      id: editingId || Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      invoiceNumber: invNum,
      createdAt: editingId ? invoices.find((i) => i.id === editingId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shop: linkedOrder?.shop || "",
      customer: { ...customer },
      items: items.filter((i) => i.name.trim()).map((i) => ({ ...i })),
      deliveryCharge: Number(deliveryCharge), deliveryAgent: deliveryAgent.trim(),
      itemsTotal, grandTotal, status: invStatus, paymentStatus, paidAmount: Number(paidAmount), linkedOrderId,
    };
    let updated;
    if (editingId) { updated = invoices.map((i) => (i.id === editingId ? invoice : i)); }
    else { updated = [...invoices, invoice]; }
    save(KEYS.INVOICES, updated);
    setInvoices(updated);
    if (linkedOrderId) {
      const updatedOrders = orders.map((o) =>
        o.id === linkedOrderId
          ? { ...o, status: invStatus, paymentStatus, paidAmount: Number(paidAmount), invoiceId: invoice.id }
          : o,
      );
      save(KEYS.ORDERS, updatedOrders);
      setOrders(updatedOrders);
    }
    closeModal();
    showToast(editingId ? "Invoice updated successfully" : "Invoice created successfully");
    setBusy(false);
  };

  const deleteInvoice = async (id) => {
    const inv = invoices.find((i) => i.id === id);
    const confirmed = await showConfirm(`Delete invoice ${inv?.invoiceNumber || ""} for ${inv?.customer?.name || "this customer"}?`);
    if (!confirmed) return;
    setBusy(true);
    const updated = invoices.filter((i) => i.id !== id);
    save(KEYS.INVOICES, updated);
    setInvoices(updated);
    if (editingId === id) closeModal();
    showToast("Invoice deleted", "error");
    setBusy(false);
  };

  /* ── Detail view ── */
  const selected = invoices.find((i) => i.id === selectedId);
  if (selectedId && selected) {
    return (
      <InvoiceDetailView
        invoice={selected}
        onBack={() => setSelectedId(null)}
        onEdit={openEdit}
      />
    );
  }

  /* ── List view ── */
  const roleFilteredInvoices = isCustomer
    ? invoices.filter((inv) => inv.customer?.name === user?.name)
    : isShop ? invoices.filter((inv) => inv.shop === (user?.shopName || user?.name)) : invoices;

  const searchedInvoices = roleFilteredInvoices.filter(
    (inv) => !searchQuery.trim() || inv.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) || inv.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Billing</p>
          <h1 className="page-heading">Invoices ({roleFilteredInvoices.length})</h1>
        </div>
        <div className="inv-header-actions">
          {!isCustomer && (
            <button className="ui-btn ui-btn-primary inv-new-btn" onClick={openAdd}><FiPlus /> New</button>
          )}
          <div className="ui-badge"><FiFileText /></div>
        </div>
      </div>

      {/* Create from order */}
      {!isCustomer && orders.filter((o) => !isShop || o.shop === (user?.shopName || user?.name)).length > 0 && (
        <div className="ui-card">
          <h3 className="ui-card-title">Create from Order</h3>
          <div className="inv-from-order-list">
            {[...orders].filter((o) => !isShop || o.shop === (user?.shopName || user?.name)).reverse().slice(0, 10).map((order) => (
              <div key={order.id} onClick={() => loadFromOrder(order.id)} className="inv-from-order-item">
                <div className="inv-from-order-info">
                  <div className="inv-from-order-name">{order.customer.name}</div>
                  <div className="inv-from-order-detail">₹{order.grandTotal.toFixed(2)} · {order.products.length} items</div>
                </div>
                <span className="ui-tag">Create Invoice</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invoice list */}
      {roleFilteredInvoices.length === 0 ? (
        <div className="inv-empty-state">
          <div className="inv-empty-icon"><FiFileText /></div>
          <div>
            <h3 className="inv-empty-heading">No invoices yet</h3>
            <p className="inv-empty-text">
              {isCustomer ? "You don't have any invoices yet." : isShop ? "No invoices for your shop yet." : "Create one from an order or from scratch."}
            </p>
          </div>
        </div>
      ) : (
        <div className="ui-card">
          <div className="inv-list-header">
            <h3 className="ui-card-title inv-list-title">All Invoices ({roleFilteredInvoices.length})</h3>
            <SearchInput
              id="invoice-search"
              placeholder="Search by customer or invoice..."
              value={searchInput}
              onChange={(e) => {
                const val = e.target.value;
                setSearchInput(val);
                setIsSearching(true);
                if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
                searchTimerRef.current = setTimeout(() => {
                  setSearchQuery(val);
                  setIsSearching(false);
                }, 300);
              }}
              className="inv-list-search"
              loading={isSearching}
            />
          </div>
          {searchedInvoices.length === 0 ? (
            <p className="inv-not-found-text">No invoices match "{searchQuery}"</p>
          ) : (
            <div className="inv-list">
              {[...searchedInvoices].reverse().map((inv) => (
                <div key={inv.id} className="inv-list-item" onClick={() => setSelectedId(inv.id)}>
                  <div className="inv-list-info">
                    <div className="inv-list-name-row">
                      <span className="inv-list-name">{inv.customer.name}</span>
                      <span className="inv-list-number">{inv.invoiceNumber}</span>
                    </div>
                    <div className="inv-list-status-row">
                      <span className="inv-status-badge inv-status-badge--sm"
                        style={{ background: inv.status === "delivered" ? "var(--accent-primary)" : "var(--text-subtle)" }}>
                        {inv.status?.replace(/_/g, " ") || "draft"}
                      </span>
                      <span className="inv-status-badge inv-status-badge--sm"
                        style={{ background: inv.paymentStatus === "paid" ? "green" : inv.paymentStatus === "partial_paid" ? "orange" : "var(--error)" }}>
                        {inv.paymentStatus?.replace(/_/g, " ") || "due"}
                      </span>
                    </div>
                    {inv.deliveryAgent && (
                      <div className="inv-list-agent">🚚 {inv.deliveryAgent}{inv.deliveryCharge > 0 && <span> · ₹{Number(inv.deliveryCharge).toFixed(2)}</span>}</div>
                    )}
                  </div>
                  <div className="inv-list-amount">₹{inv.grandTotal.toFixed(2)}</div>
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/invoice/${inv.invoiceNumber}`); }}
                    className="inv-icon-btn"><FiExternalLink size={14} /></button>
                  <button onClick={(e) => { e.stopPropagation(); deleteInvoice(inv.id); }}
                    className="inv-icon-btn inv-icon-btn--delete"><FiTrash2 size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <InvoiceFormModal
          editingId={editingId}
          closeModal={closeModal}
          customers={customers}
          customer={customer}
          setCustomer={setCustomer}
          items={items}
          setItems={setItems}
          invStatus={invStatus}
          setInvStatus={setInvStatus}
          paymentStatus={paymentStatus}
          setPaymentStatus={setPaymentStatus}
          paidAmount={paidAmount}
          setPaidAmount={setPaidAmount}
          deliveryAgent={deliveryAgent}
          setDeliveryAgent={setDeliveryAgent}
          deliveryCharge={deliveryCharge}
          setDeliveryCharge={setDeliveryCharge}
          grandTotal={grandTotal}
          products={products}
          isBusy={isBusy}
          saveInvoice={saveInvoice}
        />
      )}
    </section>
  );
}
