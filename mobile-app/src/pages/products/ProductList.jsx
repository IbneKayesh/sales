import React, { useState } from "react";
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Plus,
  ShoppingCart,
  Tag,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Premium Blue Pen",
    category: "Stationery",
    price: 12.5,
    stock: 45,
    unit: "Box",
    image: "🖊️",
  },
  {
    id: 2,
    name: "A4 Paper Ream",
    category: "Office Supplies",
    price: 5.2,
    stock: 8,
    unit: "Ream",
    image: "📄",
  },
  {
    id: 3,
    name: "Desk Organizer",
    category: "Office Gear",
    price: 24.99,
    stock: 15,
    unit: "Pc",
    image: "📥",
  },
  {
    id: 4,
    name: "Wireless Mouse",
    category: "Electronics",
    price: 45.0,
    stock: 0,
    unit: "Pc",
    image: "🖱️",
  },
  {
    id: 5,
    name: "Gel Ink Refills",
    category: "Stationery",
    price: 3.5,
    stock: 120,
    unit: "Pack",
    image: "✒️",
  },
  {
    id: 6,
    name: "Stapler Heavy Duty",
    category: "Office Gear",
    price: 18.25,
    stock: 3,
    unit: "Pc",
    image: "🖇️",
  },
];

const ProductList = () => {
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="app-container">
      {/* Header with Search & View Toggle */}
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
        <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={18}
              color="var(--text-secondary)"
              style={{ position: "absolute", left: "12px", top: "10px" }}
            />
            <input
              type="text"
              placeholder="Search products..."
              style={{ paddingLeft: "40px", marginBottom: 0 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
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
            {viewMode === "grid" ? (
              <List size={20} />
            ) : (
              <LayoutGrid size={20} />
            )}
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              fontWeight: 600,
            }}
          >
            {filteredProducts.length} Products found
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <span
              style={{
                fontSize: "11px",
                background: "var(--background)",
                padding: "4px 8px",
                borderRadius: "6px",
                color: "var(--text-secondary)",
              }}
            >
              Category: All
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: "12px" }}>
        {viewMode === "grid" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="card"
                style={{ padding: "0", overflow: "hidden" }}
              >
                <div
                  style={{
                    height: "100px",
                    background: "var(--background)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "40px",
                  }}
                >
                  {p.image}
                  {p.stock === 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "#EF4444",
                        color: "#fff",
                        padding: "2px 6px",
                        borderRadius: "6px",
                        fontSize: "9px",
                        fontWeight: 700,
                      }}
                    >
                      OUT OF STOCK
                    </div>
                  )}
                </div>
                <div style={{ padding: "12px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {p.category}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "var(--on-surface)",
                      margin: "2px 0 8px",
                      height: "40px",
                      overflow: "hidden",
                    }}
                  >
                    {p.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 800,
                        color: "var(--primary)",
                      }}
                    >
                      ${p.price.toFixed(2)}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color:
                          p.stock < 10 ? "#F97316" : "var(--text-secondary)",
                        fontWeight: 600,
                      }}
                    >
                      Qty: {p.stock}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="card"
                style={{
                  padding: "12px",
                  marginBottom: "8px",
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "10px",
                    background: "var(--background)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                  }}
                >
                  {p.image}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "var(--on-surface)",
                        }}
                      >
                        {p.name}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {p.category} • {p.unit}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: 800,
                          color: "var(--primary)",
                        }}
                      >
                        ${p.price.toFixed(2)}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color:
                            p.stock < 10 ? "#F97316" : "var(--text-secondary)",
                          fontWeight: 600,
                        }}
                      >
                        {p.stock === 0 ? "Out of Stock" : `Stock: ${p.stock}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate("/products/add")}
        style={{
          position: "fixed",
          bottom: "85px",
          right: "20px",
          width: "56px",
          height: "56px",
          borderRadius: "28px",
          background: "var(--primary)",
          color: "#fff",
          border: "none",
          boxShadow: "0 4px 12px rgba(15,118,110,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
        }}
      >
        <Plus size={28} />
      </button>
    </div>
  );
};

export default ProductList;
