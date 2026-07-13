import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderFormFields } from './salesConfig';
import { useToast } from '../../components/ui/Toast';

export default function NewOrderPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState(() => {
    const d = {};
    orderFormFields.forEach(f => {
      d[f.key] = f.default || '';
    });
    d.date = new Date().toISOString().split('T')[0];
    return d;
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  const validate = () => {
    const newErrors = {};
    orderFormFields.forEach(f => {
      if (f.required && !form[f.key] && form[f.key] !== 0) {
        newErrors[f.key] = `${f.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));

    const newId = `ORD-${String(Date.now()).slice(-4)}`;
    toast.success(`Order ${newId} created successfully`, {
      action: { label: 'View Orders', onClick: () => navigate('/sales') }
    });

    setSubmitting(false);
    navigate('/sales');
  };

  const renderField = (field) => {
    const val = form[field.key] ?? '';
    const error = errors[field.key];

    if (field.type === 'select') {
      return (
        <div className="form-field" key={field.key}>
          <label className="form-label">
            {field.label}
            {field.required && <span className="form-required">*</span>}
          </label>
          <select
            className={`form-select ${error ? 'has-error' : ''}`}
            value={val}
            onChange={(e) => handleChange(field.key, e.target.value)}
            disabled={submitting}
          >
            <option value="">Select {field.label}</option>
            {(field.options || []).map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {error && <span className="form-error">{error}</span>}
        </div>
      );
    }

    if (field.type === 'number') {
      return (
        <div className="form-field" key={field.key}>
          <label className="form-label">
            {field.label}
            {field.required && <span className="form-required">*</span>}
          </label>
          <input
            type="number"
            className={`form-input ${error ? 'has-error' : ''}`}
            value={val}
            onChange={(e) => handleChange(field.key, e.target.value === '' ? '' : Number(e.target.value))}
            placeholder={field.placeholder || `Enter ${field.label}`}
            min={field.min}
            disabled={submitting}
          />
          {error && <span className="form-error">{error}</span>}
        </div>
      );
    }

    return (
      <div className="form-field" key={field.key}>
        <label className="form-label">
          {field.label}
          {field.required && <span className="form-required">*</span>}
        </label>
        <input
          type={field.type || 'text'}
          className={`form-input ${error ? 'has-error' : ''}`}
          value={val}
          onChange={(e) => handleChange(field.key, e.target.value)}
          placeholder={field.placeholder || `Enter ${field.label}`}
          disabled={submitting}
        />
        {error && <span className="form-error">{error}</span>}
      </div>
    );
  };

  return (
    <div className="subpage-container">
      <div className="subpage-header">
        <button className="btn-ghost" onClick={() => navigate('/sales')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Sales
        </button>
        <h2>New Sales Order</h2>
      </div>

      <div className="subpage-card">
        <div className="subpage-card-header">
          <h3>Order Details</h3>
          <p>Fill in the details below to create a new sales order</p>
        </div>
        <form className="subpage-form" onSubmit={handleSubmit}>
          <div className="subpage-form-grid">
            {orderFormFields.map(renderField)}
          </div>
          <div className="subpage-form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/sales')} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? (
                <span className="btn-loading">
                  <span className="spinner" />
                  Creating Order...
                </span>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Create Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
