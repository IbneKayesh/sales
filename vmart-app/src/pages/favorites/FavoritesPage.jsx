import { FiHeart } from "react-icons/fi";

export default function FavoritesPage() {
  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Saved items</p>
          <h2 className="page-heading">Favorites</h2>
        </div>
        <div className="ui-badge">
          <FiHeart />
        </div>
      </div>

      <p className="page-summary">
        Items you&apos;ve saved will appear here for quick access.
      </p>

      <div className="ui-card-grid">
        <div className="ui-card">
          <h3 className="ui-card-title">Fresh Mart</h3>
          <p className="ui-card-text">Daily groceries, snacks, and essentials.</p>
          <div className="ui-card-meta">⭐ Saved · 4.9 ★</div>
        </div>
        <div className="ui-card">
          <h3 className="ui-card-title">Gadget Hub</h3>
          <p className="ui-card-text">Electronics, accessories, and fast delivery.</p>
          <div className="ui-card-meta">⭐ Saved · 4.8 ★</div>
        </div>
        <div className="ui-card">
          <h3 className="ui-card-title">Style Studio</h3>
          <p className="ui-card-text">Trendy fashion wear &amp; accessories.</p>
          <div className="ui-card-meta">⭐ Saved · 4.7 ★</div>
        </div>
      </div>
    </section>
  );
}
