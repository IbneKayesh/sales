import { useState, useEffect } from "react";
import { FiUser, FiPackage, FiFileText, FiDollarSign, FiBox, FiUsers, FiGrid, FiEdit2, FiCheck, FiX, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";

export default function ShopProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateProfile, hasPassword, changePassword } = useAuth();
  const { showToast } = useUI();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", shopName: "", contact: "", address: "" });
  const [changePwOpen, setChangePwOpen] = useState(false);
  const [changeOldPw, setChangeOldPw] = useState("");
  const [changeNewPw, setChangeNewPw] = useState("");
  const [changeConfirmPw, setChangeConfirmPw] = useState("");
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const shopName = user?.shopName || user?.name || "";

  useEffect(() => {
    if (!shopName) return;
    const allOrders = load(KEYS.ORDERS);
    const allInvoices = load(KEYS.INVOICES);
    const allProducts = load(KEYS.PRODUCTS);

    setOrders(allOrders.filter((o) => o.shop === shopName));
    setInvoices(allInvoices.filter((inv) => inv.customer?.name && allOrders.some((o) => o.id === inv.linkedOrderId && o.shop === shopName)));
    setProducts(allProducts.filter((p) => p.shop === shopName));
    setCustomers(load(KEYS.CUSTOMERS));
  }, [shopName]);

  const startEditing = () => {
    setEditForm({
      name: user?.name || "",
      shopName: user?.shopName || "",
      contact: user?.contact || "",
      address: user?.address || "",
    });
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  const saveProfile = () => {
    if (!editForm.name.trim() || !editForm.shopName.trim()) return;
    const oldShopName = shopName;
    const newShopName = editForm.shopName.trim();

    /* Update auth */
    updateProfile({
      name: editForm.name.trim(),
      shopName: newShopName,
      contact: editForm.contact.trim(),
      address: editForm.address.trim(),
    });

    /* Sync shop record */
    const shops = load(KEYS.SHOPS);
    const shopIdx = shops.findIndex((s) => s.name === oldShopName);
    if (shopIdx !== -1) {
      shops[shopIdx] = {
        ...shops[shopIdx],
        name: newShopName,
        contact: editForm.contact.trim(),
        address: editForm.address.trim(),
      };
      save(KEYS.SHOPS, shops);

      /* Update shop name in products and orders */
      const allProducts = load(KEYS.PRODUCTS);
      const updatedProducts = allProducts.map((p) =>
        p.shop === oldShopName ? { ...p, shop: newShopName } : p
      );
      save(KEYS.PRODUCTS, updatedProducts);

      const allOrders = load(KEYS.ORDERS);
      const updatedOrders = allOrders.map((o) =>
        o.shop === oldShopName ? { ...o, shop: newShopName } : o
      );
      save(KEYS.ORDERS, updatedOrders);

      const allInvoices = load(KEYS.INVOICES);
      const updatedInvoices = allInvoices.map((inv) =>
        inv.shop === oldShopName ? { ...inv, shop: newShopName } : inv
      );
      save(KEYS.INVOICES, updatedInvoices);
    }

    setEditing(false);
    showToast("Profile updated successfully");
  };

  const totalDue = invoices
    .filter((inv) => inv.paymentStatus !== "paid")
    .reduce((s, inv) => {
      const paid = inv.paymentStatus === "partial_paid" ? (inv.paidAmount || 0) : 0;
      return s + (inv.grandTotal - paid);
    }, 0);

  const pendingOrders = orders.filter((o) => o.status !== "delivered").length;

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Shop Profile</p>
          <h1 className="page-heading">{shopName}</h1>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          {!editing && (
            <button className="ui-badge" onClick={startEditing} style={{ cursor: "pointer", border: "none" }} aria-label="Edit profile">
              <FiEdit2 />
            </button>
          )}
          <div className="ui-badge"><FiGrid /></div>
        </div>
      </div>

      {/* Profile card */}
      <div className="ui-card">
        {editing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-full)", background: "var(--accent-soft)", display: "grid", placeItems: "center", fontSize: "1.3rem" }}>🏪</div>
              <h3 className="ui-card-title" style={{ margin: 0 }}>Edit Profile</h3>
            </div>
            <div className="ui-form-field">
              <label className="ui-form-label" htmlFor="shop-profile-name">Your Name</label>
              <input type="text" id="shop-profile-name" name="shop-profile-name" className="ui-input" value={editForm.name}
                onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="ui-form-field">
              <label className="ui-form-label" htmlFor="shop-profile-shop-name">Shop Name</label>
              <input type="text" id="shop-profile-shop-name" name="shop-profile-shop-name" className="ui-input" value={editForm.shopName}
                onChange={(e) => setEditForm((p) => ({ ...p, shopName: e.target.value }))} />
            </div>
            <div className="ui-form-field">
              <label className="ui-form-label" htmlFor="shop-profile-contact">Contact</label>
              <input type="tel" id="shop-profile-contact" name="shop-profile-contact" className="ui-input" placeholder="Phone number" value={editForm.contact}
                onChange={(e) => setEditForm((p) => ({ ...p, contact: e.target.value }))} />
            </div>
            <div className="ui-form-field">
              <label className="ui-form-label" htmlFor="shop-profile-address">Address</label>
              <textarea id="shop-profile-address" name="shop-profile-address" className="ui-textarea" rows={2} value={editForm.address}
                onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))} />
            </div>
            <div style={{ display: "flex", gap: "var(--space-3)" }}>
              <button className="ui-btn ui-btn-primary" onClick={saveProfile} disabled={!editForm.name.trim() || !editForm.shopName.trim()} style={{ flex: 1 }}>
                <FiCheck /> Save
              </button>
              <button className="ui-btn ui-btn-secondary" onClick={cancelEditing}>
                <FiX /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
            <div style={{ width: 56, height: 56, borderRadius: "var(--radius-full)", background: "var(--accent-soft)", display: "grid", placeItems: "center", fontSize: "1.5rem" }}>🏪</div>
            <div style={{ flex: 1 }}>
              <h3 className="ui-card-title" style={{ margin: 0, fontSize: "1.1rem" }}>{shopName}</h3>
              <p style={{ margin: "var(--space-1) 0 0", fontSize: "0.8rem", color: "var(--accent)", fontWeight: 500 }}>Shop Owner / Vendor</p>
              {user?.contact && <p style={{ margin: "var(--space-1) 0 0", fontSize: "0.85rem", color: "var(--text-subtle)" }}>📞 {user.contact}</p>}
              {user?.address && <p style={{ margin: "var(--space-1) 0 0", fontSize: "0.85rem", color: "var(--text-subtle)" }}>📍 {user.address}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
        <div className="ui-card" style={{ textAlign: "center", padding: "var(--space-4)", background: "var(--accent-soft)" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--accent)" }}>{orders.length}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text)", marginTop: "var(--space-1)" }}>Total Orders</div>
        </div>
        <div className="ui-card" style={{ textAlign: "center", padding: "var(--space-4)", background: pendingOrders > 0 ? "var(--error-bg)" : "var(--accent-soft)" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: pendingOrders > 0 ? "var(--error)" : "var(--accent)" }}>{pendingOrders}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text)", marginTop: "var(--space-1)" }}>Pending Orders</div>
        </div>
        <div className="ui-card" style={{ textAlign: "center", padding: "var(--space-4)" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-h)" }}>{products.length}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text)", marginTop: "var(--space-1)" }}>Products</div>
        </div>
        <div className="ui-card" style={{ textAlign: "center", padding: "var(--space-4)" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: totalDue > 0 ? "var(--error)" : "green" }}>
            ₹{totalDue.toFixed(2)}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text)", marginTop: "var(--space-1)" }}>Total Due</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="page-actions">
        <div className="ui-action-card" onClick={() => navigate("/products")} style={{ cursor: "pointer" }}>
          <span className="ui-action-card-icon">📦</span>
          <h3 className="ui-action-card-title">Products ({products.length})</h3>
        </div>
        <div className="ui-action-card" onClick={() => navigate("/order")} style={{ cursor: "pointer" }}>
          <span className="ui-action-card-icon">📋</span>
          <h3 className="ui-action-card-title">Orders ({orders.length})</h3>
        </div>
        <div className="ui-action-card" onClick={() => navigate("/customers")} style={{ cursor: "pointer" }}>
          <span className="ui-action-card-icon">👥</span>
          <h3 className="ui-action-card-title">Customers</h3>
        </div>
        <div className="ui-action-card" onClick={() => navigate("/invoice-collections")} style={{ cursor: "pointer" }}>
          <span className="ui-action-card-icon">💰</span>
          <h3 className="ui-action-card-title">Collections</h3>
        </div>
      </div>

      {/* Recent orders */}
      {orders.length > 0 && (
        <div className="ui-card">
          <h3 className="ui-card-title">Recent Orders for Your Shop</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {[...orders].reverse().slice(0, 5).map((order) => (
              <div key={order.id} onClick={() => navigate("/order")}
                style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", cursor: "pointer" }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600, color: "var(--text-h)", fontSize: "0.9rem" }}>{order.customer?.name}</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-subtle)", marginLeft: "var(--space-2)" }}>
                    ₹{order.grandTotal?.toFixed(2)}
                  </span>
                </div>
                <span style={{ fontSize: "0.7rem", color: "#fff", background: order.status === "delivered" ? "var(--accent-primary)" : "var(--text-subtle)", padding: "1px 8px", borderRadius: "var(--radius-full)" }}>
                  {order.status?.replace(/_/g, " ") || "pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {orders.length === 0 && (
        <p className="page-summary" style={{ textAlign: "center", padding: "var(--space-7) 0" }}>
          No orders for your shop yet. Make sure you have products listed!
        </p>
      )}

      {/* Change Password */}
      <div className="ui-card" style={{ padding: changePwOpen ? "var(--space-4)" : "var(--space-3)" }}>
        {changePwOpen ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-1)" }}>
              <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "var(--accent-soft)", display: "grid", placeItems: "center", fontSize: "1.1rem" }}>🔑</div>
              <h3 className="ui-card-title" style={{ margin: 0, fontSize: "0.95rem" }}>Change Password</h3>
            </div>
            {user?.password && (
              <div className="ui-form-field" style={{ margin: 0 }}>
                <label className="ui-form-label" htmlFor="shop-profile-old-pw">Current Password</label>
                <input type="password" id="shop-profile-old-pw" name="shop-profile-old-pw" className="ui-input" placeholder="Enter current password"
                  value={changeOldPw} onChange={(e) => setChangeOldPw(e.target.value)} />
              </div>
            )}
            <div className="ui-form-field" style={{ margin: 0 }}>
              <label className="ui-form-label" htmlFor="shop-profile-new-pw">New Password</label>
              <input type="password" id="shop-profile-new-pw" name="shop-profile-new-pw" className="ui-input" placeholder="Enter new password (min 4 chars)"
                value={changeNewPw} onChange={(e) => setChangeNewPw(e.target.value)} />
            </div>
            <div className="ui-form-field" style={{ margin: 0 }}>
              <label className="ui-form-label" htmlFor="shop-profile-confirm-pw">Confirm New Password</label>
              <input type="password" id="shop-profile-confirm-pw" name="shop-profile-confirm-pw" className="ui-input" placeholder="Confirm new password"
                value={changeConfirmPw} onChange={(e) => setChangeConfirmPw(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "var(--space-3)" }}>
              <button className="ui-btn ui-btn-primary" onClick={async () => {
                if (!changeNewPw.trim() || changeNewPw !== changeConfirmPw) {
                  showToast("Passwords do not match", "error");
                  return;
                }
                if (changeNewPw.length < 4) {
                  showToast("Password must be at least 4 characters", "error");
                  return;
                }
                try {
                  await changePassword(changeOldPw, changeNewPw);
                  showToast("Password changed successfully");
                  setChangePwOpen(false);
                  setChangeOldPw(""); setChangeNewPw(""); setChangeConfirmPw("");
                } catch (err) {
                  showToast(err.message, "error");
                }
              }} disabled={!changeNewPw.trim() || changeNewPw !== changeConfirmPw} style={{ flex: 1, fontSize: "0.85rem" }}>
                Update Password
              </button>
              <button className="ui-btn ui-btn-secondary" onClick={() => { setChangePwOpen(false); setChangeOldPw(""); setChangeNewPw(""); setChangeConfirmPw(""); }} style={{ fontSize: "0.85rem" }}>
                <FiX /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", cursor: "pointer" }} onClick={() => setChangePwOpen(true)}>
            <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "var(--accent-soft)", display: "grid", placeItems: "center", fontSize: "1.1rem" }}>
              <FiLock />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-h)" }}>Password</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>{user?.password ? "Change your account password" : "Set a password for your account"}</div>
            </div>
          </div>
        )}
      </div>

      <button className="ui-btn ui-btn-secondary" onClick={logout}
        style={{ width: "100%", padding: "var(--space-4)", color: "var(--error)" }}>
        Sign Out
      </button>
    </section>
  );
}
