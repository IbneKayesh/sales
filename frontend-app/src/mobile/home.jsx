import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

const Home = () => {
  return (
    <div className="home-container">
      <section style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h2
          style={{ color: "#333", fontSize: "1.5rem", marginBottom: "0.5rem" }}
        >
          Welcome Back!
        </h2>
        <p style={{ color: "#666", fontSize: "0.9rem" }}>
          Check out what's happening today.
        </p>
      </section>

      <Card
        style={{
          marginBottom: "1rem",
          borderRadius: "15px",
          border: "none",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <i
            className="pi pi-bolt"
            style={{ fontSize: "1.5rem", color: "#6366f1" }}
          ></i>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem" }}>Quick Stats</h3>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#888" }}>
              You have 5 new tasks today.
            </p>
          </div>
        </div>
      </Card>

      <Card
        style={{
          marginBottom: "1.5rem",
          borderRadius: "15px",
          border: "none",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ marginTop: 0, fontSize: "1rem" }}>Daily Progress</h3>
        <div
          style={{
            width: "100%",
            height: "8px",
            backgroundColor: "#eee",
            borderRadius: "4px",
            marginTop: "1rem",
          }}
        >
          <div
            style={{
              width: "70%",
              height: "100%",
              backgroundColor: "#6366f1",
              borderRadius: "4px",
            }}
          ></div>
        </div>
        <p
          style={{
            textAlign: "right",
            fontSize: "0.75rem",
            color: "#666",
            marginTop: "0.5rem",
          }}
        >
          70% Complete
        </p>
      </Card>

      <div style={{ padding: "0 1rem" }}>
        <Button
          label="Get Started"
          className="p-button-rounded p-button-raised w-full"
          style={{ width: "100%", padding: "0.75rem" }}
        />
      </div>
    </div>
  );
};

export default Home;
