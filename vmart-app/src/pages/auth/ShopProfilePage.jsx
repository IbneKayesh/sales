import { useState, useEffect } from "react";
import {
  FiUser,
  FiPackage,
  FiFileText,
  FiDollarSign,
  FiBox,
  FiUsers,
  FiGrid,
  FiEdit2,
  FiCheck,
  FiX,
  FiLock,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";
import PasswordChangeSection from "../../components/PasswordChangeSection";
import "./ShopProfilePage.css";

export default function ShopProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateProfile, hasPassword, changePassword } = useAuth();
  const { showToast, setBusy, isBusy } = useUI();
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
    setEditForm({ name: user?.name || "", shopName: user?.shopName || "", contact: user?.contact || "", address: user?.address || "" });
    setEditing(true);
  };
  const cancelEditing = () => setEditing(false);

  const saveProfile = () => {
    if (!editForm.name.trim() || !editForm.shopName.trim()) return;
    setBusy(true);
    const oldShopName = shopName;
    const newShopName = editForm.shopName.trim();

    updateProfile({ name: editForm.name.trim(), shopName: newShopName, contact: editForm.contact.trim(), address: editForm.address.trim() });

    const shops = load(KEYS.SHOPS);
    const shopIdx = shops.findIndex((s) => s.name === oldShopName);
    if (shopIdx !== -1) {
      shops[shopIdx] = { ...shops[shopIdx], name: newShopName, contact: editForm.contact.trim(), address: editForm.address.trim() };
      save(KEYS.SHOPS, shops);
      const allProducts = load(KEYS.PRODUCTS);
      save(KEYS.PRODUCTS, allProducts.map((p) => (p.shop === oldShopName ? { ...p, shop: newShopName } : p)));
      const allOrders = load(KEYS.ORDERS);
      save(KEYS.ORDERS, allOrders.map((o) => (o.shop === oldShopName ? { ...o, shop: newShopName } : o)));
      const allInvoices = load(KEYS.INVOICES);
      save(KEYS.INVOICES, allInvoices.map((inv) => (inv.shop === oldShopName ? { ...inv, shop: newShopName } : inv)));
    }
    setEditing(false);
    showToast("Profile updated successfully");
    setBusy(false);
  };

  const totalDue = invoices.filter((inv) => inv.paymentStatus !== "paid").reduce((s, inv) => {
    const paid = inv.paymentStatus === "partial_paid" ? inv.paidAmount || 0 : 0;
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
        <div className="shoppro-header-actions">
          {!editing && (
            <button className="ui-badge shoppro-edit-btn" onClick={startEditing} aria-label="Edit profile"><FiEdit2 /></button>
          )}
          <div className="ui-badge"><FiGrid /></div>
        </div>
      </div>

      {/* Profile card */}
      <div className="ui-card">
        {editing ? (
          <div className="shoppro-edit-form">
            <div className="shoppro-edit-header">
              <div className="shoppro-edit-avatar">🏪</div>
              <h3 className="ui-card-title shoppro-edit-title">Edit Profile</h3>
            </div>
            <div className="ui-form-field">
              <label className="ui-form-label" htmlFor="shop-profile-name">Your Name</label>
              <input type="text" id="shop-profile-name" name="shop-profile-name" className="ui-input"
                value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="ui-form-field">
              <label className="ui-form-label" htmlFor="shop-profile-shop-name">Shop Name</label>
              <input type="text" id="shop-profile-shop-name" name="shop-profile-shop-name" className="ui-input"
                value={editForm.shopName} onChange={(e) => setEditForm((p) => ({ ...p, shopName: e.target.value }))} />
            </div>
            <div className="ui-form-field">
              <label className="ui-form-label" htmlFor="shop-profile-contact">Contact</label>
              <input type="tel" id="shop-profile-contact" name="shop-profile-contact" className="ui-input" placeholder="Phone number"
                value={editForm.contact} onChange={(e) => setEditForm((p) => ({ ...p, contact: e.target.value }))} />
            </div>
            <div className="ui-form-field">
              <label className="ui-form-label" htmlFor="shop-profile-address">Address</label>
              <textarea id="shop-profile-address" name="shop-profile-address" className="ui-textarea" rows={2}
                value={editForm.address} onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))} />
            </div>
            <div className="shoppro-actions-row">
              <button className="ui-btn ui-btn-primary shoppro-btn-flex" onClick={saveProfile}
                disabled={!editForm.name.trim() || !editForm.shopName.trim() || isBusy}><FiCheck /> Save</button>
              <button className="ui-btn ui-btn-secondary" onClick={cancelEditing}><FiX /> Cancel</button>
            </div>
          </div>
        ) : (
          <div className="shoppro-view-row">
            <div className="shoppro-view-avatar">🏪</div>
            <div className="shoppro-view-info">
              <h3 className="ui-card-title shoppro-view-name">{shopName}</h3>
              <p className="shoppro-view-role">Shop Owner / Vendor</p>
              {user?.contact && <p className="shoppro-view-detail">📞 {user.contact}</p>}
              {user?.address && <p className="shoppro-view-detail">📍 {user.address}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Summary stats */}
      <div className="shoppro-stats-grid">
        <div className="ui-card shoppro-stat-card shoppro-stat-card--accent-bg">
          <div className="shoppro-stat-value shoppro-stat-value--accent">{orders.length}</div>
          <div className="shoppro-stat-label">Total Orders</div>
        </div>
        <div className={`ui-card shoppro-stat-card${pendingOrders > 0 ? " shoppro-stat-card--error-bg" : " shoppro-stat-card--accent-bg"}`}>
          <div className={`shoppro-stat-value${pendingOrders > 0 ? " shoppro-stat-value--error" : " shoppro-stat-value--accent"}`}>
            {pendingOrders}
          </div>
          <div className="shoppro-stat-label">Pending Orders</div>
        </div>
        <div className="ui-card shoppro-stat-card">
          <div className="shoppro-stat-value shoppro-stat-value--default">{products.length}</div>
          <div className="shoppro-stat-label">Products</div>
        </div>
        <div className="ui-card shoppro-stat-card">
          <div className={`shoppro-stat-value${totalDue > 0 ? " shoppro-stat-value--error" : " shoppro-stat-value--green"}`}>
            ₹{totalDue.toFixed(2)}
          </div>
          <div className="shoppro-stat-label">Total Due</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="page-actions">
        <div className="ui-action-card" onClick={() => navigate("/products")}><span className="ui-action-card-icon">📦</span><h3 className="ui-action-card-title">Products ({products.length})</h3></div>
        <div className="ui-action-card" onClick={() => navigate("/order")}><span className="ui-action-card-icon">📋</span><h3 className="ui-action-card-title">Orders ({orders.length})</h3></div>
        <div className="ui-action-card" onClick={() => navigate("/customers")}><span className="ui-action-card-icon">👥</span><h3 className="ui-action-card-title">Customers</h3></div>
        <div className="ui-action-card" onClick={() => navigate("/invoice-collections")}><span className="ui-action-card-icon">💰</span><h3 className="ui-action-card-title">Collections</h3></div>
      </div>

      {/* Recent orders */}
      {orders.length > 0 && (
        <div className="ui-card">
          <h3 className="ui-card-title">Recent Orders for Your Shop</h3>
          <div className="shoppro-list-column">
            {[...orders].reverse().slice(0, 5).map((order) => (
              <div key={order.id} onClick={() => navigate("/order")} className="shoppro-list-item">
                <div className="shoppro-list-info">
                  <span className="shoppro-list-name">{order.customer?.name}</span>
                  <span className="shoppro-list-amount">₹{order.grandTotal?.toFixed(2)}</span>
                </div>
                <span className={`shoppro-status-badge ${order.status === "delivered" ? "shoppro-status-badge--success" : "shoppro-status-badge--neutral"}`}>
                  {order.status?.replace(/_/g, " ") || "pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {orders.length === 0 && (
        <p className="page-summary shoppro-empty-text">No orders for your shop yet. Make sure you have products listed!</p>
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
            prefix="shoppro"
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
            prefix="shoppro"
          />
        )}
      </div>

      <button className="ui-btn ui-btn-secondary shoppro-signout-btn" onClick={logout}>Sign Out</button>
    </section>
  );
}
