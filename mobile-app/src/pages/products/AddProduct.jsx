import React, { useState } from "react";
import { ArrowLeft, Image as ImageIcon, Save, X, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    unit: "Pc",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving Product:", formData);
    navigate("/products/list");
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/products/list")}>
          <ArrowLeft size={20} />
        </button>
        <span className="page-header-title">Add New Product</span>
      </div>

      <div style={{ padding: "16px" }}>
        <form onSubmit={handleSubmit}>
          {/* Image Upload Placeholder */}
          <div
            className="card"
            style={{ padding: "0", marginBottom: "16px", overflow: "hidden" }}
          >
            <div
              style={{
                height: "150px",
                background: "var(--background)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: "2px dashed var(--border)",
                margin: "8px",
                borderRadius: "10px",
              }}
            >
              <ImageIcon size={32} color="var(--text-secondary)" />
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  marginTop: "8px",
                  fontWeight: 600,
                }}
              >
                Tap to upload product image
              </span>
            </div>
          </div>

          <div className="card">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Stationery">Stationery</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Office Gear">Office Gear</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Initial Stock</label>
                <input
                  type="number"
                  name="stock"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Unit</label>
              <select name="unit" value={formData.unit} onChange={handleChange}>
                <option value="Pc">Pc (Piece)</option>
                <option value="Box">Box</option>
                <option value="Pack">Pack</option>
                <option value="Ream">Ream</option>
                <option value="Kg">Kg</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea
                name="description"
                placeholder="Enter product description..."
                row="3"
                value={formData.description}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--background)",
                  color: "var(--on-surface)",
                  fontSize: "14px",
                  resize: "none",
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/products/list")}
              style={{ flex: 1, margin: 0 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <Save size={18} /> Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
