
const BillingInformation = ({ formData, errors, onChange }) => {
  const handleSameAsDelivery = (e) => {
    onChange('sameAsDelivery', e.target.checked);
  };

  return (
    <div className="checkout-section">
      <h3 className="checkout-section-title">Billing Information</h3>

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={formData.sameAsDelivery}
          onChange={handleSameAsDelivery}
          className="checkbox-input"
        />
        <span className="checkbox-text">Billing address same as delivery address</span>
      </label>

      {!formData.sameAsDelivery && (
        <div className="billing-form">
          <div className="form-group">
            <label htmlFor="billingName" className="form-label">
              Billing Name <span className="required">*</span>
            </label>
            <input
              id="billingName"
              type="text"
              className={`form-input ${errors.billingName ? 'form-input-error' : ''}`}
              placeholder="Enter billing name"
              value={formData.billingName}
              onChange={(e) => onChange('billingName', e.target.value)}
            />
            {errors.billingName && <span className="form-error">{errors.billingName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="billingAddress" className="form-label">
              Billing Address <span className="required">*</span>
            </label>
            <input
              id="billingAddress"
              type="text"
              className={`form-input ${errors.billingAddress ? 'form-input-error' : ''}`}
              placeholder="Enter billing address"
              value={formData.billingAddress}
              onChange={(e) => onChange('billingAddress', e.target.value)}
            />
            {errors.billingAddress && <span className="form-error">{errors.billingAddress}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="billingCity" className="form-label">
                City <span className="required">*</span>
              </label>
              <input
                id="billingCity"
                type="text"
                className={`form-input ${errors.billingCity ? 'form-input-error' : ''}`}
                placeholder="Enter billing city"
                value={formData.billingCity}
                onChange={(e) => onChange('billingCity', e.target.value)}
              />
              {errors.billingCity && <span className="form-error">{errors.billingCity}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="billingPostalCode" className="form-label">
                Postal/ZIP Code
              </label>
              <input
                id="billingPostalCode"
                type="text"
                className="form-input"
                placeholder="Enter postal code"
                value={formData.billingPostalCode}
                onChange={(e) => onChange('billingPostalCode', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingInformation;
