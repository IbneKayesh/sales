
const QuantitySelector = ({ quantity, onChange, min = 1, max = 99 }) => {
  const handleDecrease = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= min && value <= max) {
      onChange(value);
    }
  };

  return (
    <div className="quantity-selector" role="group" aria-label="Quantity">
      <button
        className="quantity-btn"
        onClick={handleDecrease}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <input
        type="number"
        className="quantity-input"
        value={quantity}
        onChange={handleInputChange}
        min={min}
        max={max}
        aria-label="Quantity"
      />
      <button
        className="quantity-btn"
        onClick={handleIncrease}
        disabled={quantity >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
