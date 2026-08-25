import { Link } from 'react-router-dom';
import { CheckIcon } from '@/icons';

const StepNav = ({ current }) => {
  return (
    <div className="step-nav">
      <Link
        to="/cart"
        className={`step-nav-item ${current === 'cart' ? 'active' : ''} ${current === 'checkout' ? 'completed' : ''}`}
      >
        <span className="step-nav-number">{current === 'checkout' ? <CheckIcon size={14} /> : '1'}</span>
        <span className="step-nav-label">Cart</span>
      </Link>

      <div className={`step-nav-line ${current === 'checkout' || current === 'confirmation' ? 'filled' : ''}`} />

      <Link
        to="/checkout"
        className={`step-nav-item ${current === 'checkout' ? 'active' : ''} ${current === 'confirmation' ? 'completed' : ''} ${current === 'cart' ? 'disabled' : ''}`}
        onClick={(e) => { if (current === 'cart') e.preventDefault(); }}
      >
        <span className="step-nav-number">{current === 'confirmation' ? <CheckIcon size={14} /> : '2'}</span>
        <span className="step-nav-label">Checkout</span>
      </Link>

      <div className={`step-nav-line ${current === 'confirmation' ? 'filled' : ''}`} />

      <div className={`step-nav-item ${current === 'confirmation' ? 'active' : ''}`}>
        <span className="step-nav-number">3</span>
        <span className="step-nav-label">Confirmation</span>
      </div>
    </div>
  );
};

export default StepNav;
