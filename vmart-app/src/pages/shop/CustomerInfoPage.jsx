import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Save, Phone, Mail, MapPin, X } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import "./CustomerInfoPage.css";

const CustomerInfoPage = () => {
  const navigate = useNavigate();
  const { customers, updateCustomer, invoices } = useShop();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [search, setSearch] = useState("");

  const filtered = customers.filter((c) =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile.includes(search) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (customer) => {
    setEditingId(customer.id);
    setEditForm({ name: customer.name, mobile: customer.mobile, email: customer.email, address: customer.address });
  };

  const saveEdit = () => { updateCustomer(editingId, editForm); setEditingId(null); };

  const getCustomerDue = (customerId) =>
    invoices.filter((i) => i.customerId === customerId && i.due > 0).reduce((acc, i) => acc + i.due, 0);

  return (
    <div className="app-container customer-info-page">
      <div className="customer-info-header">
        <button onClick={() => navigate("/")} className="customer-info-back-btn"><ArrowLeft size={20} /></button>
        <div>
          <div className="customer-info-title">Customers</div>
          <div className="customer-info-subtitle">{customers.length} customers</div>
        </div>
      </div>

      <div className="customer-info-search">
        <input type="text" placeholder="Search by name, mobile or email..." value={search}
          onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="customer-info-list">
        {filtered.map((customer) => {
          const due = getCustomerDue(customer.id);
          const isEditing = editingId === customer.id;
          return (
            <div key={customer.id} className="card customer-info-card">
              {isEditing ? (
                <>
                  <div className="customer-info-edit-header">
                    <span className="customer-info-edit-label">Editing Customer</span>
                    <button onClick={() => setEditingId(null)} className="customer-info-edit-close"><X size={18} /></button>
                  </div>
                  <div className="customer-info-edit-form-group">
                    <label>Name</label>
                    <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                  </div>
                  <div className="customer-info-edit-form-group">
                    <label>Mobile</label>
                    <input type="text" value={editForm.mobile} onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })} />
                  </div>
                  <div className="customer-info-edit-form-group">
                    <label>Email</label>
                    <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                  </div>
                  <div className="customer-info-edit-form-group">
                    <label>Address</label>
                    <input type="text" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
                  </div>
                  <button onClick={saveEdit} className="customer-info-save-btn">
                    <Save size={15} /> Save Changes
                  </button>
                </>
              ) : (
                <>
                  <div className="customer-info-view-header">
                    <div className="customer-info-view-details">
                      <div className="customer-info-view-name">{customer.name}</div>
                      <div className="customer-info-view-row">
                        <Phone size={12} color="var(--text-secondary)" />
                        <span className="customer-info-view-text">{customer.mobile}</span>
                      </div>
                      {customer.email && (
                        <div className="customer-info-view-row">
                          <Mail size={12} color="var(--text-secondary)" />
                          <span className="customer-info-view-text">{customer.email}</span>
                        </div>
                      )}
                      {customer.address && (
                        <div className="customer-info-view-row">
                          <MapPin size={12} color="var(--text-secondary)" style={{ marginTop: "1px" }} />
                          <span className="customer-info-view-text-sm">{customer.address}</span>
                        </div>
                      )}
                    </div>
                    <button onClick={() => startEdit(customer)} className="customer-info-edit-btn">
                      <Edit2 size={16} color="var(--primary)" />
                    </button>
                  </div>

                  <div className="customer-info-stats">
                    <div className="customer-info-stat">
                      <div className="customer-info-stat-val">{customer.totalOrders}</div>
                      <div className="customer-info-stat-label">Orders</div>
                    </div>
                    <div className="customer-info-stat customer-info-stat-border">
                      <div className="customer-info-stat-val">৳{customer.totalSpent}</div>
                      <div className="customer-info-stat-label">Spent</div>
                    </div>
                    <div className="customer-info-stat">
                      <div className={`customer-info-stat-val ${due > 0 ? "customer-info-stat-due-warn" : "customer-info-stat-due-ok"}`}>৳{due}</div>
                      <div className="customer-info-stat-label">Due</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="customer-info-empty">
            <div className="customer-info-empty-icon">👥</div>
            <p>No customers found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerInfoPage;
