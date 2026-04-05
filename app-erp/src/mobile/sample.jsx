import React from "react";
import { Button } from "primereact/button";

const SamplePage = () => {
  return (
    <div className="sample-page">
      <h2
        style={{
          fontSize: "1.75rem",
          fontWeight: "800",
          color: "var(--mobile-text-main)",
          marginBottom: "1rem",
          letterSpacing: "-0.025em",
        }}
      >
        Recent Activity
      </h2>
      <p
        style={{
          color: "var(--mobile-text-muted)",
          fontSize: "0.9rem",
          lineHeight: "1.5",
          marginBottom: "2rem",
        }}
      >
        This page demonstrates navigation transitions and a clean activity
        layout for the production-grade mobile demo.
      </p>

      <div className="mobile-card" style={{ padding: "1.5rem" }}>
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <i
            className="pi pi-inbox"
            style={{ fontSize: "3rem", color: "#e2e8f0", marginBottom: "1rem" }}
          ></i>
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: "600",
              color: "var(--mobile-text-main)",
              margin: 0,
            }}
          >
            No new notifications
          </h3>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--mobile-text-muted)",
              marginTop: "0.5rem",
            }}
          >
            We'll let you know when something important happens.
          </p>
        </div>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: "700",
            color: "var(--mobile-text-main)",
            marginBottom: "1rem",
          }}
        >
          Suggested Actions
        </h3>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <div
            className="mobile-card"
            style={{
              margin: 0,
              padding: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#3b82f6",
              }}
            >
              <i className="pi pi-plus"></i>
            </div>
            <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>
              Create New Invoice
            </span>
          </div>
          <div
            className="mobile-card"
            style={{
              margin: 0,
              padding: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "#f0fdf4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#22c55e",
              }}
            >
              <i className="pi pi-user-plus"></i>
            </div>
            <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>
              Add New Contact
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SamplePage;
