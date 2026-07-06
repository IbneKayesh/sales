import { useState, useEffect } from "react";
import { FiUser, FiPackage, FiFileText, FiShoppingCart, FiEdit2, FiCheck, FiX, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { load, KEYS } from "../../utils/storage";

export default function CustomerProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateProfile, hasPassword, changePassword } = useAuth();
  const { showToast } = useUI();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", contact: "", address: "" });
  const [changePwOpen, setChangePwOpen] = useState(false);
  const [changeOldPw, setChangeOldPw] = useState("");
  const [changeNewPw, setChangeNewPw] = useState("");
  const [changeConfirmPw, setChangeConfirmPw] = useState("");
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const allOrders = load(KEYS.ORDERS);
    const allInvoices = load(KEYS.INVOICES);
    const cartData = load(KEYS.CART);

    /* Filter orders for this customer */
    if (user?.name) {
      setOrders(allOrders.filter((o) => o.customer?.name === user.name));
      setInvoices(allInvoices.filter((inv) => inv.customer?.name === user.name));
    }
    setCart(cartData);
  }, [user]);

  const startEditing = () => {
    setEditForm({
      name: user?.name || "",
      contact: user?.contact || "",
      address: user?.address || "",
    });
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  const saveProfile = () => {
    if (!editForm.name.trim()) return;
    updateProfile({
      name: editForm.name.trim(),
      contact: editForm.contact.trim(),
      address: editForm.address.trim(),
    });
    setEditing(false);
    showToast("Profile updated successfully");
  };

  const cartCount = cart.reduce((s, p) => s + p.qty, 0);
  const formatDate = (iso) => {
    try { return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
    catch { return ""; }
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Profile</p>
          <h1 className="page-heading">{user?.name || "Customer"}</h1>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          {!editing && (
            <button className="ui-badge" onClick={startEditing} style={{ cursor: "pointer", border: "none" }} aria-label="Edit profile">
              <FiEdit2 />
            </button>
          )}
          <div className="ui-badge"><FiUser /></div>
        </div>
      </div>

      {/* Profile card */}
      <div className="ui-card">
        {editing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-full)", background: "var(--accent-soft)", display: "grid", placeItems: "center", fontSize: "1.3rem" }}>👤</div>
              <h3 className="ui-card-title" style={{ margin: 0 }}>Edit Profile</h3>
            </div>
            <div className="ui-form-field">
              <label className="ui-form-label" htmlFor="customer-profile-name">Name</label>
              <input type="text" id="customer-profile-name" name="customer-profile-name" className="ui-input" value={editForm.name}
                onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="ui-form-field">
              <label className="ui-form-label" htmlFor="customer-profile-contact">Contact</label>
              <input type="tel" id="customer-profile-contact" name="customer-profile-contact" className="ui-input" placeholder="Phone number" value={editForm.contact}
                onChange={(e) => setEditForm((p) => ({ ...p, contact: e.target.value }))} />
            </div>
            <div className="ui-form-field">
              <label className="ui-form-label" htmlFor="customer-profile-address">Address</label>
              <textarea id="customer-profile-address" name="customer-profile-address" className="ui-textarea" rows={2} value={editForm.address}
                onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))} />
            </div>
            <div style={{ display: "flex", gap: "var(--space-3)" }}>
              <button className="ui-btn ui-btn-primary" onClick={saveProfile} disabled={!editForm.name.trim()} style={{ flex: 1 }}>
                <FiCheck /> Save
              </button>
              <button className="ui-btn ui-btn-secondary" onClick={cancelEditing}>
                <FiX /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
            <div style={{ width: 56, height: 56, borderRadius: "var(--radius-full)", background: "var(--accent-soft)", display: "grid", placeItems: "center", fontSize: "1.5rem" }}>👤</div>
            <div style={{ flex: 1 }}>
              <h3 className="ui-card-title" style={{ margin: 0, fontSize: "1.1rem" }}>{user?.name}</h3>
              <p style={{ margin: "var(--space-1) 0 0", fontSize: "0.8rem", color: "var(--accent)", fontWeight: 500 }}>Customer</p>
              {user?.contact && <p style={{ margin: "var(--space-1) 0 0", fontSize: "0.85rem", color: "var(--text-subtle)" }}>📞 {user.contact}</p>}
              {user?.address && <p style={{ margin: "var(--space-1) 0 0", fontSize: "0.85rem", color: "var(--text-subtle)" }}>📍 {user.address}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="page-actions">
        <div className="ui-action-card" onClick={() => navigate("/shopping")} style={{ cursor: "pointer" }}>
          <span className="ui-action-card-icon">🛍️</span>
          <h3 className="ui-action-card-title">Shop</h3>
        </div>
        <div className="ui-action-card" onClick={() => navigate("/cart")} style={{ cursor: "pointer" }}>
          <span className="ui-action-card-icon">🛒</span>
          <h3 className="ui-action-card-title">Cart ({cartCount})</h3>
        </div>
        <div className="ui-action-card" onClick={() => navigate("/order")} style={{ cursor: "pointer" }}>
          <span className="ui-action-card-icon">📦</span>
          <h3 className="ui-action-card-title">Orders ({orders.length})</h3>
        </div>
        <div className="ui-action-card" onClick={() => navigate("/invoice")} style={{ cursor: "pointer" }}>
          <span className="ui-action-card-icon">🧾</span>
          <h3 className="ui-action-card-title">Invoices ({invoices.length})</h3>
        </div>
      </div>

      {/* Recent orders */}
      {orders.length > 0 && (
        <div className="ui-card">
          <h3 className="ui-card-title">Recent Orders</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {[...orders].reverse().slice(0, 5).map((order) => (
              <div key={order.id}
                style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", cursor: "pointer" }}
                onClick={() => navigate("/order")}>
                <div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", background: "var(--accent-soft)", display: "grid", placeItems: "center" }}>
                  <FiPackage size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: "var(--text-h)", fontSize: "0.9rem" }}>
                    {order.products.length} item(s) · ₹{order.grandTotal?.toFixed(2)}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)", marginTop: "var(--space-1)" }}>
                    {order.shop && <>🏪 {order.shop} · </>}{formatDate(order.createdAt)}
                  </div>
                </div>
                <span style={{ fontSize: "0.7rem", color: "#fff", background: order.status === "delivered" ? "var(--accent-primary)" : "var(--text-subtle)", padding: "1px 8px", borderRadius: "var(--radius-full)" }}>
                  {order.status?.replace(/_/g, " ") || "pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent invoices */}
      {invoices.length > 0 && (
        <div className="ui-card">
          <h3 className="ui-card-title">Recent Invoices</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {[...invoices].reverse().slice(0, 5).map((inv) => (
              <div key={inv.id}
                style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", cursor: "pointer" }}
                onClick={() => navigate("/invoice")}>
                <div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", background: "var(--accent-soft)", display: "grid", placeItems: "center" }}>
                  <FiFileText size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: "var(--text-h)", fontSize: "0.9rem" }}>
                    {inv.invoiceNumber || "INV"} · ₹{inv.grandTotal?.toFixed(2)}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)", marginTop: "var(--space-1)" }}>
                    {formatDate(inv.createdAt)}
                  </div>
                </div>
                <span style={{ fontSize: "0.7rem", color: "#fff", background: inv.paymentStatus === "paid" ? "green" : inv.paymentStatus === "partial_paid" ? "orange" : "var(--error)", padding: "1px 8px", borderRadius: "var(--radius-full)" }}>
                  {inv.paymentStatus?.replace(/_/g, " ") || "due"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {orders.length === 0 && invoices.length === 0 && (
        <p className="page-summary" style={{ textAlign: "center", padding: "var(--space-7) 0" }}>
          No orders yet. Start browsing products from our shops!
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
                <label className="ui-form-label" htmlFor="customer-profile-old-pw">Current Password</label>
                <input type="password" id="customer-profile-old-pw" name="customer-profile-old-pw" className="ui-input" placeholder="Enter current password"
                  value={changeOldPw} onChange={(e) => setChangeOldPw(e.target.value)} />
              </div>
            )}
            <div className="ui-form-field" style={{ margin: 0 }}>
              <label className="ui-form-label" htmlFor="customer-profile-new-pw">New Password</label>
              <input type="password" id="customer-profile-new-pw" name="customer-profile-new-pw" className="ui-input" placeholder="Enter new password (min 4 chars)"
                value={changeNewPw} onChange={(e) => setChangeNewPw(e.target.value)} />
            </div>
            <div className="ui-form-field" style={{ margin: 0 }}>
              <label className="ui-form-label" htmlFor="customer-profile-confirm-pw">Confirm New Password</label>
              <input type="password" id="customer-profile-confirm-pw" name="customer-profile-confirm-pw" className="ui-input" placeholder="Confirm new password"
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
