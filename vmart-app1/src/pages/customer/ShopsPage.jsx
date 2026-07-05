import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone } from "lucide-react";
import { DEMO_SHOPS, DEMO_PRODUCTS } from "@/hooks/useVmartData";
import "./ShopsPage.css";

const ShopsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container shops-page">
      <div className="shops-page-header">
        <h2 className="shops-page-title">All Shops</h2>
        <p className="shops-page-subtitle">{DEMO_SHOPS.length} shops available</p>
      </div>

      {DEMO_SHOPS.map((shop) => {
        const shopProducts = DEMO_PRODUCTS.filter((p) => p.shopId === shop.id);
        const categories = [...new Set(shopProducts.map((p) => p.category))];
        return (
          <div key={shop.id} className="card shops-card"
            onClick={() => navigate(`/?shop=${shop.id}`)}>
            {/* Shop header */}
            <div className="shops-card-header">
              <div className="shops-card-avatar">🏪</div>
              <div className="shops-card-details">
                <div className="shops-card-name">{shop.name}</div>
                <div className="shops-card-phone-row">
                  <Phone size={11} color="var(--text-secondary)" />
                  <span className="shops-card-phone">{shop.phone}</span>
                </div>
              </div>
              <div className="shops-card-count">
                <div className="shops-card-count-val">{shopProducts.length}</div>
                <div className="shops-card-count-label">products</div>
              </div>
            </div>

            {/* Address */}
            <div className="shops-card-address">
              <MapPin size={13} color="var(--text-secondary)" style={{ marginTop: "1px", flexShrink: 0 }} />
              <span className="shops-card-address-text">{shop.address}</span>
            </div>

            {/* Category chips */}
            <div className="shops-card-cats">
              {categories.map((cat) => (
                <span key={cat} className="shops-card-cat-chip">{cat}</span>
              ))}
            </div>

            {/* Action */}
            <div className="shops-card-action">
              <span className="shops-card-action-text">Browse Products →</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShopsPage;
