export default function HomePage() {
  return (
    <section className="page-section home-page">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Welcome back</p>
          <h1 className="page-heading">Find your next purchase in one tap.</h1>
        </div>
        <div className="ui-badge">🛒</div>
      </div>

      <p className="page-summary">
        Discover trending shops, browse fresh products, and get fast delivery for every order.
      </p>

      <div className="ui-search">
        <input type="search" className="ui-search-input" placeholder="Search products, brands, or shops" />
      </div>

      <div className="page-actions">
        <div className="ui-action-card">
          <span className="ui-action-card-icon">🔥</span>
          <h3 className="ui-action-card-title">Trending deals</h3>
        </div>
        <div className="ui-action-card">
          <span className="ui-action-card-icon">📦</span>
          <h3 className="ui-action-card-title">Express delivery</h3>
        </div>
        <div className="ui-action-card">
          <span className="ui-action-card-icon">💳</span>
          <h3 className="ui-action-card-title">Easy checkout</h3>
        </div>
        <div className="ui-action-card">
          <span className="ui-action-card-icon">⭐</span>
          <h3 className="ui-action-card-title">Top rated shops</h3>
        </div>
      </div>

      <div className="ui-card-grid">
        <div className="ui-card">
          <h3 className="ui-card-title">Fresh Mart</h3>
          <p className="ui-card-text">Daily groceries, snacks, and essentials.</p>
          <div className="ui-card-meta">Open now · 4.9 ★</div>
        </div>
        <div className="ui-card">
          <h3 className="ui-card-title">Gadget Hub</h3>
          <p className="ui-card-text">Electronics, accessories, and fast delivery.</p>
          <div className="ui-card-meta">Open now · 4.8 ★</div>
        </div>
      </div>
    </section>
  );
}
