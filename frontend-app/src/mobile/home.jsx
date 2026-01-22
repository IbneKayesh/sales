import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const stats = [
    {
      label: "Total Sales",
      value: "$12,450",
      trend: "+12%",
      icon: "pi pi-chart-line",
      color: "#6366f1",
    },
    {
      label: "Orders",
      value: "48",
      trend: "+5%",
      icon: "pi pi-shopping-bag",
      color: "#10b981",
    },
    {
      label: "Contacts",
      value: "156",
      trend: "+8%",
      icon: "pi pi-users",
      color: "#f59e0b",
    },
  ];

  return (
    <div className="home-container">
      <section style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            color: "var(--mobile-text-main)",
            fontSize: "1.75rem",
            fontWeight: "800",
            marginBottom: "0.25rem",
            letterSpacing: "-0.025em",
          }}
        >
          Overview
        </h2>
        <p style={{ color: "var(--mobile-text-muted)", fontSize: "0.85rem" }}>
          {today}
        </p>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {stats.slice(0, 2).map((stat) => (
          <div
            key={stat.label}
            className="mobile-card"
            style={{ margin: 0, padding: "1.25rem 1rem" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  backgroundColor: `${stat.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: stat.color,
                }}
              >
                <i className={stat.icon} style={{ fontSize: "0.9rem" }}></i>
              </div>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--mobile-text-muted)",
                  fontWeight: "500",
                }}
              >
                {stat.label}
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.4rem",
                }}
              >
                <span
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    color: "var(--mobile-text-main)",
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontSize: "0.65rem",
                    color: "#10b981",
                    fontWeight: "600",
                  }}
                >
                  {stat.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-title">
        <span>Recent Activity</span>
        <span className="view-all">View all</span>
      </div>

      <div className="mobile-card" style={{ padding: "0" }}>
        {[1, 2, 3].map((i, idx) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem",
              borderBottom: idx === 2 ? "none" : "1px solid #f1f5f9",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--mobile-text-muted)",
              }}
            >
              <i className="pi pi-file" style={{ fontSize: "1rem" }}></i>
            </div>
            <div style={{ flex: 1 }}>
              <h4
                style={{
                  margin: 0,
                  fontSize: "0.85rem",
                  color: "var(--mobile-text-main)",
                  fontWeight: "600",
                }}
              >
                Invoice #2024-00{i}
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.75rem",
                  color: "var(--mobile-text-muted)",
                }}
              >
                Pending • 2 hours ago
              </p>
            </div>
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: "700",
                color: "var(--mobile-text-main)",
              }}
            >
              $240.00
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Button
          label="New Transaction"
          icon="pi pi-plus"
          className="w-full"
          style={{
            backgroundColor: "var(--mobile-primary)",
            border: "none",
            borderRadius: "12px",
            padding: "1rem",
            fontSize: "0.9rem",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
          }}
        />
      </div>
    </div>
  );
};

export default Home;
