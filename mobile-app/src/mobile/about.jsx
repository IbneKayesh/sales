import React from "react";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";

const About = () => {
  return (
    <div className="about-container">
      <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "#333" }}>
        About Application
      </h2>
      <p
        style={{
          color: "#666",
          lineHeight: "1.5",
          fontSize: "0.9rem",
          marginBottom: "2rem",
        }}
      >
        This is a modern mobile-app–style web application built with React and
        PrimeReact. It demonstrates how to create a mobile-first user experience
        using common UI patterns like bottom navigation and card-based layouts.
      </p>

      <Card
        style={{
          borderRadius: "15px",
          border: "none",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Avatar
            image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
            size="xlarge"
            shape="circle"
            style={{ marginBottom: "1rem" }}
          />
          <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem" }}>
            Admin User
          </h3>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#888" }}>
            Lead Developer
          </p>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            <i className="pi pi-twitter" style={{ color: "#00acee" }}></i>
            <i className="pi pi-github" style={{ color: "#333" }}></i>
            <i className="pi pi-envelope" style={{ color: "#ea4335" }}></i>
          </div>
        </div>
      </Card>

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <span style={{ fontSize: "0.8rem", color: "#ccc" }}>Version 1.0.0</span>
      </div>
    </div>
  );
};

export default About;
