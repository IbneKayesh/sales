import React, { useState, useEffect } from "react";
import { ArrowLeft, CardSim, Save, X } from "lucide-react";
import { Card } from "primereact/card";

const OutletFormComp = ({ outlet, handleBack, handleCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    tag: "Regular",
  });

  useEffect(() => {
    if (outlet) {
      setFormData({
        name: outlet.name || "",
        email: outlet.email || "",
        phone: outlet.phone || "",
        address: outlet.address || "",
        tag: outlet.tag || "Regular",
      });
    }
  }, [outlet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving outlet data:", formData);
    // In a real app, call an API here
    handleBack();
  };

  return (
    <div className="app-content">
      {/* Header */}
      <div className="view-header">
        <button onClick={handleCancel} className="header-btn-ghost">
          <X size={20} />
        </button>
        <span className="view-title">
          {outlet ? "Edit Outlet" : "New Outlet"}
        </span>
        <button onClick={handleSubmit} className="btn-save">
          <Save size={18} />
          Save
        </button>
      </div>

      <div style={{ padding: "16px" }}>
        <form onSubmit={handleSubmit} className="card">
          <div className="grid">
            <div className="col-12">
              <div className="form-group">
                <label className="form-label">Outlet Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter outlet name"
                  required
                />
              </div>
            </div>

            <div className="col-12">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </div>
            </div>

            <div className="col-12">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="col-12">
              <div className="form-group">
                <label className="form-label">Tag</label>
                <select
                  name="tag"
                  className="form-select"
                  value={formData.tag}
                  onChange={handleChange}
                >
                  <option value="Regular">Regular</option>
                  <option value="VIP">VIP</option>
                  <option value="New">New</option>
                </select>
              </div>
            </div>

            <div className="col-12">
              <div className="form-group">
                <label className="form-label">Full Address</label>
                <textarea
                  name="address"
                  className="form-textarea"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  rows="4"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OutletFormComp;
