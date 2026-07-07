import {
  FiShoppingCart,
  FiGrid,
  FiBox,
  FiPackage,
  FiHeart,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import StarDisplay from "../../components/StarDisplay";
import Button from "../../components/ui/Button";
import SearchInput from "../../components/ui/SearchInput";
import { calcAvg } from "../../utils/helpers";

export default function CustomerMarketplace({
  user,
  shops,
  products,
  cart,
  orders,
  invoices,
  favorites,
  reviews,
  isAuthenticated,
}) {
  const navigate = useNavigate();
  const cartCount = cart.reduce((s, p) => s + p.qty, 0);
  const getStock = (p) => p.stock ?? (p.inStock ? 10 : 0);
  const inStockProducts = products.filter((p) => getStock(p) > 0);

  const userOrders = user
    ? orders.filter((o) => o.customer?.name === user.name)
    : [];
  const userInvoices = user
    ? invoices.filter((inv) => inv.customer?.name === user.name)
    : [];

  const getProductReviews = (p) =>
    reviews.filter(
      (r) => r.productName === p.name && r.productShop === (p.shop || ""),
    );

  const trending = [...products]
    .map((p) => ({
      ...p,
      avgRating: calcAvg(getProductReviews(p)),
      stock: getStock(p),
    }))
    .sort((a, b) => {
      if (b.avgRating !== a.avgRating) return b.avgRating - a.avgRating;
      return (b.discount || 0) - (a.discount || 0);
    })
    .slice(0, 4);

  const categories = [
    ...new Set(
      inStockProducts.filter((p) => p.category).map((p) => p.category),
    ),
  ];

  return (
    <section className="page-section home-page">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Welcome{user ? `, ${user.name}` : ""}</p>
          <h1 className="page-heading">Virtual Mart</h1>
        </div>
        <Button variant="badge" onClick={() => navigate("/cart")}>
          <FiShoppingCart />
          {cartCount > 0 && (
            <span className="cart-badge-count">{cartCount}</span>
          )}
        </Button>
      </div>

      <p className="page-summary">
        {shops.length > 0 || inStockProducts.length > 0
          ? `Browse ${inStockProducts.length} products across ${shops.length} shop${shops.length !== 1 ? "s" : ""}.`
          : "Discover products from multiple shops and get fast delivery."}
      </p>

      {/* Search bar */}
      <SearchInput
        id="home-search"
        placeholder="Search products, brands, or shops"
        onFocus={() => navigate("/shopping")}
        icon={false}
      />

      {/* Customer Stats */}
      <div className="home-stats-grid">
        <div
          className="home-stat-card home-stat-card--clickable"
          onClick={() => navigate("/shopping")}
        >
          <div className="home-stat-icon home-stat-icon--accent">
            <FiGrid />
          </div>
          <div className="home-stat-value">{shops.length}</div>
          <div className="home-stat-label">Shops</div>
        </div>
        <div
          className="home-stat-card home-stat-card--clickable"
          onClick={() => navigate("/shopping")}
        >
          <div className="home-stat-icon home-stat-icon--blue">
            <FiBox />
          </div>
          <div className="home-stat-value">{inStockProducts.length}</div>
          <div className="home-stat-label">Products</div>
        </div>
        <div
          className="home-stat-card home-stat-card--clickable"
          onClick={() => navigate("/order")}
        >
          <div className="home-stat-icon home-stat-icon--green">
            <FiPackage />
          </div>
          <div className="home-stat-value">{userOrders.length}</div>
          <div className="home-stat-label">My Orders</div>
        </div>
        <div
          className="home-stat-card home-stat-card--clickable"
          onClick={() => navigate("/favorites")}
        >
          <div className="home-stat-icon home-stat-icon--red">
            <FiHeart />
          </div>
          <div className="home-stat-value">{favorites.length}</div>
          <div className="home-stat-label">Wishlist</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="home-actions-grid">
        <div className="ui-action-card" onClick={() => navigate("/shopping")}>
          <span className="ui-action-card-icon">🛍️</span>
          <h3 className="ui-action-card-title">Shop Now</h3>
        </div>
        <div className="ui-action-card" onClick={() => navigate("/cart")}>
          <span className="ui-action-card-icon">🛒</span>
          <h3 className="ui-action-card-title">Cart ({cartCount})</h3>
        </div>
        <div className="ui-action-card" onClick={() => navigate("/order")}>
          <span className="ui-action-card-icon">📦</span>
          <h3 className="ui-action-card-title">My Orders</h3>
        </div>
        <div className="ui-action-card" onClick={() => navigate("/favorites")}>
          <span className="ui-action-card-icon">❤️</span>
          <h3 className="ui-action-card-title">Wishlist</h3>
        </div>
      </div>

      {/* Category quick links */}
      {categories.length > 0 && (
        <div className="ui-card home-category-card">
          <h3 className="ui-card-title home-category-title">
            Shop by Category
          </h3>
          <div className="home-categories-wrap">
            {categories.map((cat) => {
              const count = inStockProducts.filter(
                (p) => p.category === cat,
              ).length;
              return (
                <button
                  key={cat}
                  onClick={() => navigate("/shopping")}
                  className="home-category-pill"
                >
                  <span className="home-category-pill-name">{cat}</span>
                  <span className="home-category-pill-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Shops */}
      {shops.length > 0 && (
        <>
          <div className="home-section-header">
            <h2 className="home-section-title">Our Shops</h2>
            <button
              className="home-section-link"
              onClick={() => navigate("/shopping")}
            >
              View all
            </button>
          </div>
          <div className="home-shops-scroll">
            {shops.map((s, idx) => {
              const productCount = inStockProducts.filter(
                (p) => p.shop === s.name,
              ).length;
              return (
                <button
                  key={idx}
                  className="home-shop-chip"
                  onClick={() =>
                    navigate(`/shopping?shop=${encodeURIComponent(s.name)}`)
                  }
                >
                  <span className="home-shop-chip-icon">🏪</span>
                  <span className="home-shop-chip-name">{s.name}</span>
                  <span className="home-shop-chip-count">{productCount}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Trending Products */}
      {trending.length > 0 && (
        <>
          <div className="home-section-header">
            <h2 className="home-section-title">🔥 Trending Now</h2>
            <button
              className="home-section-link"
              onClick={() => navigate("/shopping")}
            >
              View all
            </button>
          </div>
          <div className="ui-card-grid">
            {trending.map((p, idx) => {
              const finalPrice = p.price - (p.price * (p.discount || 0)) / 100;
              const prodReviews = getProductReviews(p);
              const avgRating = calcAvg(prodReviews);
              const isOutOfStock = p.stock <= 0;
              return (
                <div
                  key={idx}
                  className="ui-card"
                  onClick={
                    !isOutOfStock ? () => navigate("/shopping") : undefined
                  }
                  style={{
                    cursor: isOutOfStock ? "default" : "pointer",
                    padding: 0,
                    overflow: "hidden",
                    opacity: isOutOfStock ? 0.6 : 1,
                  }}
                >
                  <div className="home-product-image">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="home-product-img"
                      />
                    ) : (
                      <span className="home-product-placeholder">📦</span>
                    )}
                    {p.discount > 0 && (
                      <span className="home-discount-badge">
                        -{p.discount}%
                      </span>
                    )}
                    {isOutOfStock && (
                      <span className="home-oos-badge">Out of Stock</span>
                    )}
                  </div>
                  <div className="home-product-info">
                    <div className="home-product-name-row">
                      <span className="home-product-name">{p.name}</span>
                    </div>
                    {p.shop && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/shopping?shop=${encodeURIComponent(p.shop)}`,
                          );
                        }}
                        className="home-shop-badge"
                        title={`Browse ${p.shop} products`}
                      >
                        🏪 {p.shop}
                      </button>
                    )}
                    <div className="home-product-rating">
                      <StarDisplay rating={Math.round(avgRating)} size={11} />
                      <span className="home-product-rating-count">
                        {prodReviews.length > 0
                          ? `(${prodReviews.length})`
                          : ""}
                      </span>
                    </div>
                    {!isOutOfStock ? (
                      <div className="home-product-price-row">
                        <span className="home-product-price">
                          ₹{finalPrice.toFixed(2)}
                        </span>
                        {p.discount > 0 && (
                          <span className="home-product-old-price">
                            ₹{p.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="home-product-unavailable">
                        <span className="home-product-unavailable-text">
                          Currently unavailable
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Recent Orders Summary */}
      {userOrders.length > 0 && (
        <>
          <div className="home-section-header">
            <h2 className="home-section-title">📋 Recent Orders</h2>
            <button
              className="home-section-link"
              onClick={() => navigate("/order")}
            >
              View all
            </button>
          </div>
          <div className="home-orders-column">
            {[...userOrders]
              .reverse()
              .slice(0, 3)
              .map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate("/order")}
                  className="home-customer-order-item"
                >
                  <div className="home-customer-order-icon">
                    <FiPackage size={16} />
                  </div>
                  <div className="home-order-info">
                    <div className="home-customer-order-title">
                      {order.products?.length || 0} item(s) · ₹
                      {order.grandTotal?.toFixed(2)}
                    </div>
                    <div className="home-customer-order-shop">
                      {order.shop && <>🏪 {order.shop}</>}
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
        </>
      )}

      {/* Quick invoice summary */}
      {userInvoices.length > 0 && (
        <>
          <div className="home-section-header">
            <h2 className="home-section-title">🧾 Invoices</h2>
            <button
              className="home-section-link"
              onClick={() => navigate("/invoice")}
            >
              View all
            </button>
          </div>
          <div className="ui-card home-invoice-card">
            <div className="home-invoice-row">
              <div className="home-invoice-col">
                <div className="home-invoice-label">Total</div>
                <div className="home-invoice-value">{userInvoices.length}</div>
              </div>
              <div className="home-invoice-col">
                <div className="home-invoice-label">Paid</div>
                <div className="home-invoice-value home-invoice-value--green">
                  {
                    userInvoices.filter((inv) => inv.paymentStatus === "paid")
                      .length
                  }
                </div>
              </div>
              <div className="home-invoice-col">
                <div className="home-invoice-label">Due</div>
                <div className="home-invoice-value home-invoice-value--error">
                  {
                    userInvoices.filter(
                      (inv) =>
                        inv.paymentStatus === "due" ||
                        inv.paymentStatus === "partial_paid",
                    ).length
                  }
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Empty state */}
      {shops.length === 0 &&
        inStockProducts.length === 0 &&
        userOrders.length === 0 && (
          <div className="ui-card home-empty-card">
            <div className="home-empty-icon-big">🛍️</div>
            <h3 className="home-empty-title">Welcome to Virtual Mart!</h3>
            <p className="home-empty-desc">
              Browse products from multiple shops and place orders with ease.
            </p>
            <button
              className="ui-btn ui-btn-primary home-empty-btn-top"
              onClick={() => navigate("/shopping")}
            >
              <FiGrid /> Start Shopping
            </button>
          </div>
        )}
    </section>
  );
}
