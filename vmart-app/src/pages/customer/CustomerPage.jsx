import { useState, useEffect } from "react";
import { FiUsers, FiTrash2, FiPlus, FiEdit2 } from "react-icons/fi";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";
import CustomerFormModal from "./CustomerFormModal";
import "./CustomerPage.css";

export default function CustomerPage() {
  const { showToast, showConfirm, setBusy, isBusy } = useUI();
  const [form, setForm] = useState({ name: "", contact: "", address: "" });
  const [customers, setCustomers] = useState(() => load(KEYS.CUSTOMERS));
  const [editingIdx, setEditingIdx] = useState(null);
  const [modal, setModal] = useState(false);

  useEffect(() => { save(KEYS.CUSTOMERS, customers); }, [customers]);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const resetForm = () => { setForm({ name: "", contact: "", address: "" }); setEditingIdx(null); };
  const openAdd = () => { resetForm(); setModal(true); };
  const openEdit = (idx) => { setForm(customers[idx]); setEditingIdx(idx); setModal(true); };
  const closeModal = () => { setModal(false); resetForm(); };

  const saveCustomer = () => {
    if (!form.name.trim()) return;
    setBusy(true);
    const isEdit = editingIdx !== null;
    if (isEdit) setCustomers((prev) => { const n = [...prev]; n[editingIdx] = { ...form }; return n; });
    else setCustomers((prev) => [...prev, { ...form }]);
    closeModal();
    showToast(isEdit ? "Customer updated successfully" : "Customer added successfully");
    setBusy(false);
  };

  const deleteCustomer = async (idx) => {
    const confirmed = await showConfirm(`Delete ${customers[idx].name}?`);
    if (!confirmed) return;
    setBusy(true);
    setCustomers((prev) => prev.filter((_, i) => i !== idx));
    if (editingIdx === idx) closeModal();
    showToast("Customer deleted", "error");
    setBusy(false);
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Management</p>
          <h1 className="page-heading">Customers ({customers.length})</h1>
        </div>
        <div className="customer-header-actions">
          <button className="ui-btn ui-btn-primary customer-add-btn" onClick={openAdd}><FiPlus /> Add</button>
          <div className="ui-badge"><FiUsers /></div>
        </div>
      </div>

      {customers.length === 0 ? (
        <div className="customer-empty-state">
          <div className="customer-empty-icon"><FiUsers /></div>
          <div>
            <h3 className="customer-empty-heading">No customers yet</h3>
            <p className="customer-empty-text">Tap "Add" to create your first customer.</p>
          </div>
        </div>
      ) : (
        <div className="ui-card">
          <div className="customer-list">
            {customers.map((c, idx) => (
              <div key={idx} className="customer-list-item" onClick={() => openEdit(idx)}>
                <div className="customer-info">
                  <div className="customer-name">{c.name}</div>
                  {c.contact && <div className="customer-detail">{c.contact}</div>}
                  {c.address && <div className="customer-detail">{c.address}</div>}
                </div>
                <div className="customer-actions">
                  <button onClick={(e) => { e.stopPropagation(); openEdit(idx); }}
                    className="customer-icon-btn customer-icon-btn--edit" aria-label="Edit customer"><FiEdit2 /></button>
                  <button onClick={(e) => { e.stopPropagation(); deleteCustomer(idx); }}
                    className="customer-icon-btn customer-icon-btn--delete" aria-label="Delete customer"><FiTrash2 /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {modal && (
        <CustomerFormModal
          editingIdx={editingIdx}
          closeModal={closeModal}
          form={form}
          handleChange={handleChange}
          isBusy={isBusy}
          saveCustomer={saveCustomer}
        />
      )}
    </section>
  );
}
