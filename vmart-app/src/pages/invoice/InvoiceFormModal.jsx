import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import SearchableSelect from "../../components/SearchableSelect";
import { calcSubtotal } from "../../utils/helpers";

const defaultProduct = { name: "", qty: 1, price: 0, discount: 0 };
const emptyCustomer = { name: "", contact: "", address: "" };
const statusOptions = ["draft", "in_process", "delivered_to_courier", "delivered"];
const paymentOptions = ["due", "partial_paid", "paid"];

export default function InvoiceFormModal({
  editingId,
  closeModal,
  customers,
  customer,
  setCustomer,
  items,
  setItems,
  invStatus,
  setInvStatus,
  paymentStatus,
  setPaymentStatus,
  paidAmount,
  setPaidAmount,
  deliveryAgent,
  setDeliveryAgent,
  deliveryCharge,
  setDeliveryCharge,
  grandTotal,
  products,
  saveInvoice,
  isBusy,
}) {
  return (
    <div className="inv-modal-overlay" onClick={closeModal}>
      <div className="inv-modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="inv-modal-header">
          <h3 className="inv-modal-title">{editingId ? "Edit Invoice" : "New Invoice"}</h3>
          <button onClick={closeModal} className="inv-modal-close"><FiX /></button>
        </div>
        <div className="inv-form-body">
          {/* Customer */}
          <div>
            <h4 className="inv-section-title">Customer</h4>
            <div className="inv-customer-fields">
              <SearchableSelect id="invoice-customer" value={customer.name}
                onChange={(name) => {
                  const found = customers.find((c) => c.name === name);
                  setCustomer(found ? { name: found.name, contact: found.contact || "", address: found.address || "" } : { ...emptyCustomer });
                }}
                options={customers.map((c) => c.name)} placeholder="Search customers..." />
              <input type="tel" id="invoice-contact" name="invoice-contact" className="ui-input" placeholder="Contact"
                value={customer.contact} onChange={(e) => setCustomer((p) => ({ ...p, contact: e.target.value }))} />
              <textarea id="invoice-address" name="invoice-address" className="ui-textarea" placeholder="Address" rows={2}
                value={customer.address} onChange={(e) => setCustomer((p) => ({ ...p, address: e.target.value }))} />
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="inv-items-header-row">
              <h4 className="inv-section-title inv-section-title--no-margin">Items</h4>
              <button className="ui-btn ui-btn-secondary inv-small-btn"
                onClick={() => setItems((p) => [...p, { ...defaultProduct }])}>
                <FiPlus /> Add Item
              </button>
            </div>
            <div className="inv-item-list">
              {items.map((item, idx) => (
                <div key={idx} className="inv-item-card">
                  <div className="inv-item-row-header">
                    <div className="ui-form-field inv-field-flex">
                      <label className="ui-form-label" htmlFor={`invoice-item-${idx}`}>Item</label>
                      <SearchableSelect id={`invoice-item-${idx}`} value={item.name}
                        onChange={(name) => {
                          const found = products.find((p) => p.name === name);
                          setItems((prev) => {
                            const n = [...prev];
                            n[idx] = found
                              ? { name: found.name, qty: 1, price: found.price || 0, discount: found.discount || 0 }
                              : { ...defaultProduct };
                            return n;
                          });
                        }}
                        options={products.filter((p) => p.inStock !== false).map((p) => p.name)}
                        placeholder="Search products..." />
                    </div>
                    {items.length > 1 && (
                      <button onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                        className="inv-item-remove-btn"><FiTrash2 /></button>
                    )}
                  </div>
                  <div className="inv-item-fields">
                    <div className="ui-form-field">
                      <label className="ui-form-label" htmlFor={`invoice-qty-${idx}`}>Qty</label>
                      <input type="number" id={`invoice-qty-${idx}`} name={`invoice-qty-${idx}`} className="ui-input" min={1} value={item.qty}
                        onChange={(e) => setItems((prev) => {
                          const n = [...prev];
                          n[idx] = { ...n[idx], qty: Math.max(1, Number(e.target.value)) };
                          return n;
                        })} />
                    </div>
                    <div className="ui-form-field">
                      <label className="ui-form-label" htmlFor={`invoice-price-${idx}`}>Price</label>
                      <input type="number" id={`invoice-price-${idx}`} name={`invoice-price-${idx}`} className="ui-input" min={0} step={0.01}
                        value={item.price || ""} onChange={(e) => setItems((prev) => {
                          const n = [...prev];
                          n[idx] = { ...n[idx], price: Number(e.target.value) || 0 };
                          return n;
                        })} />
                    </div>
                    <div className="ui-form-field">
                      <label className="ui-form-label" htmlFor={`invoice-discount-${idx}`}>Disc %</label>
                      <input type="number" id={`invoice-discount-${idx}`} name={`invoice-discount-${idx}`} className="ui-input" min={0} max={100}
                        value={item.discount || ""} onChange={(e) => setItems((prev) => {
                          const n = [...prev];
                          n[idx] = { ...n[idx], discount: Number(e.target.value) || 0 };
                          return n;
                        })} />
                    </div>
                  </div>
                  <div className="inv-item-subtotal">₹{calcSubtotal(item).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Status & Payment */}
          <div>
            <h4 className="inv-section-title">Status & Payment</h4>
            <div className="inv-status-payment-row">
              <div className="ui-form-field inv-status-field">
                <label className="ui-form-label" htmlFor="invoice-status">Status</label>
                <div className="ui-select-wrapper">
                  <select id="invoice-status" name="invoice-status" className="ui-select" value={invStatus}
                    onChange={(e) => setInvStatus(e.target.value)}>
                    {statusOptions.map((s) => (<option key={s} value={s}>{s.replace(/_/g, " ")}</option>))}
                  </select>
                </div>
              </div>
              <div className="ui-form-field inv-status-field">
                <label className="ui-form-label" htmlFor="invoice-payment">Payment</label>
                <div className="ui-select-wrapper">
                  <select id="invoice-payment" name="invoice-payment" className="ui-select" value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}>
                    {paymentOptions.map((s) => (<option key={s} value={s}>{s.replace(/_/g, " ")}</option>))}
                  </select>
                </div>
              </div>
              {paymentStatus === "partial_paid" && (
                <div className="ui-form-field inv-field-sm">
                  <label className="ui-form-label" htmlFor="invoice-paid">Paid (₹)</label>
                  <input type="number" id="invoice-paid" name="invoice-paid" className="ui-input" min={0} step={0.01}
                    value={paidAmount || ""} onChange={(e) => setPaidAmount(Number(e.target.value) || 0)} />
                </div>
              )}
            </div>
            <div className="inv-delivery-row">
              <div className="ui-form-field inv-field-md">
                <label className="ui-form-label" htmlFor="invoice-delivery-agent">Delivery Agent</label>
                <input type="text" id="invoice-delivery-agent" name="invoice-delivery-agent" className="ui-input"
                  placeholder="Delivery partner name" value={deliveryAgent}
                  onChange={(e) => setDeliveryAgent(e.target.value)} />
              </div>
              <div className="ui-form-field inv-field-sm">
                <label className="ui-form-label" htmlFor="invoice-delivery-charge">Delivery Charge (₹)</label>
                <input type="number" id="invoice-delivery-charge" name="invoice-delivery-charge" className="ui-input" min={0} step={0.01}
                  value={deliveryCharge || ""} onChange={(e) => setDeliveryCharge(Number(e.target.value) || 0)} />
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="inv-total-box">
            <div className="inv-total-display">
              <span className="inv-total-label-bold">Total</span>
              <span className="inv-total-amount">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="inv-form-actions">
            <button className="ui-btn ui-btn-secondary inv-form-btn" onClick={closeModal}>Cancel</button>
            <button className="ui-btn ui-btn-primary inv-form-btn" onClick={saveInvoice} disabled={!customer.name.trim() || isBusy}>
              {editingId ? "Update Invoice" : "Create Invoice"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
