import { FiShoppingBag, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { calcSubtotal } from "../../utils/helpers";

export default function CartShopGroup({ group, calcGroupTotal, updateQty, removeItem }) {
  return (
    <div key={group.shop} className="ui-card cart-shop-group">
      <div className="cart-shop-header">
        <FiShoppingBag /> {group.shop}
      </div>
      <div className="cart-shop-items">
        {group.items.map((item, idx) => (
          <div key={idx} className={idx < group.items.length - 1 ? "cart-item" : ""}>
            <div className="cart-item-row">
              <div className="cart-item-info">
                <h3 className="ui-card-title cart-item-name">{item.name}</h3>
                <div className="cart-item-details">
                  ₹{item.price.toFixed(2)}/item
                  {item.discount > 0 && <span className="cart-item-discount">-{item.discount}%</span>}
                </div>
              </div>
              <button onClick={() => removeItem(item.name)} className="cart-item-remove" aria-label="Remove item">
                <FiTrash2 />
              </button>
            </div>
            <div className="cart-qty-row">
              <div className="cart-qty-controls">
                <button onClick={() => updateQty(item.name, -1)} className="cart-qty-btn"><FiMinus size={14} /></button>
                <span className="cart-qty-value">{item.qty}</span>
                <button onClick={() => updateQty(item.name, 1)} className="cart-qty-btn"><FiPlus size={14} /></button>
              </div>
              <span className="cart-item-total">₹{calcSubtotal(item).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-shop-total">Shop Total: ₹{calcGroupTotal(group).toFixed(2)}</div>
    </div>
  );
}
