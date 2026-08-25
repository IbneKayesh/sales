const DeliveryInformation = ({ formData, errors, onChange }) => {
  return (
    <div className="checkout-section">
      <h3 className="checkout-section-title">Delivery Information</h3>

      <div className="form-group">
        <label htmlFor="address" className="form-label">
          Delivery Address <span className="required">*</span>
        </label>
        <input
          id="address"
          type="text"
          className={`form-input ${errors.address ? 'form-input-error' : ''}`}
          placeholder="Enter your delivery address"
          value={formData.address}
          onChange={(e) => onChange('address', e.target.value)}
        />
        {errors.address && <span className="form-error">{errors.address}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city" className="form-label">
            City <span className="required">*</span>
          </label>
          <input
            id="city"
            type="text"
            className={`form-input ${errors.city ? 'form-input-error' : ''}`}
            placeholder="Enter your city"
            value={formData.city}
            onChange={(e) => onChange('city', e.target.value)}
          />
          {errors.city && <span className="form-error">{errors.city}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="postalCode" className="form-label">
            Postal/ZIP Code
          </label>
          <input
            id="postalCode"
            type="text"
            className="form-input"
            placeholder="Enter postal code"
            value={formData.postalCode}
            onChange={(e) => onChange('postalCode', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="deliveryInstructions" className="form-label">
          Delivery Instructions (Optional)
        </label>
        <textarea
          id="deliveryInstructions"
          className="form-input"
          placeholder="Any special delivery instructions?"
          rows="3"
          value={formData.deliveryInstructions}
          onChange={(e) => onChange('deliveryInstructions', e.target.value)}
        />
      </div>

      <div className="delivery-per-vendor-note">
        <p>Delivery fees are set by each seller and shown in your order summary.</p>
      </div>
    </div>
  );
};

export default DeliveryInformation;
