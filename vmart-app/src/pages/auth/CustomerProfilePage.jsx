import { useState, useEffect } from "react";
import {
  FiUser,
  FiPackage,
  FiFileText,
  FiShoppingCart,
  FiEdit2,
  FiCheck,
  FiX,
  FiLock,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { load, KEYS } from "../../utils/storage";
import { formatDate } from "../../utils/helpers";
import PasswordChangeSection from "../../components/PasswordChangeSection";
import "./CustomerProfilePage.css";

export default function CustomerProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateProfile, hasPassword, changePassword } = useAuth();
  const { showToast, setBusy, isBusy } = useUI();
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
    if (user?.name) {
      setOrders(allOrders.filter((o) => o.customer?.name === user.name));
      setInvoices(allInvoices.filter((inv) => inv.customer?.name === user.name));
    }
    setCart(load(KEYS.CART));
  }, [user]);

  const startEditing = () => {
    setEditForm({ name: user?.name || "", contact: user?.contact || "", address: user?.address || "" });
    setEditing(true);
  };
  const cancelEditing = () => setEditing(false);

  const saveProfile = () => {
    if (!editForm.name.trim()) return;
    setBusy(true);
    updateProfile({ name: editForm.name.trim(), contact: editForm.contact.trim(), address: editForm.address.trim() });
    setEditing(false);
    showToast("Profile updated successfully");
    setBusy(false);
  };

  const cartCount = cart.reduce((s, p) => s + p.qty, 0);

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Profile</p>
          <h1 className="page-heading">{user?.name || "Customer"}</h1>
        </div>
        <div className="profile-header-actions">
          {!editing && (
            <button className="ui-badge profile-edit-btn" onClick={startEditing} aria-label="Edit profile"><FiEdit2 /></button>
          )}
          <div className="ui-badge"><FiUser /></div>
        </div>
      </div>

      {/* Profile card */}
      <div className="ui-card">
        {editing ? (
          <div className="profile-edit-form">
            <div className="profile-edit-header">
              <div className="profile-avatar-sm">👤</div>
              <h3 className="ui-card-title profile-edit-title">Edit Profile</h3>
            </div>
            <div className="ui-form-field">
              <label className="ui-form-label" htmlFor="customer-profile-name">Name</label>
              <input type="text" id="customer-profile-name" name="customer-profile-name" className="ui-input"
                value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="ui-form-field">
              <label className="ui-form-label" htmlFor="customer-profile-contact">Contact</label>
              <input type="tel" id="customer-profile-contact" name="customer-profile-contact" className="ui-input"
                placeholder="Phone number" value={editForm.contact}
                onChange={(e) => setEditForm((p) => ({ ...p, contact: e.target.value }))} />
            </div>
            <div className="ui-form-field">
              <label className="ui-form-label" htmlFor="customer-profile-address">Address</label>
              <textarea id="customer-profile-address" name="customer-profile-address" className="ui-textarea" rows={2}
                value={editForm.address} onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))} />
            </div>
            <div className="profile-edit-actions">
              <button className="ui-btn ui-btn-primary profile-edit-btn-primary" onClick={saveProfile} disabled={!editForm.name.trim() || isBusy}>
                <FiCheck /> Save
              </button>
              <button className="ui-btn ui-btn-secondary" onClick={cancelEditing}><FiX /> Cancel</button>
            </div>
          </div>
        ) : (
          <div className="profile-view-row">
            <div className="profile-avatar">👤</div>
            <div className="profile-info">
              <h3 className="ui-card-title profile-name">{user?.name}</h3>
              <p className="profile-role">Customer</p>
              {user?.contact && <p className="profile-detail">📞 {user.contact}</p>}
              {user?.address && <p className="profile-detail">📍 {user.address}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="page-actions">
        <div className="ui-action-card" onClick={() => navigate("/shopping")}><span className="ui-action-card-icon">🛍️</span><h3 className="ui-action-card-title">Shop</h3></div>
        <div className="ui-action-card" onClick={() => navigate("/cart")}><span className="ui-action-card-icon">🛒</span><h3 className="ui-action-card-title">Cart ({cartCount})</h3></div>
        <div className="ui-action-card" onClick={() => navigate("/order")}><span className="ui-action-card-icon">📦</span><h3 className="ui-action-card-title">Orders ({orders.length})</h3></div>
        <div className="ui-action-card" onClick={() => navigate("/invoice")}><span className="ui-action-card-icon">🧾</span><h3 className="ui-action-card-title">Invoices ({invoices.length})</h3></div>
      </div>

      {/* Recent orders */}
      {orders.length > 0 && (
        <div className="ui-card">
          <h3 className="ui-card-title">Recent Orders</h3>
          <div className="profile-list-column">
            {[...orders].reverse().slice(0, 5).map((order) => (
              <div key={order.id} className="profile-list-item" onClick={() => navigate("/order")}>
                <div className="profile-list-icon"><FiPackage size={16} /></div>
                <div className="profile-list-info">
                  <div className="profile-list-title">{order.products.length} item(s) · ₹{order.grandTotal?.toFixed(2)}</div>
                  <div className="profile-list-subtitle">{order.shop && <>🏪 {order.shop} · </>}{formatDate(order.createdAt)}</div>
                </div>
                <span className={`profile-status-badge ${order.status === "delivered" ? "profile-status-badge--success" : "profile-status-badge--neutral"}`}>
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
          <div className="profile-list-column">
            {[...invoices].reverse().slice(0, 5).map((inv) => (
              <div key={inv.id} className="profile-list-item" onClick={() => navigate("/invoice")}>
                <div className="profile-list-icon"><FiFileText size={16} /></div>
                <div className="profile-list-info">
                  <div className="profile-list-title">{inv.invoiceNumber || "INV"} · ₹{inv.grandTotal?.toFixed(2)}</div>
                  <div className="profile-list-subtitle">{formatDate(inv.createdAt)}</div>
                </div>
                <span className={`profile-payment-badge ${inv.paymentStatus === "paid" ? "profile-payment-badge--paid" : inv.paymentStatus === "partial_paid" ? "profile-payment-badge--partial" : "profile-payment-badge--due"}`}>
                  {inv.paymentStatus?.replace(/_/g, " ") || "due"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {orders.length === 0 && invoices.length === 0 && (
        <p className="page-summary profile-empty-text">No orders yet. Start browsing products from our shops!</p>
      )}

      {/* Change Password */}
      <div className="ui-card">
        {changePwOpen ? (
          <PasswordChangeSection
            isOpen={true}
            onToggle={() => setChangePwOpen(false)}
            user={user}
            changeOldPw={changeOldPw}
            setChangeOldPw={setChangeOldPw}
            changeNewPw={changeNewPw}
            setChangeNewPw={setChangeNewPw}
            changeConfirmPw={changeConfirmPw}
            setChangeConfirmPw={setChangeConfirmPw}
            changePassword={changePassword}
            prefix="profile"
          />
        ) : (
          <PasswordChangeSection
            isOpen={false}
            onToggle={() => { setChangePwOpen(true); setChangeOldPw(""); setChangeNewPw(""); setChangeConfirmPw(""); }}
            user={user}
            changeOldPw={changeOldPw}
            setChangeOldPw={setChangeOldPw}
            changeNewPw={changeNewPw}
            setChangeNewPw={setChangeNewPw}
            changeConfirmPw={changeConfirmPw}
            setChangeConfirmPw={setChangeConfirmPw}
            changePassword={changePassword}
            prefix="profile"
          />
        )}
      </div>

      <button className="ui-btn ui-btn-secondary profile-signout-btn" onClick={logout}>Sign Out</button>
    </section>
  );
}
