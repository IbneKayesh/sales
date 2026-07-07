import { FiShoppingCart, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function CartConfirmedView({ createdOrders, orderGroupCount }) {
  const navigate = useNavigate();

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Cart</p>
          <h1 className="page-heading">Order Placed!</h1>
        </div>
        <div className="ui-badge"><FiShoppingCart /></div>
      </div>
      <div className="ui-card cart-confirmed-card">
        <div className="cart-confirmed-icon">✅</div>
        <h3 className="cart-confirmed-heading">Order confirmed!</h3>
        <p className="page-summary cart-confirmed-summary">
          {createdOrders.length} order(s) placed across {orderGroupCount} shop(s).
        </p>
        {createdOrders.length > 1 && (
          <div className="cart-confirmed-orders">
            {createdOrders.map((o) => (
              <div key={o.id}>🏪 {o.shop} — {o.products.length} item(s)</div>
            ))}
          </div>
        )}
        <div className="cart-confirmed-actions">
          <button className="ui-btn ui-btn-primary" onClick={() => navigate("/order")}>View Orders</button>
          <button className="ui-btn ui-btn-secondary" onClick={() => navigate("/shopping")}>Shop More</button>
        </div>
      </div>
    </section>
  );
}
