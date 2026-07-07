import {
  FiBox,
  FiPackage,
  FiDollarSign,
  FiAlertTriangle,
  FiShoppingBag,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";

export default function ShopDashboard({
  user,
  shops,
  products,
  orders,
  invoices,
}) {
  const navigate = useNavigate();
  const shopName = user?.shopName || user?.name || "";
  const shopProducts = products.filter((p) => p.shop === shopName);
  const shopOrders = orders.filter((o) => o.shop === shopName);
  const shopInvoices = invoices.filter(
    (inv) => inv.shop === shopName || inv.customer?.name === shopName,
  );
  const pendingOrders = shopOrders.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled",
  );
  const totalRevenue = shopInvoices
    .filter((inv) => inv.paymentStatus === "paid")
    .reduce((s, inv) => s + (inv.grandTotal || 0), 0);
  const totalDue = shopInvoices
    .filter(
      (inv) =>
        inv.paymentStatus !== "paid" && inv.paymentStatus !== "partial_paid",
    )
    .reduce((s, inv) => s + (inv.grandTotal || 0), 0);
  const partialDue = shopInvoices
    .filter((inv) => inv.paymentStatus === "partial_paid")
    .reduce((s, inv) => s + ((inv.grandTotal || 0) - (inv.paidAmount || 0)), 0);
  const lowStock = shopProducts.filter((p) => {
    const stock = p.stock ?? (p.inStock ? 10 : 0);
    return stock > 0 && stock <= 5;
  });

  return (
    <section className="page-section home-page">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Dashboard</p>
          <h1 className="page-heading">{shopName}</h1>
        </div>
        <Button variant="badge" onClick={() => navigate("/shop-profile")}>
          🏪
        </Button>
      </div>

      <p className="page-summary">
        Welcome back, {user?.name || "Shop Owner"}! Here's your shop at a
        glance.
      </p>

      {/* Stats Grid */}
      <div className="home-stats-grid">
        <div
          className="home-stat-card home-stat-card--clickable"
          onClick={() => navigate("/products")}
        >
          <div className="home-stat-icon home-stat-icon--accent">
            <FiBox />
          </div>
          <div className="home-stat-value">{shopProducts.length}</div>
          <div className="home-stat-label">Products</div>
        </div>
        <div
          className="home-stat-card home-stat-card--clickable"
          onClick={() => navigate("/order")}
        >
          <div className="home-stat-icon home-stat-icon--blue">
            <FiPackage />
          </div>
          <div className="home-stat-value">{shopOrders.length}</div>
          <div className="home-stat-label">Total Orders</div>
        </div>
        <div
          className="home-stat-card home-stat-card--clickable"
          onClick={() => navigate("/order")}
        >
          <div
            className={`home-stat-icon${pendingOrders.length > 0 ? " home-stat-icon--accent" : " home-stat-icon--green"}`}
            style={{
              background:
                pendingOrders.length > 0
                  ? "var(--error-bg)"
                  : "rgba(34,197,94,0.1)",
              color: pendingOrders.length > 0 ? "var(--error)" : "#22c55e",
            }}
          >
            <FiAlertTriangle />
          </div>
          <div
            className={`home-stat-value${pendingOrders.length > 0 ? " home-stat-value--error" : ""}`}
          >
            {pendingOrders.length}
          </div>
          <div className="home-stat-label">Pending</div>
        </div>
        <div
          className="home-stat-card home-stat-card--clickable"
          onClick={() => navigate("/invoice-collections")}
        >
          <div className="home-stat-icon home-stat-icon--green">
            <FiDollarSign />
          </div>
          <div className="home-stat-value">
            ₹{(totalRevenue + totalDue + partialDue).toFixed(0)}
          </div>
          <div className="home-stat-label">Revenue</div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      {shopInvoices.length > 0 && (
        <div className="ui-card">
          <div className="home-revenue-row">
            <div className="home-revenue-col">
              <div className="home-revenue-label">Collected</div>
              <div className="home-revenue-value home-revenue-value--green">
                ₹{totalRevenue.toFixed(2)}
              </div>
            </div>
            <div className="home-revenue-col">
              <div className="home-revenue-label">Outstanding</div>
              <div className="home-revenue-value home-revenue-value--error">
                ₹{(totalDue + partialDue).toFixed(2)}
              </div>
            </div>
            <div className="home-revenue-col">
              <div className="home-revenue-label">Customers</div>
              <div className="home-revenue-value home-revenue-value--default">
                {new Set(shopOrders.map((o) => o.customer?.name)).size}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="ui-card home-alert-card">
          <div className="home-alert-row">
            <div className="home-alert-icon-wrap">
              <FiAlertTriangle />
            </div>
            <div className="home-alert-info">
              <div className="home-alert-title">
                {lowStock.length} product{lowStock.length > 1 ? "s" : ""} low in
                stock
              </div>
              <div className="home-alert-desc">
                {lowStock
                  .slice(0, 3)
                  .map((p) => p.name)
                  .join(", ")}
                {lowStock.length > 3 ? ` and ${lowStock.length - 3} more` : ""}
              </div>
            </div>
            <button
              className="ui-btn ui-btn-secondary home-alert-btn"
              onClick={() => navigate("/products")}
            >
              Restock
            </button>
          </div>
        </div>
      )}

      {/* Quick Management Actions */}
      <div className="home-actions-grid">
        <div className="ui-action-card" onClick={() => navigate("/products")}>
          <span className="ui-action-card-icon">📦</span>
          <h3 className="ui-action-card-title">
            Products ({shopProducts.length})
          </h3>
        </div>
        <div className="ui-action-card" onClick={() => navigate("/order")}>
          <span className="ui-action-card-icon">📋</span>
          <h3 className="ui-action-card-title">Orders ({shopOrders.length})</h3>
        </div>
        <div className="ui-action-card" onClick={() => navigate("/invoice")}>
          <span className="ui-action-card-icon">🧾</span>
          <h3 className="ui-action-card-title">
            Invoices ({shopInvoices.length})
          </h3>
        </div>
        <div className="ui-action-card" onClick={() => navigate("/shop")}>
          <span className="ui-action-card-icon">🏪</span>
          <h3 className="ui-action-card-title">My Shop</h3>
        </div>
        <div className="ui-action-card" onClick={() => navigate("/customers")}>
          <span className="ui-action-card-icon">👥</span>
          <h3 className="ui-action-card-title">Customers</h3>
        </div>
        <div
          className="ui-action-card"
          onClick={() => navigate("/invoice-collections")}
        >
          <span className="ui-action-card-icon">💰</span>
          <h3 className="ui-action-card-title">Collections</h3>
        </div>
      </div>

      {/* Recent Orders */}
      {shopOrders.length > 0 && (
        <div className="ui-card">
          <h3 className="ui-card-title">Recent Orders</h3>
          <div className="home-orders-column">
            {[...shopOrders]
              .reverse()
              .slice(0, 5)
              .map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate("/order")}
                  className="home-order-item"
                >
                  <div className="home-order-info">
                    <div className="home-order-customer">
                      {order.customer?.name || "Guest"}
                    </div>
                    <div className="home-order-meta">
                      ₹{order.grandTotal?.toFixed(2)} ·{" "}
                      {order.products?.length || 0} item(s)
                    </div>
                  </div>
                  <span
                    className="order-status-badge"
                    data-status={
                      order.status === "delivered"
                        ? "delivered"
                        : order.status === "cancelled"
                          ? "cancelled"
                          : "pending"
                    }
                  >
                    {order.status?.replace(/_/g, " ") || "pending"}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {shopProducts.length === 0 && shopOrders.length === 0 && (
        <div className="ui-card home-empty-card">
          <div className="home-empty-icon-big">🚀</div>
          <h3 className="home-empty-title">Welcome to Your Shop!</h3>
          <p className="home-empty-desc">
            Start by adding products. Customers will find them in the
            marketplace.
          </p>
          <div className="home-empty-actions">
            <button
              className="ui-btn ui-btn-primary"
              onClick={() => navigate("/products")}
            >
              <FiBox /> Add Products
            </button>
            <button
              className="ui-btn ui-btn-secondary"
              onClick={() => navigate("/shop")}
            >
              <FiShoppingBag /> Manage Shop
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
