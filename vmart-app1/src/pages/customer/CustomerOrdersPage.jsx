import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import StatusBadge from "@/components/ui/StatusBadge";
import FilterChipBar from "@/components/ui/FilterChipBar";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import "./CustomerOrdersPage.css";

const STATUS_OPTIONS = [
  { value: "ALL", label: "ALL" },
  { value: "DRAFT", label: "DRAFT" },
  { value: "PENDING", label: "PENDING" },
  { value: "DELIVERED", label: "DELIVERED" },
  { value: "PAID", label: "PAID" },
  { value: "COMPLETED", label: "COMPLETED" },
];

const CustomerOrdersPage = () => {
  const navigate = useNavigate();
  const { orders } = useCart();
  const [filter, setFilter] = useState("ALL");

  const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);
  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="page-container orders-page">
      <PageHeader title="My Orders" subtitle={`${orders.length} total order${orders.length !== 1 ? "s" : ""}`} />

      <div className="orders-filter-wrap">
        <FilterChipBar options={STATUS_OPTIONS} value={filter} onChange={setFilter} useStatusColors />
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No orders found"
          action={
            <button type="button" onClick={() => navigate("/")} className="btn-primary">
              Browse Products
            </button>
          }
        />
      ) : (
        sorted.map((order) => (
          <div
            key={order.id}
            className="card orders-card"
            onClick={() => navigate(`/customer/orders/${order.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigate(`/customer/orders/${order.id}`)}
          >
            <div className="orders-card-top">
              <div>
                <div className="orders-card-no">{order.orderNo}</div>
                <div className="orders-card-shop">{order.shopName}</div>
                <div className="orders-card-date">{order.date}</div>
              </div>
              <div className="orders-card-right">
                <div className="orders-card-total">৳{order.total}</div>
                <StatusBadge status={order.status} />
              </div>
            </div>
            <div className="orders-card-footer">
              <span>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
              <span className="orders-card-view-link">View →</span>
            </div>
          </div>
        ))
      )}

      <button type="button" onClick={() => navigate("/")} className="btn-fab" aria-label="Browse products">
        <Plus size={24} />
      </button>
    </div>
  );
};

export default CustomerOrdersPage;
