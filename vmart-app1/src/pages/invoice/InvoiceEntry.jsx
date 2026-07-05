import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Plus, Save, Search, Trash2, UserPlus, X } from "lucide-react";
import { useShop } from "@/context/ShopContext";

const InvoiceEntry = () => {
  const navigate = useNavigate();
  const { products, pendingOrders, customers, createInvoiceFromOrder, createBlankInvoice } = useShop();
  const { addCustomer } = useShop();

  const [mode, setMode]           = useState("blank"); // "blank" | "from-order"
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customerName,  setCustomerName]  = useState("");
  const [customerMobile,setCustomerMobile]= useState("");
  const [customerId,    setCustomerId]    = useState(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState("");
  const [newCustMobile, setNewCustMobile] = useState("");
  const [productSearch, setProductSearch] = useState({});
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [activeProductDropdown, setActiveProductDropdown] = useState(null);
  const [discount,      setDiscount]      = useState(0);
  const [deliveryCharge,setDeliveryCharge]  = useState(0);
  const [deliveryMan,   setDeliveryMan]   = useState("");
  const [items, setItems] = useState([{ id: Date.now(), productId: null, name: "", qty: 1, price: 0, discount: 0 }]);

  const customerQuery = customerName.trim().toLowerCase();
  const filteredCustomers = customers
    .filter((c) => {
      if (!customerQuery) return true;
      return (
        (c.name || "").toLowerCase().includes(customerQuery) ||
        (c.mobile || "").includes(customerQuery)
      );
    })
    .slice(0, 20);

  const inputShellStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
  };

  const inputIconStyle = {
    position: "absolute",
    left: 10,
    color: "var(--text-secondary)",
    pointerEvents: "none",
  };

  const dropdownStyle = {
    maxHeight: 190,
    overflowY: "auto",
    border: "1px solid var(--border)",
    borderRadius: 8,
    background: "var(--surface)",
    boxShadow: "0 12px 24px rgba(15, 23, 42, 0.12)",
    marginTop: 6,
    zIndex: 60,
  };

  const getFilteredProducts = (itemId) => {
    const q = (productSearch[itemId] || "").toLowerCase().trim();
    return products
      .filter((p) => {
        if (!q) return true;
        return (
          (p.name || "").toLowerCase().includes(q) ||
          (p.sku || "").toLowerCase().includes(q)
        );
      })
      .slice(0, 30);
  };

  // When "from order" selected
  const handleSelectOrder = (orderId) => {
    const order = pendingOrders.find((o) => o.id === orderId);
    if (!order) return;
    setSelectedOrder(order);
    const cust = customers.find((c) => c.id === order.customerId);
    setCustomerName(cust?.name || "");
    setCustomerMobile(cust?.mobile || "");
    setCustomerId(cust?.id || null);
    setItems(order.items.map((i, idx) => ({ id: idx, discount: 0, ...i })));
  };

  // Items management
  const addItem = () => setItems([...items, { id: Date.now(), productId: null, name: "", qty: 1, price: 0, discount: 0 }]);
  const removeItem = (id) => { if (items.length > 1) setItems(items.filter((i) => i.id !== id)); };
  const updateItem = (id, field, value) => setItems(items.map((i) => i.id === id ? { ...i, [field]: value } : i));

  const handleSelectCustomer = (customer) => {
    setCustomerName(customer.name || "");
    setCustomerMobile(customer.mobile || "");
    setCustomerId(customer.id);
    setCustomerDropdownOpen(false);
  };

  const handleSelectProduct = (itemId, productId) => {
    const p = products.find((pr) => pr.id === parseInt(productId));
    if (p) updateItem(itemId, "name", p.name);
    if (p) updateItem(itemId, "price", p.price);
    if (p) updateItem(itemId, "discount", p.discount || 0); // Apply product default discount if exists
    if (p) updateItem(itemId, "productId", p.id);
    if (p) setProductSearch((s) => ({ ...s, [itemId]: p.name }));
    if (p) setActiveProductDropdown(null);
  };

  const subtotal = items.reduce((acc, i) => acc + (i.price - (i.discount || 0)) * i.qty, 0);
  const total    = subtotal + deliveryCharge - discount;

  const handleSave = () => {
    if (!customerName.trim()) { alert("Please enter customer name"); return; }
    if (items.some((i) => !i.name || !i.price)) { alert("Please fill all item details"); return; }

    let newInv;
    if (mode === "from-order" && selectedOrder) {
      newInv = createInvoiceFromOrder(selectedOrder, deliveryCharge, discount, deliveryMan);
    } else {
      newInv = createBlankInvoice({ customerId, customerName, customerMobile, items, deliveryCharge, discount, deliveryMan });
    }
    navigate(`/invoice/view/${newInv.id}`);
  };

  return (
    <div className="app-container" style={{ paddingBottom: "80px" }}>
      <div className="card" style={{ margin: "12px" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "16px", color: "var(--on-background)" }}>New Invoice</h2>

        {/* Mode selector */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          {[["blank", "Blank Invoice"], ["from-order", "From Order"]].map(([val, label]) => (
            <button key={val} onClick={() => { setMode(val); setSelectedOrder(null); setItems([{ id: Date.now(), productId: null, name: "", qty: 1, price: 0, discount: 0 }]); }}
              style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid", cursor: "pointer", fontWeight: 700, fontSize: "13px",
                background: mode === val ? "var(--primary)" : "var(--surface)",
                color:      mode === val ? "#fff"          : "var(--on-surface)",
                borderColor: mode === val ? "var(--primary)" : "var(--border)",
              }}>{label}</button>
          ))}
        </div>

        {/* From order — select order */}
        {mode === "from-order" && (
          <div className="form-group" style={{ marginBottom: "14px" }}>
            <label>Select Order</label>
            <select onChange={(e) => handleSelectOrder(e.target.value)} value={selectedOrder?.id || ""}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--background)", color: "var(--on-surface)", fontSize: "14px" }}>
              <option value="">— Choose a pending order —</option>
              {pendingOrders.map((o) => (
                <option key={o.id} value={o.id}>{o.orderNo} — {customers.find((c) => c.id === o.customerId)?.name || "?"} (৳{o.total})</option>
              ))}
            </select>
            {pendingOrders.length === 0 && <p style={{ fontSize: "12px", color: "#d97706", marginTop: "4px" }}>No pending orders without invoices</p>}
          </div>
        )}

        {/* Customer */}
        <div style={{ marginBottom: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "8px", alignItems: "end" }}>
            <div className="form-group" style={{ marginBottom: 0, position: "relative" }}>
              <label>Customer</label>
              <div style={inputShellStyle}>
                <Search size={15} style={inputIconStyle} />
                <input
                  type="text"
                  placeholder="Search customer name or mobile"
                  value={customerName}
                  onBlur={() => setTimeout(() => setCustomerDropdownOpen(false), 120)}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    setCustomerId(null);
                    setCustomerDropdownOpen(true);
                  }}
                  onFocus={() => setCustomerDropdownOpen(true)}
                  style={{ paddingLeft: 34, paddingRight: customerName ? 34 : 12 }}
                />
                {customerName && (
                  <button
                    type="button"
                    aria-label="Clear customer"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setCustomerName("");
                      setCustomerMobile("");
                      setCustomerId(null);
                      setCustomerDropdownOpen(true);
                    }}
                    style={{
                      position: "absolute",
                      right: 8,
                      border: "none",
                      background: "transparent",
                      color: "var(--text-secondary)",
                      display: "flex",
                      padding: 4,
                      cursor: "pointer",
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              {customerDropdownOpen && (
                <div style={{ ...dropdownStyle, position: "absolute", left: 0, right: 0 }}>
                  {filteredCustomers.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelectCustomer(c)}
                      style={{
                        width: "100%",
                        border: "none",
                        borderBottom: "1px solid var(--border)",
                        background: c.id === customerId ? "var(--primary-light)" : "transparent",
                        color: "var(--on-surface)",
                        padding: "9px 10px",
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: 13 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>
                        {c.mobile || "No mobile"}
                      </div>
                    </button>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <div style={{ padding: 10, color: "var(--text-secondary)", fontSize: 12 }}>
                      No matching customers
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              title="Add customer"
              onClick={() => setShowAddCustomer((s) => !s)}
              style={{
                height: 38,
                width: 42,
                border: "1px solid var(--border)",
                borderRadius: 10,
                background: showAddCustomer ? "var(--primary)" : "var(--surface)",
                color: showAddCustomer ? "#fff" : "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <UserPlus size={17} />
            </button>
          </div>
          <div className="form-group" style={{ marginTop: 8, marginBottom: 0 }}>
            <label>Mobile</label>
            <input
              type="text"
              placeholder="Customer mobile"
              value={customerMobile}
              onChange={(e) => setCustomerMobile(e.target.value)}
            />
          </div>
        </div>

        {/* Inline add customer form */}
        {showAddCustomer && (
          <div style={{ padding: 10, border: "1px solid var(--border)", borderRadius: 8, marginBottom: 12, background: "var(--background)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
              <input placeholder="New customer name" value={newCustName} onChange={(e) => setNewCustName(e.target.value)} />
              <input placeholder="Mobile" value={newCustMobile} onChange={(e) => setNewCustMobile(e.target.value)} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button onClick={() => {
                  if (!newCustName.trim()) return alert("Enter name");
                  const created = addCustomer({ name: newCustName.trim(), mobile: newCustMobile.trim() });
                  setCustomerId(created.id); setCustomerName(created.name); setCustomerMobile(created.mobile || "");
                  setNewCustName(""); setNewCustMobile(""); setShowAddCustomer(false);
                }} style={{ height: 36, borderRadius: 8, background: "var(--primary)", color: "#fff", border: "none", cursor: "pointer", fontWeight: 700 }}>Create</button>
                <button onClick={() => setShowAddCustomer(false)} style={{ height: 36, borderRadius: 8, background: "var(--surface)", color: "var(--on-surface)", border: "1px solid var(--border)", cursor: "pointer", fontWeight: 700 }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Items */}
        <div style={{ marginBottom: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 800 }}>Items</h4>
            <button type="button" onClick={addItem}
              style={{ background: "none", border: "none", color: "var(--primary)", display: "flex", alignItems: "center", gap: "4px", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>
              <Plus size={16} /> Add Item
            </button>
          </div>

          {items.map((item) => (
            <div key={item.id} style={{ padding: "10px", background: "var(--background)", borderRadius: "8px", marginBottom: "8px", border: "1px solid var(--border)" }}>
              {/* Product selector: searchable dropdown */}
              {products.length > 0 && (
                <div className="form-group" style={{ marginBottom: "8px" }}>
                  <label>Product</label>
                  <div style={inputShellStyle}>
                    <Package size={15} style={inputIconStyle} />
                    <input
                      placeholder="Search product name or SKU"
                      value={productSearch[item.id] ?? item.name}
                      onBlur={() => setTimeout(() => setActiveProductDropdown(null), 120)}
                      onChange={(e) => {
                        setProductSearch((s) => ({ ...s, [item.id]: e.target.value }));
                        setActiveProductDropdown(item.id);
                      }}
                      onFocus={() => {
                        setProductSearch((s) => ({ ...s, [item.id]: s[item.id] ?? item.name }));
                        setActiveProductDropdown(item.id);
                      }}
                      style={{ paddingLeft: 34 }}
                    />
                  </div>
                  {activeProductDropdown === item.id && (
                    <div style={dropdownStyle}>
                      {getFilteredProducts(item.id).map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSelectProduct(item.id, p.id)}
                          style={{
                            width: "100%",
                            border: "none",
                            borderBottom: "1px solid var(--border)",
                            background: p.id === item.productId ? "var(--primary-light)" : "transparent",
                            color: "var(--on-surface)",
                            padding: "9px 10px",
                            textAlign: "left",
                            cursor: "pointer",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                            <span style={{ fontWeight: 800, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                            <span style={{ fontWeight: 800, color: "var(--primary)", fontSize: 12, flexShrink: 0 }}>৳{p.price}</span>
                          </div>
                          {p.sku && (
                            <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>
                              SKU: {p.sku}
                            </div>
                          )}
                        </button>
                      ))}
                      {getFilteredProducts(item.id).length === 0 && (
                        <div style={{ padding: 10, color: "var(--text-secondary)", fontSize: 12 }}>
                          No matching products
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              <div className="form-group" style={{ marginBottom: "8px" }}>
                <input type="text" placeholder="Item name" value={item.name}
                  onChange={(e) => updateItem(item.id, "name", e.target.value)} />
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "10px", display: "block", marginBottom: "2px" }}>Qty</label>
                  <input type="number" value={item.qty} min="1"
                    onChange={(e) => updateItem(item.id, "qty", parseFloat(e.target.value) || 1)} />
                </div>
                <div style={{ flex: 1.5 }}>
                  <label style={{ fontSize: "10px", display: "block", marginBottom: "2px" }}>Price (৳)</label>
                  <input type="number" value={item.price}
                    onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)} />
                </div>
                <div style={{ flex: 1.5 }}>
                  <label style={{ fontSize: "10px", display: "block", marginBottom: "2px", color: "var(--primary)" }}>Dis. (৳)</label>
                  <input type="number" value={item.discount || ""} placeholder="0"
                    onChange={(e) => updateItem(item.id, "discount", parseFloat(e.target.value) || 0)} />
                </div>
                <button type="button" onClick={() => removeItem(item.id)}
                  style={{ background: "none", border: "none", color: "var(--error)", padding: "20px 0 0 4px", cursor: "pointer" }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Man */}
        <div className="form-group" style={{ marginBottom: "14px" }}>
          <label>Delivery Man Name</label>
          <input type="text" placeholder="Name or agency" value={deliveryMan}
            onChange={(e) => setDeliveryMan(e.target.value)} />
        </div>

        {/* Discount & Delivery */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Del. Charge (৳)</label>
            <input type="number" value={deliveryCharge} min="0"
              onChange={(e) => setDeliveryCharge(parseFloat(e.target.value) || 0)} />
          </div>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Total Dis. (৳)</label>
            <input type="number" value={discount} min="0"
              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} />
          </div>
        </div>

        {/* Totals */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
            <span>Subtotal</span><span>৳{subtotal.toFixed(2)}</span>
          </div>
          {deliveryCharge > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
              <span>Delivery Charge</span><span>+৳{deliveryCharge.toFixed(2)}</span>
            </div>
          )}
          {discount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px", color: "#16a34a" }}>
              <span>Invoice Discount</span><span>−৳{discount.toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "18px", color: "var(--primary)", marginTop: "8px" }}>
            <span>Total</span><span>৳{total.toFixed(2)}</span>
          </div>
        </div>

        <button onClick={handleSave} className="btn-primary"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <Save size={18} /> Create Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoiceEntry;
