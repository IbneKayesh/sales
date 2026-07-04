import { Minus, Plus, Trash2 } from "lucide-react";
import "./shared.css";

const QtyStepper = ({ qty, onDecrease, onIncrease, onRemove, size = 14 }) => (
  <div className="ui-qty-stepper">
    <button type="button" onClick={onDecrease} className="ui-qty-btn" aria-label="Decrease quantity">
      <Minus size={size} />
    </button>
    <span className="ui-qty-value">{qty}</span>
    <button type="button" onClick={onIncrease} className="ui-qty-btn plus" aria-label="Increase quantity">
      <Plus size={size} />
    </button>
    {onRemove && (
      <button type="button" onClick={onRemove} className="ui-qty-btn remove" aria-label="Remove item">
        <Trash2 size={size} />
      </button>
    )}
  </div>
);

export default QtyStepper;
