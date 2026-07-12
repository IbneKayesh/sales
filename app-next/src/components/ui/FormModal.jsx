import { useState, useEffect } from 'react';
import Modal from './Modal';

export default function FormModal({
  open,
  onClose,
  onSubmit,
  title,
  fields,
  initialData = {},
  submitLabel = 'Save',
  size = 520,
}) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      const defaults = {};
      fields.forEach(f => {
        defaults[f.key] = initialData[f.key] !== undefined ? initialData[f.key] : (f.default || '');
      });
      setForm(defaults);
      setErrors({});
      setSubmitting(false);
    }
  }, [open, fields, initialData]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    fields.forEach(f => {
      if (f.required && !form[f.key] && form[f.key] !== 0) {
        newErrors[f.key] = `${f.label} is required`;
      }
      if (f.validate) {
        const err = f.validate(form[f.key], form);
        if (err) newErrors[f.key] = err;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      // Error is handled by parent
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field) => {
    const val = form[field.key] !== undefined ? form[field.key] : '';
    const error = errors[field.key];

    switch (field.type) {
      case 'select':
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
                <option key={typeof opt === 'object' ? opt.value : opt} value={typeof opt === 'object' ? opt.value : opt}>
                  {typeof opt === 'object' ? opt.label : opt}
                </option>
              ))}
            </select>
            {error && <span className="form-error">{error}</span>}
          </div>
        );

      case 'textarea':
        return (
          <div className="form-field" key={field.key}>
            <label className="form-label">
              {field.label}
              {field.required && <span className="form-required">*</span>}
            </label>
            <textarea
              className={`form-textarea ${error ? 'has-error' : ''}`}
              value={val}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder || `Enter ${field.label}`}
              rows={field.rows || 3}
              disabled={submitting}
            />
            {error && <span className="form-error">{error}</span>}
          </div>
        );

      case 'number':
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
              step={field.step}
              disabled={submitting}
            />
            {error && <span className="form-error">{error}</span>}
          </div>
        );

      default:
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
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={title} width={size}>
      <form className="form-modal" onSubmit={handleSubmit}>
        <div className="form-fields">
          {fields.map(renderField)}
        </div>
        <div className="form-actions">
          <button type="button" className="form-btn form-btn-cancel" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="form-btn form-btn-submit" disabled={submitting}>
            {submitting ? (
              <span className="btn-loading">
                <span className="spinner" />
                Saving...
              </span>
            ) : submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}
