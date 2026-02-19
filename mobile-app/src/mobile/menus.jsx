import { Card } from "primereact/card";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Menus = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const menuCategories = [
    {
      title: "Main Features",
      items: [
        {
          id: "sales",
          title: "Sales",
          icon: "pi pi-shopping-bag",
          color: "#6366f1",
          path: "/home/sales",
        },
        {
          id: "purchase",
          title: "Purchase",
          icon: "pi pi-shopping-cart",
          color: "#10b981",
          path: "/home/purchase/pinvoice",
        },
        {
          id: "accounts",
          title: "Accounts",
          icon: "pi pi-wallet",
          color: "#f59e0b",
          path: "/home/accounts/accounts",
        },
        {
          id: "crm",
          title: "CRM",
          icon: "pi pi-users",
          color: "#ec4899",
          path: "/home/crm/contact",
        },
      ],
    },
    {
      title: "Settings & Profile",
      items: [
        {
          id: "profile",
          title: "My Profile",
          icon: "pi pi-user-edit",
          color: "#64748b",
          path: "/home/auth/profile",
        },
        {
          id: "password",
          title: "Security",
          icon: "pi pi-shield",
          color: "#64748b",
          path: "/home/auth/password",
        },
      ],
    },
  ];

  return (
    <div className="menus-container">
      <h2
        style={{
          fontSize: "1.75rem",
          fontWeight: "800",
          color: "var(--mobile-text-main)",
          marginBottom: "1.5rem",
          letterSpacing: "-0.025em",
        }}
      >
        Explore Feature
      </h2>

      {menuCategories.map((category) => (
        <div key={category.title} style={{ marginBottom: "2rem" }}>
          <h3
            style={{
              fontSize: "0.85rem",
              fontWeight: "700",
              color: "var(--mobile-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "1rem",
            }}
          >
            {category.title}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "0.75rem",
            }}
          >
            {category.items.map((item) => (
              <div
                key={item.id}
                className="mobile-card"
                style={{
                  padding: "1rem",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
                onClick={() => navigate(item.path)}
              >
                <div
                  style={{
                    backgroundColor: `${item.color}15`,
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: item.color,
                  }}
                >
                  <i className={item.icon} style={{ fontSize: "1.1rem" }}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <span
                    style={{
                      fontWeight: "600",
                      fontSize: "0.95rem",
                      color: "var(--mobile-text-main)",
                    }}
                  >
                    {item.title}
                  </span>
                </div>
                <i
                  className="pi pi-chevron-right"
                  style={{ fontSize: "0.8rem", color: "#cbd5e1" }}
                ></i>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ marginTop: "3rem", paddingBottom: "1rem" }}>
        <button
          onClick={logout}
          style={{
            width: "100%",
            padding: "1rem",
            borderRadius: "12px",
            border: "1px solid #fee2e2",
            backgroundColor: "#fef2f2",
            color: "#ef4444",
            fontWeight: "700",
            fontSize: "0.95rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            cursor: "pointer",
          }}
        >
          <i className="pi pi-power-off"></i>
          Sign Out
        </button>
        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.75rem",
            color: "#cbd5e1",
          }}
        >
          App Version 1.0.0
        </p>
      </div>
    </div>
  );
};

export default Menus;
