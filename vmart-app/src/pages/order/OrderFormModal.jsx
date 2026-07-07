import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import SearchableSelect from "../../components/SearchableSelect";
import { calcSubtotal } from "../../utils/helpers";

const defaultProduct = { name: "", qty: 1, price: 0, discount: 0 };

const statusOptions = [
  "pending",
  "in_process",
  "delivered_to_courier",
  "delivered",
];
const paymentOptions = ["due", "partial_paid", "paid"];

export default function OrderFormModal({
  editingOrderId,
  closeModal,
  shops,
  orderShop,
  setOrderShop,
  savedCustomers,
  customer,
  setCustomer,
  savedProducts,
  products,
  setProducts,
  orderStatus,
  setOrderStatus,
  paymentStatus,
  setPaymentStatus,
  paidAmount,
  setPaidAmount,
  deliveryCharge,
  setDeliveryCharge,
  itemsTotal,
  grandTotal,
  saveOrder,
  isBusy,
}) {
  const handleCustomerSelect = (name) => {
    const found = savedCustomers.find((c) => c.name === name);
    setCustomer(
      found
        ? {
            name: found.name,
            contact: found.contact || "",
            address: found.address || "",
          }
        : { name: "", contact: "", address: "" },
    );
  };

  const handleCustomerField = (field, value) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductSelect = (index, name) => {
    const found = savedProducts.find((p) => p.name === name);
    setProducts((prev) => {
      const next = [...prev];
      if (found) {
        next[index] = {
          name: found.name,
          qty: 1,
          price: found.price || 0,
          discount: found.discount || 0,
        };
      } else {
        next[index] = { ...defaultProduct };
      }
      return next;
    });
  };

  const handleProductField = (index, field, value) => {
    setProducts((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addProduct = () =>
    setProducts((prev) => [...prev, { ...defaultProduct }]);
  const removeProduct = (index) =>
    setProducts((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="order-modal-overlay" onClick={closeModal}>
      <div className="order-modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="order-modal-header">
          <h3 className="order-modal-title">
            {editingOrderId ? "Edit Order" : "New Order"}
          </h3>
          <button className="order-modal-close" onClick={closeModal}>
            <FiX />
          </button>
        </div>

        <div className="order-form-body">
          {/* Shop */}
          <div>
            <h4 className="order-section-title">Shop / Vendor</h4>
            <div className="ui-form-field">
              <div className="ui-select-wrapper">
                <select
                  className="ui-select"
                  value={orderShop}
                  onChange={(e) => setOrderShop(e.target.value)}
                >
                  <option value="">Select shop (optional)</option>
                  {shops.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div>
            <h4 className="order-section-title">Customer Details</h4>
            <div className="order-customer-fields">
              <div className="ui-form-field order-field-margin-zero">
                <label className="ui-form-label" htmlFor="order-customer-name">
                  Customer Name
                </label>
                <SearchableSelect
                  id="order-customer"
                  value={customer.name}
                  onChange={handleCustomerSelect}
                  options={savedCustomers.map((c) => c.name)}
                  placeholder="Search customers..."
                />
              </div>
              <div className="ui-form-field order-field-margin-zero">
                <label className="ui-form-label" htmlFor="order-contact">
                  Contact No
                </label>
                <input
                  type="tel"
                  id="order-contact"
                  className="ui-input"
                  placeholder="Phone number"
                  value={customer.contact}
                  onChange={(e) =>
                    handleCustomerField("contact", e.target.value)
                  }
                />
              </div>
              <div className="ui-form-field order-field-margin-zero">
                <label className="ui-form-label" htmlFor="order-address">
                  Address
                </label>
                <textarea
                  id="order-address"
                  className="ui-textarea"
                  placeholder="Delivery address"
                  rows={2}
                  value={customer.address}
                  onChange={(e) =>
                    handleCustomerField("address", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <div className="order-products-header">
              <h4 className="order-section-title order-section-title--no-margin">
                Products
              </h4>
              <button
                className="ui-btn ui-btn-secondary order-add-product-btn"
                onClick={addProduct}
              >
                <FiPlus /> Add Product
              </button>
            </div>
            <div className="order-products-list">
              {products.map((item, idx) => (
                <div key={idx} className="order-product-card">
                  <div className="order-product-card-header">
                    <div className="ui-form-field order-field-flex">
                      <label
                        className="ui-form-label"
                        htmlFor={`order-product-${idx}`}
                      >
                        Product
                      </label>
                      <SearchableSelect
                        id={`order-product-${idx}`}
                        value={item.name}
                        onChange={(name) => handleProductSelect(idx, name)}
                        options={savedProducts
                          .filter((p) => p.inStock !== false)
                          .map((p) => p.name)}
                        placeholder="Search products..."
                      />
                    </div>
                    {products.length > 1 && (
                      <button
                        className="order-product-remove-btn"
                        onClick={() => removeProduct(idx)}
                        aria-label="Remove product"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                  <div className="order-product-fields">
                    <div className="ui-form-field">
                      <label
                        className="ui-form-label"
                        htmlFor={`order-qty-${idx}`}
                      >
                        Qty
                      </label>
                      <input
                        type="number"
                        id={`order-qty-${idx}`}
                        className="ui-input"
                        min={1}
                        value={item.qty}
                        onChange={(e) =>
                          handleProductField(
                            idx,
                            "qty",
                            Math.max(1, Number(e.target.value)),
                          )
                        }
                      />
                    </div>
                    <div className="ui-form-field">
                      <label
                        className="ui-form-label"
                        htmlFor={`order-price-${idx}`}
                      >
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        id={`order-price-${idx}`}
                        className="ui-input"
                        min={0}
                        step={0.01}
                        placeholder="0.00"
                        value={item.price || ""}
                        onChange={(e) =>
                          handleProductField(
                            idx,
                            "price",
                            Number(e.target.value) || 0,
                          )
                        }
                      />
                    </div>
                    <div className="ui-form-field">
                      <label
                        className="ui-form-label"
                        htmlFor={`order-discount-${idx}`}
                      >
                        Discount (%)
                      </label>
                      <input
                        type="number"
                        id={`order-discount-${idx}`}
                        className="ui-input"
                        min={0}
                        max={100}
                        placeholder="0"
                        value={item.discount || ""}
                        onChange={(e) =>
                          handleProductField(
                            idx,
                            "discount",
                            Number(e.target.value) || 0,
                          )
                        }
                      />
                    </div>
                    <div className="ui-form-field">
                      <label
                        className="ui-form-label"
                        htmlFor={`order-subtotal-${idx}`}
                      >
                        Subtotal
                      </label>
                      <div className="order-subtotal-display">
                        ₹{calcSubtotal(item).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <h4 className="order-section-title">Status</h4>
            <div className="order-status-fields">
              <div className="ui-form-field order-status-field">
                <label className="ui-form-label" htmlFor="order-status">
                  Order Status
                </label>
                <div className="ui-select-wrapper">
                  <select
                    id="order-status"
                    className="ui-select"
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="ui-form-field order-status-field">
                <label className="ui-form-label" htmlFor="order-payment-status">
                  Payment Status
                </label>
                <div className="ui-select-wrapper">
                  <select
                    id="order-payment-status"
                    className="ui-select"
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                  >
                    {paymentOptions.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {paymentStatus === "partial_paid" && (
                <div className="ui-form-field order-status-field">
                  <label className="ui-form-label" htmlFor="order-paid-amount">
                    Paid Amount (₹)
                  </label>
                  <input
                    type="number"
                    id="order-paid-amount"
                    className="ui-input"
                    min={0}
                    step={0.01}
                    value={paidAmount || ""}
                    onChange={(e) => setPaidAmount(Number(e.target.value) || 0)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="order-summary-card">
            <h4 className="order-section-title order-section-title--summary">
              Order Summary
            </h4>
            <div className="order-summary-rows">
              {products
                .filter((p) => p.name)
                .map((item, idx) => (
                  <div key={idx} className="order-summary-item">
                    <span className="order-summary-item-name">
                      {item.name} × {item.qty}
                      {item.discount > 0 && (
                        <span className="order-summary-discount">
                          {" "}
                          (-{item.discount}%)
                        </span>
                      )}
                    </span>
                    <span className="order-summary-item-amount">
                      ₹{calcSubtotal(item).toFixed(2)}
                    </span>
                  </div>
                ))}
              <div className="order-summary-divider" />
              <div className="order-summary-item">
                <span className="order-summary-item-name">Items Total</span>
                <span className="order-summary-item-amount">
                  ₹{itemsTotal.toFixed(2)}
                </span>
              </div>
              <div className="order-delivery-row">
                <span className="order-summary-item-name">Delivery Charge</span>
                <div className="ui-form-field order-delivery-input">
                  <input
                    type="number"
                    id="order-delivery-charge"
                    className="ui-input"
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    value={deliveryCharge || ""}
                    onChange={(e) =>
                      setDeliveryCharge(Number(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
              <div className="order-summary-divider" />
              <div className="order-grand-total-col">
                <span className="order-grand-total-label">Grand Total</span>
                <span className="order-grand-total-value order-grand-total-lg">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="order-form-actions">
            <button
              className="ui-btn ui-btn-secondary order-form-btn"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="ui-btn ui-btn-primary order-form-btn"
              onClick={saveOrder}
              disabled={!customer.name.trim() || isBusy}
            >
              {editingOrderId ? "Update Order" : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
