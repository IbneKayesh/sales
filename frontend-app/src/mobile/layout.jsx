import React from "react";
import { TabMenu } from "primereact/tabmenu";

const Layout = ({ children }) => {
  const items = [
    {
      label: "Home",
      icon: "pi pi-fw pi-home",
      command: () => {
        window.location.hash = "/";
      },
    },
    {
      label: "Menus",
      icon: "pi pi-fw pi-list",
      command: () => {
        window.location.hash = "/menus";
      },
    },
    {
      label: "About",
      icon: "pi pi-fw pi-info-circle",
      command: () => {
        window.location.hash = "/about";
      },
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#f4f4f9",
        minHeight: "100vh",
        fontFamily: "var(--font-family, sans-serif)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "375px",
          height: "100vh",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: "1rem",
            textAlign: "center",
            backgroundColor: "var(--primary-color, #6366f1)",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.2rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            zIndex: 10,
          }}
        >
          App Title
        </header>

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem",
            paddingBottom: "80px", // Space for bottom nav
          }}
        >
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            backgroundColor: "white",
            borderTop: "1px solid #eee",
            zIndex: 10,
          }}
        >
          <TabMenu
            model={items}
            style={{ border: "none" }}
            className="mobile-bottom-nav"
          />
        </nav>
      </div>
    </div>
  );
};

export default Layout;
