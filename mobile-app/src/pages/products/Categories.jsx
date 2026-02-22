import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  Plus,
  Tag,
  ChevronRight,
  PenTool,
  Printer,
  Laptop,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Stationery",
    items: 124,
    icon: <PenTool size={22} />,
    color: "#0F766E",
    bg: "rgba(15,118,110,0.12)",
  },
  {
    id: 2,
    name: "Office Supplies",
    items: 85,
    icon: <Printer size={22} />,
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.12)",
  },
  {
    id: 3,
    name: "Office Gear",
    items: 42,
    icon: <Package size={22} />,
    color: "#DB2777",
    bg: "rgba(219,39,119,0.12)",
  },
  {
    id: 4,
    name: "Electronics",
    items: 18,
    icon: <Laptop size={22} />,
    color: "#D97706",
    bg: "rgba(217,119,6,0.12)",
  },
  {
    id: 5,
    name: "Furniture",
    items: 7,
    icon: <Tag size={22} />,
    color: "#0F766E",
    bg: "rgba(15,118,110,0.12)",
  },
];

const Categories = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="app-container">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
        </button>
        <span className="page-header-title">Product Categories</span>
      </div>

      <div style={{ padding: "12px 16px" }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={18}
              color="var(--text-secondary)"
              style={{ position: "absolute", left: "12px", top: "10px" }}
            />
            <input
              type="text"
              placeholder="Search categories..."
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
              border: "none",
              background: "var(--primary)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plus size={20} />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="card"
              style={{
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "10px",
                cursor: "pointer",
              }}
              onClick={() => navigate("/products/list")}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "18px",
                  background: cat.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: cat.color,
                }}
              >
                {cat.icon}
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: "15px",
                    color: "var(--on-surface)",
                  }}
                >
                  {cat.name}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    marginTop: "2px",
                  }}
                >
                  {cat.items} Products
                </div>
              </div>
              <div
                style={{ position: "absolute", bottom: "12px", right: "12px" }}
              >
                <ChevronRight size={16} color="var(--border)" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
