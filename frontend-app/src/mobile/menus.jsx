import React from "react";
import { Card } from "primereact/card";

const Menus = () => {
  const menuItems = [
    {
      id: 1,
      title: "Dashboard",
      icon: "pi pi-chart-bar",
      color: "#6366f1",
      description: "View your performance metrics",
    },
    {
      id: 2,
      title: "Settings",
      icon: "pi pi-cog",
      color: "#10b981",
      description: "Configure application preferences",
    },
    {
      id: 3,
      title: "Messages",
      icon: "pi pi-envelope",
      color: "#f59e0b",
      description: "Check your latest notifications",
    },
    {
      id: 4,
      title: "Profile",
      icon: "pi pi-user",
      color: "#ef4444",
      description: "Manage your account details",
    },
    {
      id: 5,
      title: "History",
      icon: "pi pi-history",
      color: "#8b5cf6",
      description: "Review previous activities",
    },
    {
      id: 6,
      title: "Help",
      icon: "pi pi-question-circle",
      color: "#64748b",
      description: "Get support and documentation",
    },
  ];

  return (
    <div className="menus-container">
      <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "#333" }}>
        Features Menu
      </h2>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.75rem" }}
      >
        {menuItems.map((item) => (
          <Card
            key={item.id}
            style={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
              cursor: "pointer",
            }}
            className="p-card-hover"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  backgroundColor: `${item.color}20`,
                  padding: "0.75rem",
                  borderRadius: "10px",
                }}
              >
                <i
                  className={item.icon}
                  style={{ color: item.color, fontSize: "1.2rem" }}
                ></i>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: "1rem", color: "#333" }}>
                  {item.title}
                </h3>
                <p
                  style={{
                    margin: "0.2rem 0 0 0",
                    fontSize: "0.8rem",
                    color: "#888",
                  }}
                >
                  {item.description}
                </p>
              </div>
              <i
                className="pi pi-chevron-right"
                style={{ color: "#ccc", fontSize: "0.8rem" }}
              ></i>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Menus;
