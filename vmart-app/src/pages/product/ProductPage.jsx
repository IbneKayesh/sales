import { useState, useEffect, useRef } from "react";
import {
  FiBox,
  FiTrash2,
  FiPlus,
  FiEdit2,
  FiAlertTriangle,
} from "react-icons/fi";
import { useUI } from "../context/UIContext";
import ProductFormModal from "./ProductFormModal";
import "./ProductPage.css";
import useProducts from "@/hooks/useProducts";

export default function ProductPage() {
  const {
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    showModal,
    runit_options,
    scatg_options,
    handleChange,
    handleEdit,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
  } = useProducts();

  const { showToast, showConfirm, setBusy, isBusy } = useUI();
  const [form, setForm] = useState({
    image: "",
  });
  const fileInputRef = useRef(null);

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

  const getStockStatus = (p) => {
    const stock = Number(p.price_gdstk) ?? (p.price_gdstk ? 10 : 0);
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
          <h1 className="page-heading">Products ({dataList.length})</h1>
        </div>
        <div className="product-header-actions">
          <button
            className="ui-btn ui-btn-primary product-add-btn"
            onClick={handleOpenModal}
          >
            <FiPlus /> Add
          </button>
          <div className="ui-badge">
            <FiBox />
          </div>
        </div>
      </div>

      {dataList.length === 0 ? (
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
            {dataList.map((p, idx) => {
              const stockStatus = getStockStatus(p);
              return (
                <div
                  key={idx}
                  className="product-list-item"
                  onClick={() => handleEdit(p)}
                >
                  <div className="product-thumb">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.items_iname}
                        className="product-thumb-img"
                      />
                    ) : (
                      "📦"
                    )}
                  </div>
                  <div className="product-info">
                    <div className="product-name-row">
                      <span className="product-name">{p.items_iname}</span>
                      {p.items_scatg && (
                        <span className="ui-tag">{p.items_scatg}</span>
                      )}
                      {p.items_runit && (
                        <span className="ui-tag ui-tag--shop">
                          ⚖ {p.items_runit}
                        </span>
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
                      ৳{Number(p.price_mrrat).toFixed(2)}
                      {Number(p.price_dspct) > 0 && (
                        <span className="product-discount-text">
                          -{Number(p.price_dspct).toFixed(0)}% off
                        </span>
                      )}
                      {(Number(p.price_gdstk) ?? (p.price_gdstk ? 10 : 0)) >
                        0 && (
                        <span className="product-stock-text">
                          {" "}
                          · Stock:{" "}
                          {Number(p.price_gdstk) ?? (p.price_gdstk ? 10 : 0)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="product-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(p);
                      }}
                      className="product-icon-btn product-icon-btn--edit"
                      aria-label="Edit product"
                    >
                      <FiEdit2 />
                    </button>
                    {/* <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProduct(idx);
                      }}
                      className="product-icon-btn product-icon-btn--delete"
                      aria-label="Delete product"
                    >
                      <FiTrash2 />
                    </button> */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showModal && (
        <ProductFormModal
          isBusy={isBusy}
          formData={formData}
          onChange={handleChange}
          runit_options={runit_options}
          scatg_options={scatg_options}
          fileInputRef={fileInputRef}
          onImageUpload={handleImageUpload}
          onCloseModal={handleCloseModal}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  );
}
