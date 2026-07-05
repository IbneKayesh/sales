import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { Plus, Trash2, Edit2, X, Save } from "lucide-react";
import "./ShopProducts.css";
import  useShopProducts  from "@/hooks/shop/useShopProducts";

const ShopProducts = () => {
  const { products, addProduct, updateProduct, removeProduct } = useShop();
  const {
    //hooks
    pageAuth,
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    //other states
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleBackClick,
    handleSearchClick,
    handleRefreshClick,
    handleAddNewClick,
    handleSubmitClick,
  } = useShopProducts();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    icon: "📦",
    discount: "",
    inStock: true,
  });

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      category: "",
      icon: "📦",
      discount: "",
      inStock: true,
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit1 = (prod) => {
    setForm({
      name: prod.name,
      price: prod.price,
      category: prod.category,
      icon: prod.icon || "📦",
      discount: prod.discount || "",
      inStock: prod.inStock !== false,
    });
    setEditingId(prod.id);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) {
      alert("Name and Price are required.");
      return;
    }
    const payload = {
      name: form.name,
      price: parseFloat(form.price),
      category: form.category || "General",
      icon: form.icon,
      discount: parseFloat(form.discount) || 0,
      inStock: form.inStock,
    };
    if (editingId) {
      updateProduct(editingId, payload);
    } else {
      addProduct(payload);
    }
    resetForm();
  };

  return (
    <div className={`page-container shop-products-page`}>
      {/* Header */}
      <div className="shop-products-header">
        <div>
          <h1 className="shop-products-header-title">Products</h1>
          <p className="shop-products-header-sub">Manage your shop inventory</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="shop-products-add-btn"
          >
            <Plus size={16} /> Add New
          </button>
        )}
      </div>

      <div
        className={
          isEditing
            ? "shop-products-content-form"
            : "shop-products-content-no-form"
        }
      >
        {isEditing && (
          <div className="shop-products-form-card">
            <div className="shop-products-form-header">
              <span className="shop-products-form-title">
                {editingId ? "Edit Product" : "New Product"}
              </span>
              <button onClick={resetForm} className="shop-products-form-close">
                <X size={20} />
              </button>
            </div>

            <div className="shop-products-form-group">
              <label className="shop-products-form-label">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="shop-products-form-input"
                placeholder="e.g. Rice 1kg"
              />
            </div>

            <div className="shop-products-form-row">
              <div className="shop-products-form-row-item">
                <label className="shop-products-form-label">Price (৳)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="shop-products-form-input"
                  placeholder="0.00"
                />
              </div>
              <div className="shop-products-form-row-item">
                <label className="shop-products-form-label">Discount (৳)</label>
                <input
                  type="number"
                  value={form.discount}
                  onChange={(e) =>
                    setForm({ ...form, discount: e.target.value })
                  }
                  className="shop-products-form-input"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div
              className="shop-products-form-row"
              style={{ marginBottom: "20px" }}
            >
              <div style={{ flex: 2 }}>
                <label className="shop-products-form-label">Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="shop-products-form-input"
                  placeholder="e.g. Groceries"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="shop-products-form-label">Icon</label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="shop-products-form-input shop-products-form-input-center"
                />
              </div>
            </div>

            <div className="shop-products-form-stock-row">
              <input
                type="checkbox"
                id="inStock"
                checked={form.inStock}
                onChange={(e) =>
                  setForm({ ...form, inStock: e.target.checked })
                }
                className="shop-products-form-stock-cb"
              />
              <label
                htmlFor="inStock"
                className="shop-products-form-stock-label"
              >
                Product is currently In Stock
              </label>
            </div>

            <button onClick={handleSave} className="shop-products-save-btn">
              <Save size={18} /> Save Product
            </button>
          </div>
        )}

        {/* Product List */}
        <div className="shop-products-list">
          {products.map((p) => (
            <div
              key={p.id}
              className={`shop-products-item ${p.inStock === false ? "shop-products-item-out" : ""}`}
            >
              <div className="shop-products-item-left">
                <div className="shop-products-item-icon">{p.icon || "📦"}</div>
                <div>
                  <div
                    className={`shop-products-item-name ${p.inStock === false ? "shop-products-item-name-strike" : ""}`}
                  >
                    {p.name}
                    {p.inStock === false && (
                      <span className="shop-products-item-out-badge">
                        Out of stock
                      </span>
                    )}
                  </div>
                  <div className="shop-products-item-cat">{p.category}</div>
                  <div className="shop-products-item-price">
                    ৳{p.discount ? (p.price - p.discount).toFixed(2) : p.price}
                    {p.discount > 0 && (
                      <span className="shop-products-item-original">
                        ৳{p.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="shop-products-item-actions">
                <button
                  onClick={() => handleEdit(p)}
                  className="shop-products-edit-btn"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => removeProduct(p.id)}
                  className="shop-products-del-btn"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="shop-products-empty">
              <div className="shop-products-empty-icon">🛒</div>
              <p style={{ fontWeight: 600 }}>No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopProducts;
