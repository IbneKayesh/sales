import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiPackage, FiEdit2, FiList, FiPlusCircle, FiStore, FiSearch } from "react-icons/fi";
import SearchableSelect from "../../components/SearchableSelect";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

const defaultProduct = { name: "", qty: 1, price: 0, discount: 0 };
const emptyCustomer = { name: "", contact: "", address: "" };

export default function OrderPage() {
  const [savedCustomers, setSavedCustomers] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [savedOrders, setSavedOrders] = useState([]);
  const [shops, setShops] = useState([]);
  const [shopFilter, setShopFilter] = useState("");

  const [customer, setCustomer] = useState({ ...emptyCustomer });
  const [products, setProducts] = useState([{ ...defaultProduct }]);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [view, setView] = useState("list"); // "form" | "list"
  const [orderShop, setOrderShop] = useState("");

  useEffect(() => {
    setSavedCustomers(load(KEYS.CUSTOMERS));
    setSavedProducts(load(KEYS.PRODUCTS));
    setSavedOrders(load(KEYS.ORDERS));
    setShops(load(KEYS.SHOPS));
  }, []);

  const calcSubtotal = (item) => {
    const lineTotal = item.qty * item.price;
    const discAmount = item.discount > 0 ? (lineTotal * item.discount) / 100 : 0;
    return lineTotal - discAmount;
  };

  const itemsTotal = products.reduce((sum, item) => sum + calcSubtotal(item), 0);
  const grandTotal = itemsTotal + Number(deliveryCharge);

  const resetForm = () => {
    setCustomer({ ...emptyCustomer });
    setProducts([{ ...defaultProduct }]);
    setDeliveryCharge(0);
    setOrderStatus("pending");
    setPaymentStatus("due");
    setPaidAmount(0);
    setOrderShop("");
    setEditingOrderId(null);
  };

  const handleCustomerSelect = (name) => {
    const found = savedCustomers.find((c) => c.name === name);
    setCustomer(found
      ? { name: found.name, contact: found.contact || "", address: found.address || "" }
      : { ...emptyCustomer });
  };

  const handleCustomerField = (field, value) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductSelect = (index, name) => {
    const found = savedProducts.find((p) => p.name === name);
    setProducts((prev) => {
      const next = [...prev];
      if (found) {
        next[index] = { name: found.name, qty: 1, price: found.price || 0, discount: found.discount || 0 };
      } else {
        next[index] = { ...defaultProduct };
      }
      return next;
    });
  };

  const handleProductField = (index, field, value) => {
    setProducts((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addProduct = () => setProducts((prev) => [...prev, { ...defaultProduct }]);
  const removeProduct = (index) => setProducts((prev) => prev.filter((_, i) => i !== index));

  const statusOptions = ["pending", "in_process", "delivered_to_courier", "delivered"];
  const paymentOptions = ["due", "partial_paid", "paid"];

  const [orderStatus, setOrderStatus] = useState("pending");
  const [paymentStatus, setPaymentStatus] = useState("due");
  const [paidAmount, setPaidAmount] = useState(0);

  const { showToast, showConfirm } = useUI();

  const placeOrder = () => {
    if (!customer.name.trim()) return;
    const hasProduct = products.some((p) => p.name.trim());
    if (!hasProduct) return;

    const order = {
      id: editingOrderId || generateId(),
      createdAt: editingOrderId
        ? savedOrders.find((o) => o.id === editingOrderId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shop: orderShop || "",
      customer: { ...customer },
      products: products.filter((p) => p.name.trim()).map((p) => ({ ...p })),
      deliveryCharge: Number(deliveryCharge),
      itemsTotal,
      grandTotal,
      status: orderStatus,
      paymentStatus,
      paidAmount: Number(paidAmount),
      invoiceId: null,
    };

    let updated;
    if (editingOrderId) {
      updated = savedOrders.map((o) => (o.id === editingOrderId ? order : o));
    } else {
      updated = [...savedOrders, order];
    }

    setSavedOrders(updated);
    save(KEYS.ORDERS, updated);
    resetForm();
    setView("list");
    showToast(editingOrderId ? "Order updated successfully" : "Order placed successfully");
  };

  const editOrder = (id) => {
    const order = savedOrders.find((o) => o.id === id);
    if (!order) return;
    setCustomer({ ...order.customer });
    setProducts(order.products.length > 0 ? order.products.map((p) => ({ ...p })) : [{ ...defaultProduct }]);
    setDeliveryCharge(order.deliveryCharge || 0);
    setOrderStatus(order.status || "pending");
    setPaymentStatus(order.paymentStatus || "due");
    setPaidAmount(order.paidAmount || 0);
    setOrderShop(order.shop || "");
    setEditingOrderId(id);
    setView("form");
  };

  const deleteOrder = async (id) => {
    const order = savedOrders.find((o) => o.id === id);
    const confirmed = await showConfirm(`Delete order for ${order?.customer?.name || "this customer"}?`);
    if (!confirmed) return;
    const updated = savedOrders.filter((o) => o.id !== id);
    setSavedOrders(updated);
    save(KEYS.ORDERS, updated);
    if (editingOrderId === id) resetForm();
    showToast("Order deleted", "error");
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    } catch { return ""; }
  };

  /* Filter orders by shop */
  const filteredOrders = shopFilter
    ? savedOrders.filter((o) => o.shop === shopFilter)
    : savedOrders;

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Orders</p>
          <h1 className="page-heading">{view === "form" ? (editingOrderId ? "Edit Order" : "New Order") : "All Orders"}</h1>
        </div>
        <div className="ui-badge" style={{ cursor: "pointer" }} onClick={() => setView(view === "form" ? "list" : "form")}>
          {view === "form" ? <FiList /> : <FiPlusCircle />}
        </div>
      </div>

      {view === "form" && (
        <>
          {/* Shop selection */}
          <div className="ui-card">
            <h3 className="ui-card-title">Shop / Vendor</h3>
            <div className="ui-form-field">
              <div className="ui-select-wrapper">
                <select className="ui-select" value={orderShop} onChange={(e) => setOrderShop(e.target.value)}>
                  <option value="">Select shop (optional)</option>
                  {shops.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="ui-card">
            <h3 className="ui-card-title">Customer Details</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div className="ui-form-field">
                <label className="ui-form-label">Customer Name</label>
                <SearchableSelect value={customer.name} onChange={handleCustomerSelect}
                  options={savedCustomers.map((c) => c.name)} placeholder="Search customers..." />
              </div>
              <div className="ui-form-field">
                <label className="ui-form-label">Contact No</label>
                <input type="tel" className="ui-input" placeholder="Phone number" value={customer.contact}
                  onChange={(e) => handleCustomerField("contact", e.target.value)} />
              </div>
              <div className="ui-form-field">
     
