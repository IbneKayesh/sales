import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Save, Mail, Phone, MapPin, Lock, ChevronRight, LogOut, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import "./ProfilePage.css";

const CustomerProfileStats = () => {
  const { orders, uniqueShopsVisited } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <div className="card profile-stats-card">
      {[
        { label: "Orders", value: String(orders.length), icon: "📦" },
        { label: "Shops", value: String(uniqueShopsVisited), icon: "🏪" },
        { label: "Wishlist", value: String(wishlistCount), icon: "❤️" },
      ].map(({ label, value, icon }) => (
        <div key={label} className="profile-stat-cell">
          <div className="profile-stat-icon">{icon}</div>
          <div className="profile-stat-val">{value}</div>
          <div className="profile-stat-label">{label}</div>
        </div>
      ))}
    </div>
  );
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    address: user?.address || "",
    altMobile: user?.altMobile || "",
  });

  const handleSave = () => {
    updateProfile({ name: form.name, address: form.address, altMobile: form.altMobile });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isCustomer = user?.role === "CUSTOMER";
  const initials = (user?.name || "U").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="app-container profile-page">
      <div className="profile-hero">
        <div className="profile-avatar">{initials}</div>
        <h2 className="profile-name">{user?.name || "User"}</h2>
        <span className="profile-role-badge">
          {user?.role === "SHOP" ? "🏪 Shop Owner" : "🛒 Customer"}
        </span>
      </div>

      <div className="profile-content">
        <div className="card profile-card">
          <div className="profile-card-header">
            <h3 className="profile-card-title">
              {isCustomer ? "Personal Information" : "Business Information"}
            </h3>
            <button type="button" onClick={isEditing ? handleSave : () => setIsEditing(true)} className="profile-edit-btn">
              {isEditing ? (<><Save size={14} /> Save</>) : (<><Edit2 size={14} /> Edit</>)}
            </button>
          </div>

          <div className="profile-field-group">
            <label className="profile-field-label">
              <Mail size={13} /> {isCustomer ? "Full Name" : "Owner Name"}
            </label>
            {isEditing ? (
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="profile-field-input" />
            ) : (
              <div className="profile-field-value">{user?.name}</div>
            )}
          </div>

          <div className="profile-field-group">
            <label className="profile-field-label"><MapPin size={13} /> Address</label>
            {isEditing ? (
              <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Your address" className="profile-field-input" />
            ) : (
              <div className={user?.address ? "profile-field-value" : "profile-field-value-placeholder"}>
                {user?.address || "Not set"}
              </div>
            )}
          </div>

          {isCustomer && (
            <div className="profile-field-group">
              <label className="profile-field-label"><Phone size={13} /> Alternative Mobile</label>
              {isEditing ? (
                <input type="text" value={form.altMobile} onChange={(e) => setForm({ ...form, altMobile: e.target.value })} placeholder="Another contact number" className="profile-field-input" />
              ) : (
                <div className={user?.altMobile ? "profile-field-value" : "profile-field-value-placeholder"}>
                  {user?.altMobile || "Not set"}
                </div>
              )}
            </div>
          )}

          {user?.mobile && (
            <div className="profile-readonly-row">
              <Phone size={13} color="var(--text-secondary)" />
              <span className="profile-readonly-text">{user.mobile} (Primary)</span>
            </div>
          )}
          {user?.email && (
            <div className="profile-readonly-row">
              <Mail size={13} color="var(--text-secondary)" />
              <span className="profile-readonly-text">{user.email}</span>
            </div>
          )}
        </div>

        {isCustomer && <CustomerProfileStats />}

        <div className="card profile-menu-card">
          {[
            ...(isCustomer ? [{ label: "Wishlist", icon: <Heart size={18} />, onClick: () => navigate("/customer/wishlist") }] : []),
            { label: "Change Password", icon: <Lock size={18} />, onClick: () => navigate("/profile/change-password") },
            { label: "Settings", icon: <ChevronRight size={18} />, onClick: () => navigate("/settings") },
          ].map(({ label, icon, onClick }) => (
            <div key={label} onClick={onClick} className="profile-menu-item" role="button" tabIndex={0}>
              <div className="profile-menu-item-left">
                <div className="profile-menu-icon">{icon}</div>
                <div className="profile-menu-label">{label}</div>
              </div>
              <ChevronRight size={18} color="var(--border)" />
            </div>
          ))}
        </div>

        <button type="button" onClick={handleLogout} className="profile-logout-btn">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
