import { useState } from 'react';
import DetailCard from './DetailCard';

// ─── Inline form for editing inside the panel ─────────────────

function InlineForm({ fields, initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => {
    const defaults = {};
    fields.forEach(f => {
      defaults[f.key] = initialData[f.key] !== undefined ? initialData[f.key] : (f.default || '');
    });
    return defaults;
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
    } catch {
      // Parent handles errors
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
          <div className="panel-form-field" key={field.key}>
            <label className="panel-form-label">
              {field.label}
              {field.required && <span className="form-required">*</span>}
            </label>
            <select
              className={`panel-form-input ${error ? 'has-error' : ''}`}
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
          <div className="panel-form-field" key={field.key}>
            <label className="panel-form-label">
              {field.label}
              {field.required && <span className="form-required">*</span>}
            </label>
            <textarea
              className={`panel-form-input panel-form-textarea ${error ? 'has-error' : ''}`}
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
          <div className="panel-form-field" key={field.key}>
            <label className="panel-form-label">
              {field.label}
              {field.required && <span className="form-required">*</span>}
            </label>
            <input
              type="number"
              className={`panel-form-input ${error ? 'has-error' : ''}`}
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
          <div className="panel-form-field" key={field.key}>
            <label className="panel-form-label">
              {field.label}
              {field.required && <span className="form-required">*</span>}
            </label>
            <input
              type={field.type || 'text'}
              className={`panel-form-input ${error ? 'has-error' : ''}`}
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
    <form className="panel-form" onSubmit={handleSubmit}>
      <div className="panel-form-header">
        <h3 className="panel-form-title">Edit Details</h3>
        <span className="panel-form-id">{initialData?.id}</span>
      </div>
      <div className="panel-form-fields">
        {fields.map(renderField)}
      </div>
      <div className="panel-form-actions">
        <button type="button" className="panel-form-btn panel-form-btn-cancel" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="panel-form-btn panel-form-btn-save" disabled={submitting}>
          {submitting ? (
            <span className="btn-loading">
              <span className="spinner" />
              Saving...
            </span>
          ) : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

// ─── Panel detail with inline editing ─────────────────────────

export default function PanelDetail({ item, fields, formFields, title, status, onBack, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);

  const handleSave = async (formData) => {
    await onSave(formData);
    setEditing(false);
  };

  if (editing) {
    return (
      <InlineForm
        fields={formFields}
        initialData={item}
        onSubmit={handleSave}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <DetailCard
      item={item}
      fields={fields}
      title={title}
      status={status}
      onBack={onBack}
      actions={
        <div className="panel-detail-actions">
          <button className="btn-primary" onClick={() => setEditing(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </button>
          {onDelete && (
            <button type="button" className="detail-btn-danger" onClick={onDelete}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Delete
            </button>
          )}
          <button type="button" className="panel-form-btn panel-form-btn-cancel" onClick={onBack} style={{ marginLeft: 'auto' }}>
            Close
          </button>
        </div>
      }
    />
  );
}
