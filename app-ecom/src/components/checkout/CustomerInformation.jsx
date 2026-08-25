
const CustomerInformation = ({ formData, errors, onChange }) => {
  return (
    <div className="checkout-section">
      <h3 className="checkout-section-title">Customer Information</h3>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="fullName" className="form-label">
            Full Name <span className="required">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            className={`form-input ${errors.fullName ? 'form-input-error' : ''}`}
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
          />
          {errors.fullName && <span className="form-error">{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            Phone Number <span className="required">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            className={`form-input ${errors.phone ? 'form-input-error' : ''}`}
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
          />
          {errors.phone && <span className="form-error">{errors.phone}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email (Optional)
        </label>
        <input
          id="email"
          type="email"
          className="form-input"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
        />
      </div>
    </div>
  );
};

export default CustomerInformation;
