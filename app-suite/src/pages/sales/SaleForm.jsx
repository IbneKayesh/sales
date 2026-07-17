import { useState } from 'react';

import { fmtCurrency } from '@/utils/dataFormat';
import './SaleForm.css';
const EMPTY = { customerName: '', product: '', quantity: '', unitPrice: '' };

const SaleForm = ({ initialData, onSubmit }) => {
  const [form, setForm] = useState(
    initialData
      ? { customerName: initialData.customerName, product: initialData.product, quantity: String(initialData.quantity), unitPrice: String(initialData.unitPrice) }
      : EMPTY
  );
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const field = (name) => ({
    value: form[name],
    onChange: (e) => setForm((p) => ({ ...p, [name]: e.target.value })),
  });

  const validate = () => {
    const errs = {};
    if (!form.customerName.trim()) errs.customerName = 'Customer name is required';
    if (!form.product.trim()) errs.product = 'Product is required';
    if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) <= 0) errs.quantity = 'Enter a valid quantity';
    if (!form.unitPrice || isNaN(Number(form.unitPrice)) || Number(form.unitPrice) <= 0) errs.unitPrice = 'Enter a valid unit price';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    try {
      await onSubmit({
        customerName: form.customerName.trim(),
        product: form.product.trim(),
        quantity: Number(form.quantity),
        unitPrice: Number(form.unitPrice),
      });
    } catch {
      setSubmitting(false);
    }
  };

  const preview = Number(form.quantity) && Number(form.unitPrice)
    ? fmtCurrency(Number(form.quantity) * Number(form.unitPrice))
    : null;

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="grid">
        <div className="fieldGroup">
          <label className="label" htmlFor="sf-customer">Customer Name *</label>
          <input id="sf-customer" type="text" className="input" placeholder="e.g. Acme Corp" {...field('customerName')} />
          {errors.customerName && <span className="fieldError">{errors.customerName}</span>}
        </div>

        <div className="fieldGroup">
          <label className="label" htmlFor="sf-product">Product / Service *</label>
          <input id="sf-product" type="text" className="input" placeholder="e.g. Enterprise License" {...field('product')} />
          {errors.product && <span className="fieldError">{errors.product}</span>}
        </div>

        <div className="fieldGroup">
          <label className="label" htmlFor="sf-qty">Quantity *</label>
          <input id="sf-qty" type="number" min="1" className="input" placeholder="1" {...field('quantity')} />
          {errors.quantity && <span className="fieldError">{errors.quantity}</span>}
        </div>

        <div className="fieldGroup">
          <label className="label" htmlFor="sf-price">Unit Price (USD) *</label>
          <input id="sf-price" type="number" min="0.01" step="0.01" className="input" placeholder="0.00" {...field('unitPrice')} />
          {errors.unitPrice && <span className="fieldError">{errors.unitPrice}</span>}
        </div>
      </div>

      {preview && (
        <div className="preview">
          <span className="previewLabel">Total</span>
          <span className="previewValue">{preview}</span>
        </div>
      )}

      <div className="actions">
        <button type="submit" className="submitBtn" disabled={submitting}>
          {submitting ? (
            <span className="spinner" />
          ) : (
            initialData ? 'Save Changes' : 'Create Sale'
          )}
        </button>
      </div>
    </form>
  );
};

export default SaleForm;
