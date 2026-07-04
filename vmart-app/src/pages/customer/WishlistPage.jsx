import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { DEMO_PRODUCTS } from "@/hooks/useVmartData";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import "./WishlistPage.css";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const products = DEMO_PRODUCTS.filter((p) => wishlist.includes(p.id));

  const handleAdd = (product) => {
    const result = addToCart(product);
    if (!result.success) {
      showToast("warn", "Stock limit", result.message);
      return;
    }
    showToast("success", "Added", product.name);
  };

  return (
    <div className="page-container wishlist-page">
      <PageHeader title="Wishlist" subtitle={`${products.length} saved item${products.length !== 1 ? "s" : ""}`} />

      {products.length === 0 ? (
        <EmptyState
          icon="❤️"
          title="No saved items"
          message="Tap the heart on products to save them here"
          action={
            <button type="button" className="btn-primary" onClick={() => navigate("/")}>
              Browse Products
            </button>
          }
        />
      ) : (
        <div className="wishlist-grid">
          {products.map((product) => (
            <div key={product.id} className="card wishlist-card">
              <button
                type="button"
                className="wishlist-remove"
                onClick={() => toggleWishlist(product.id)}
                aria-label="Remove from wishlist"
              >
                <Heart size={16} fill="currentColor" />
              </button>
              <button
                type="button"
                className="wishlist-body"
                onClick={() => navigate(`/customer/products/${product.id}`)}
              >
                <div className="wishlist-icon">{product.icon}</div>
                <div className="wishlist-name">{product.name}</div>
                <div className="wishlist-price">৳{product.price}</div>
              </button>
              <button type="button" className="wishlist-add-btn" onClick={() => handleAdd(product)}>
                <ShoppingCart size={14} /> Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
