import React, { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const orders = [
  {
    id: "ORD-8821",
    customer: "John Smith",
    date: "20/02/2026",
    items: 4,
    total: 450.0,
    status: "New",
    color: "var(--primary)",
  },
  {
    id: "ORD-8820",
    customer: "Sarah Miller",
    date: "19/02/2026",
    items: 2,
    total: 120.5,
    status: "Processing",
    color: "#F97316",
  },
  {
    id: "ORD-8819",
    customer: "Tech Solutions",
    date: "19/02/2026",
    items: 12,
    total: 2400.0,
    status: "Delivered",
    color: "#22C55E",
  },
  {
    id: "ORD-8818",
    customer: "Robert Brown",
    date: "18/02/2026",
    items: 1,
    total: 85.0,
    status: "Cancelled",
    color: "#EF4444",
  },
  {
    id: "ORD-8817",
    customer: "City Supplies",
    date: "18/02/2026",
    items: 6,
    total: 890.0,
    status: "Delivered",
    color: "#22C55E",
  },
];

const OrderList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const getStatusIcon = (status) => {
    switch (status) {
      case "New":
        return <Clock size={14} />;
      case "Processing":
        return <Package size={14} />;
      case "Delivered":
        return <CheckCircle size={14} />;
      case "Cancelled":
        return <Truck size={14} />; // Truck for cancelled is odd, but using as placeholder
      default:
        return <Clock size={14} />;
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="app-container">
      {/* Search & Filter Header */}
      <div
        style={{
          padding: "12px 16px",
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          sticky: "top",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={18}
              color="var(--text-secondary)"
              style={{ position: "absolute", left: "12px", top: "10px" }}
            />
            <input
              type="text"
              placeholder="Search order # or customer..."
              style={{ paddingLeft: "40px", marginBottom: 0 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--background)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--on-background)",
            }}
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div style={{ padding: "8px" }}>
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="card"
            style={{
              padding: "12px",
              marginBottom: "8px",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span
                    style={{
                      fontWeight: 800,
                      color: "var(--on-surface)",
                      fontSize: "15px",
                    }}
                  >
                    {order.id}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "8px",
                      background: `${order.color}15`,
                      color: order.color,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--on-surface)",
                    marginTop: "4px",
                  }}
                >
                  {order.customer}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    marginTop: "2px",
                  }}
                >
                  {order.date} • {order.items} Items
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 800,
                    color: "var(--on-surface)",
                  }}
                >
                  ${order.total.toFixed(2)}
                </div>
                <button
                  onClick={() => console.log("View Order", order.id)}
                  style={{
                    marginTop: "8px",
                    background: "none",
                    border: "none",
                    color: "var(--primary)",
                    fontWeight: 600,
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    padding: 0,
                  }}
                >
                  View Details <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
