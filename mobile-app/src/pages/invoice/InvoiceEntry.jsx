import React, { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InvoiceEntry = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([{ id: 1, name: "", qty: 1, price: 0 }]);
  const [customer, setCustomer] = useState("");

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", qty: 1, price: 0 }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const subtotal = items.reduce((acc, item) => acc + item.qty * item.price, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleSave = (e) => {
    e.preventDefault();
    // In a real app, save to DB here
    navigate("/invoice/view/INV-1001");
  };

  return (
    <div className="app-container">
      <div className="card">
        <h2
          style={{
            fontSize: "20px",
            marginBottom: "16px",
            color: "var(--on-background)",
          }}
        >
          New Invoice
        </h2>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              placeholder="Enter customer name"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              required
            />
          </div>

          <div style={{ marginTop: "16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <h4 style={{ margin: 0 }}>Items</h4>
              <button
                type="button"
                onClick={addItem}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontWeight: 600,
                }}
              >
                <Plus size={18} /> Add Item
              </button>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "10px",
                  background: "var(--background)",
                  borderRadius: "8px",
                  marginBottom: "8px",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="form-group" style={{ marginBottom: "10px" }}>
                  <input
                    type="text"
                    placeholder="Item name"
                    value={item.name}
                    onChange={(e) =>
                      updateItem(item.id, "name", e.target.value)
                    }
                    required
                  />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: "11px", marginBottom: "2px" }}>
                      Qty
                    </label>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "qty",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      required
                    />
                  </div>
                  <div style={{ flex: 2 }}>
                    <label style={{ fontSize: "11px", marginBottom: "2px" }}>
                      Price
                    </label>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "price",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--error)",
                      padding: "24px 8px 0",
                    }}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "16px",
              borderTop: "1px solid var(--border)",
              paddingTop: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span>Tax (5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                fontSize: "18px",
                marginTop: "12px",
                color: "var(--primary)",
              }}
            >
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <Save size={20} /> Create Invoice
          </button>
        </form>
      </div>
    </div>
  );
};

export default InvoiceEntry;
