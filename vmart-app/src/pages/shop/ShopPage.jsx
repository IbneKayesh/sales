import { useState, useEffect } from "react";
import { FiGrid, FiTrash2, FiPlus, FiEdit2 } from "react-icons/fi";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";
import ShopFormModal from "./ShopFormModal";
import "./ShopPage.css";

export default function ShopPage() {
  const { showToast, showConfirm, setBusy, isBusy } = useUI();
  const [form, setForm] = useState({
    name: "",
    description: "",
    contact: "",
    address: "",
  });
  const [shops, setShops] = useState(() => load(KEYS.SHOPS));
  const [editingIdx, setEditingIdx] = useState(null);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    save(KEYS.SHOPS, shops);
  }, [shops]);

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));
  const resetForm = () => {
    setForm({ name: "", description: "", contact: "", address: "" });
    setEditingIdx(null);
  };
  const openAdd = () => {
    resetForm();
    setModal(true);
  };
  const openEdit = (idx) => {
    setForm(shops[idx]);
    setEditingIdx(idx);
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
    resetForm();
  };

  const saveShop = () => {
    if (!form.name.trim()) return;
    setBusy(true);
    const isEdit = editingIdx !== null;
    if (isEdit)
      setShops((prev) => {
        const n = [...prev];
        n[editingIdx] = { ...form };
        return n;
      });
    else setShops((prev) => [...prev, { ...form }]);
    closeModal();
    showToast(isEdit ? "Shop updated successfully" : "Shop added successfully");
    setBusy(false);
  };

  const deleteShop = async (idx) => {
    const confirmed = await showConfirm(`Delete ${shops[idx].name}?`);
    if (!confirmed) return;
    setBusy(true);
    setShops((prev) => prev.filter((_, i) => i !== idx));
    if (editingIdx === idx) closeModal();
    showToast("Shop deleted", "error");
    setBusy(false);
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Vendors</p>
          <h1 className="page-heading">Shops ({shops.length})</h1>
        </div>
        <div className="shop-header-actions">
          <button
            className="ui-btn ui-btn-primary shop-add-btn"
            onClick={openAdd}
          >
            <FiPlus /> Add
          </button>
          <div className="ui-badge">
            <FiGrid />
          </div>
        </div>
      </div>

      {shops.length > 0 ? (
        <div className="ui-card">
          <h3 className="ui-card-title">All Shops ({shops.length})</h3>
          <div className="shop-list">
            {shops.map((s, idx) => (
              <div
                key={idx}
                className="shop-list-item"
                onClick={() => openEdit(idx)}
              >
                <div className="shop-icon-avatar">🏪</div>
                <div className="shop-info">
                  <div className="shop-name">{s.name}</div>
                  {s.description && (
                    <div className="shop-description">{s.description}</div>
                  )}
                  {s.contact && (
                    <div className="shop-contact">📞 {s.contact}</div>
                  )}
                </div>
                <div className="shop-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(idx);
                    }}
                    className="shop-icon-btn shop-icon-btn--edit"
                    aria-label="Edit shop"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteShop(idx);
                    }}
                    className="shop-icon-btn shop-icon-btn--delete"
                    aria-label="Delete shop"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="shop-empty-state">
          <div className="shop-empty-icon">🏪</div>
          <div>
            <h3 className="shop-empty-heading">No shops yet</h3>
            <p className="shop-empty-text">
              Tap "Add" to create your first vendor/shop.
            </p>
          </div>
        </div>
      )}

      {modal && (
        <ShopFormModal
          editingIdx={editingIdx}
          closeModal={closeModal}
          form={form}
          handleChange={handleChange}
          isBusy={isBusy}
          saveShop={saveShop}
        />
      )}
    </section>
  );
}
