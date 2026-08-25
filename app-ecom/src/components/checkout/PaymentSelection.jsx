
const PaymentSelection = ({ paymentMethod, onChange, errors }) => {
  return (
    <div className="checkout-section">
      <h3 className="checkout-section-title">Payment Method</h3>

      <div className="payment-options">
        <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            checked={paymentMethod === 'cod'}
            onChange={(e) => onChange(e.target.value)}
            className="payment-option-radio"
          />
          <div className="payment-option-content">
            <span className="payment-option-icon">💵</span>
            <div className="payment-option-text">
              <span className="payment-option-name">Cash on Delivery</span>
              <span className="payment-option-desc">Pay when you receive your order</span>
            </div>
          </div>
        </label>

        <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === 'card'}
            onChange={(e) => onChange(e.target.value)}
            className="payment-option-radio"
          />
          <div className="payment-option-content">
            <span className="payment-option-icon">💳</span>
            <div className="payment-option-text">
              <span className="payment-option-name">Card / Online Payment</span>
              <span className="payment-option-desc">Demo only - no real payment processed</span>
            </div>
          </div>
        </label>
      </div>
      {errors.paymentMethod && <span className="form-error">{errors.paymentMethod}</span>}
    </div>
  );
};

export default PaymentSelection;
