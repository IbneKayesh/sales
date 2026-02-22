import React from "react";
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageSquare,
  Star,
  ChevronRight,
  Calendar,
  ShoppingBag,
  CreditCard,
  MapPin,
  Clock,
  Edit,
} from "lucide-react";

const OutletViewComp = ({ outlet, handleBack, handleEdit }) => {
  if (!outlet) return <div>No outlet selected</div>;

  return (
    <div className="app-content">
      {/* Header with Back Button */}
      <div className="view-header">
        <button onClick={handleBack} className="header-btn-ghost">
          <ArrowLeft size={20} />
        </button>
        <span className="view-title">Outlet Details</span>
        <button onClick={handleEdit} className="header-btn-primary">
          <Edit size={18} />
          Edit
        </button>
      </div>

      {/* Profile Card */}
      <div className="profile-header-card">
        <div className="profile-info">
          <div className="avatar-large">{outlet.initials}</div>
          <div className="profile-name-section">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h1 style={{ fontSize: "20px" }}>{outlet.name}</h1>
              <div className="badge-chip status-pending">
                <Star size={12} fill="currentColor" /> {outlet.tag}
              </div>
            </div>
            <p className="item-sub-text">
              <Calendar size={14} /> Joined {outlet.joined}
            </p>
          </div>
        </div>

        <hr className="card-divider" />

        <div className="stats-grid">
          <div>
            <div className="label-small">Total Spent</div>
            <div className="stat-val">${outlet.stats.totalSpent}</div>
          </div>
          <div
            style={{
              borderLeft: "1px solid var(--border)",
              borderRight: "1px solid var(--border)",
            }}
          >
            <div className="label-small">Orders</div>
            <div className="stat-val">{outlet.stats.orders}</div>
          </div>
          <div>
            <div className="label-small">Outstanding</div>
            <div className="stat-val stat-val-error">
              ${outlet.stats.outstanding}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="actions-grid">
        <button className="action-btn">
          <Phone size={20} color="var(--primary)" />
          <span className="action-btn-label">Call</span>
        </button>
        <button className="action-btn">
          <MessageSquare size={20} color="#22C55E" />
          <span className="action-btn-label">WhatsApp</span>
        </button>
        <button className="action-btn">
          <Mail size={20} color="#3B82F6" />
          <span className="action-btn-label">Email</span>
        </button>
      </div>

      {/* Info Section */}
      <div style={{ padding: "0 16px 16px" }}>
        <div className="card">
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <MapPin size={16} color="var(--primary)" /> Contact Info
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div className="item-sub-text" style={{ fontSize: "13px" }}>
              <span style={{ fontWeight: 600 }}>Phone:</span> {outlet.phone}
            </div>
            <div className="item-sub-text" style={{ fontSize: "13px" }}>
              <span style={{ fontWeight: 600 }}>Email:</span> {outlet.email}
            </div>
            <div className="item-sub-text" style={{ fontSize: "13px" }}>
              <span style={{ fontWeight: 600 }}>Address:</span>
              <p style={{ margin: "2px 0 0", lineHeight: 1.4 }}>
                {outlet.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order History Section */}
      <div style={{ padding: "0 16px 16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <h3 style={{ fontWeight: 800 }}>Order History</h3>
          <span
            style={{
              fontSize: "12px",
              color: "var(--primary)",
              fontWeight: 700,
            }}
          >
            View All
          </span>
        </div>

        {outlet.history.map((order) => (
          <div
            key={order.id}
            className="card list-item-card"
            style={{ margin: "0 0 8px 0" }}
          >
            <div className="list-item-row">
              <div className="list-item-left">
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: "var(--background)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ShoppingBag size={18} color="var(--primary)" />
                </div>
                <div>
                  <div className="item-main-text" style={{ fontSize: "14px" }}>
                    {order.id}
                  </div>
                  <div className="item-sub-text">{order.date}</div>
                </div>
              </div>
              <div className="list-item-right">
                <div className="value-bold" style={{ fontSize: "15px" }}>
                  ${order.amount}
                </div>
                <div
                  className={`badge-chip ${order.status === "Delivered" ? "status-delivered" : "status-pending"}`}
                  style={{ marginTop: "4px" }}
                >
                  {order.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutletViewComp;
