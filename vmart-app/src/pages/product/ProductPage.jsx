import { useState, useEffect, useRef } from "react";
import {
  FiBox,
  FiTrash2,
  FiPlus,
  FiEdit2,
  FiAlertTriangle,
} from "react-icons/fi";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";
import ProductFormModal from "./ProductFormModal";
import "./ProductPage.css";

export default function ProductPage() {
  const { showToast, showConfirm, setBusy, isBusy } = useUI();
  const [shops, setShops] = useState(() => load(KEYS.SHOPS));
  const [form, setForm] = useState({
    name: "",
    category: "",
    shop: "",
    price: 0,
    discount: 0,
    stock: 0,
    image: "",
  });
  const [products, setProducts] = useState(() => load(KEYS.PRODUCTS));
  const [editingIdx, setEditingIdx] = useState(null);
  const [modal, setModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    save(KEYS.PRODUCTS, products);
  }, [products]);

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      shop: "",
      price: 0,
      discount: 0,
      stock: 0,
      image: "",
    });
    setEditingIdx(null);
  };

  const openAdd = () => {
    resetForm();
    setModal(true);
  };
  const openEdit = (idx) => {
    const p = products[idx];
    setForm({
      name: p.name || "",
      category: p.category || "",
      shop: p.shop || "",
      price: p.price || 0,
      discount: p.discount || 0,
      stock: p.stock !== undefined ? p.stock : p.inStock ? 10 : 0,
      image: p.image || "",
    });
    setEditingIdx(idx);
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
    resetForm();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file", "error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("Image must be under 2MB", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) =>
      setForm((prev) => ({ ...prev, image: ev.target?.result || "" }));
    reader.readAsDataURL(file);
  };

  const saveProduct = () => {
    if (!form.name.trim()) return;
    setBusy(true);
    const isEdit = editingIdx !== null;
    if (isEdit)
      setProducts((prev) => {
        const n = [...prev];
        n[editingIdx] = { ...form };
        return n;
      });
    else setProducts((prev) => [...prev, { ...form }]);
    closeModal();
    showToast(
      isEdit ? "Product updated successfully" : "Product added successfully",
    );
    setBusy(false);
  };

  const deleteProduct = async (idx) => {
    const confirmed = await showConfirm(`Delete ${products[idx].name}?`);
    if (!confirmed) return;
    setBusy(true);
    setProducts((prev) => prev.filter((_, i) => i !== idx));
    if (editingIdx === idx) closeModal();
    showToast("Product deleted", "error");
    setBusy(false);
  };

  const getStockStatus = (p) => {
    const stock = p.stock ?? (p.inStock ? 10 : 0);
    if (stock <= 0)
      return {
        label: "Out of Stock",
        color: "var(--error)",
        bg: "var(--error-bg)",
      };
    if (stock <= 5)
      return {
        label: `Only ${stock} left`,
        color: "orange",
        bg: "rgba(255,165,0,0.12)",
      };
    return null;
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Inventory</p>
          <h1 className="page-heading">Products ({products.length})</h1>
        </div>
        <div className="product-header-actions">
          <button
            className="ui-btn ui-btn-primary product-add-btn"
            onClick={openAdd}
          >
            <FiPlus /> Add
          </button>
          <div className="ui-badge">
            <FiBox />
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="product-empty-state">
          <div className="product-empty-icon">
            <FiBox />
          </div>
          <div>
            <h3 className="product-empty-heading">No products yet</h3>
            <p className="product-empty-text">
              Tap "Add" to create your first product.
            </p>
          </div>
        </div>
      ) : (
        <div className="ui-card">
          <div className="product-list">
            {products.map((p, idx) => {
              const stockStatus = getStockStatus(p);
              return (
                <div
                  key={idx}
                  className="product-list-item"
                  onClick={() => openEdit(idx)}
                >
                  <div className="product-thumb">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="product-thumb-img"
                      />
                    ) : (
                      "📦"
                    )}
                  </div>
                  <div className="product-info">
                    <div className="product-name-row">
                      <span className="product-name">{p.name}</span>
                      {p.category && (
                        <span className="ui-tag">{p.category}</span>
                      )}
                      {p.shop && (
                        <span className="ui-tag ui-tag--shop">🏪 {p.shop}</span>
                      )}
                      {stockStatus && (
                        <span
                          className="product-stock-badge"
                          style={{
                            color: stockStatus.color,
                            background: stockStatus.bg,
                          }}
                        >
                          {stockStatus.label === "Out of Stock" && (
                            <FiAlertTriangle size={10} />
                          )}
                          {stockStatus.label}
                        </span>
                      )}
                    </div>
                    <div className="product-meta">
                      ₹{p.price.toFixed(2)}
                      {p.discount > 0 && (
                        <span className="product-discount-text">
                          -{p.discount}% off
                        </span>
                      )}
                      {(p.stock ?? (p.inStock ? 10 : 0)) > 0 && (
                        <span className="product-stock-text">
                          {" "}
                          · Stock: {p.stock ?? (p.inStock ? 10 : 0)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="product-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(idx);
                      }}
                      className="product-icon-btn product-icon-btn--edit"
                      aria-label="Edit product"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProduct(idx);
                      }}
                      className="product-icon-btn product-icon-btn--delete"
                      aria-label="Delete product"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {modal && (
        <ProductFormModal
          editingIdx={editingIdx}
          closeModal={closeModal}
          shops={shops}
          form={form}
          handleChange={handleChange}
          isBusy={isBusy}
          saveProduct={saveProduct}
          fileInputRef={fileInputRef}
          handleImageUpload={handleImageUpload}
        />
      )}
    </section>
  );
}
