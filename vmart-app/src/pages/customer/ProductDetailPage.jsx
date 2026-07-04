import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Check, Heart, ShoppingCart, Store } from "lucide-react";
import { DEMO_PRODUCTS, DEMO_SHOPS } from "@/hooks/useVmartData";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import "./ProductDetailPage.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, getCartQtyForProduct } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);

  const product = DEMO_PRODUCTS.find((p) => p.id === Number(id));
  const shop = product ? DEMO_SHOPS.find((s) => s.id === product.shopId) : null;
  const related = product
    ? DEMO_PRODUCTS.filter(
        (p) => p.shopId === product.shopId && p.category === product.category && p.id !== product.id
      ).slice(0, 4)
    : [];

  if (!product) {
    return (
      <div className="page-container product-detail-page">
        <EmptyNotFound navigate={navigate} />
      </div>
    );
  }

  const inCart = getCartQtyForProduct(product.id);
  const wishlisted = isWishlisted(product.id);
  const lowStock = product.stock <= 5;

  const handleAdd = () => {
    const result = addToCart(product);
    if (!result.success) {
      showToast("warn", "Stock limit", result.message);
      return;
    }
    setAdded(true);
    showToast("success", "Added to cart", product.name);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="page-container product-detail-page">
      <div className="product-detail-topbar">
        <button type="button" onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className={`product-detail-wishlist ${wishlisted ? "active" : ""}`}
          aria-label="Toggle wishlist"
        >
          <Heart size={20} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="product-detail-hero">
        <div className="product-detail-icon">{product.icon}</div>
        <span className="product-detail-cat">{product.category}</span>
        <h1 className="product-detail-name">{product.name}</h1>
        <div className="product-detail-price">৳{product.price}</div>
        <div className={`product-detail-stock ${lowStock ? "low" : ""}`}>
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          {inCart > 0 && ` · ${inCart} in cart`}
        </div>
      </div>

      <div className="product-detail-body">
        <div className="card product-detail-shop-card" onClick={() => navigate(`/?shop=${product.shopId}`)}>
          <Store size={16} />
          <div>
            <div className="product-detail-shop-name">{product.shopName}</div>
            <div className="product-detail-shop-addr">{shop?.address}</div>
          </div>
        </div>

        <div className="card product-detail-desc">
          <h3>About</h3>
          <p>
            Fresh {product.name.toLowerCase()} from {product.shopName}. Category: {product.category}.
            Quality assured for everyday needs.
          </p>
        </div>

        {related.length > 0 && (
          <div className="product-detail-related">
            <h3>Related Items</h3>
            <div className="product-detail-related-grid">
              {related.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="product-detail-related-item"
                  onClick={() => navigate(`/customer/products/${p.id}`)}
                >
                  <span>{p.icon}</span>
                  <span className="product-detail-related-name">{p.name}</span>
                  <span className="product-detail-related-price">৳{p.price}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="product-detail-actions">
        <button
          type="button"
          onClick={() => navigate("/customer/cart")}
          className="btn-secondary product-detail-cart-btn"
        >
          <ShoppingCart size={16} /> Cart
        </button>
        <button
          type="button"
          onClick={handleAdd}
          disabled={product.stock === 0}
          className={`btn-primary product-detail-add-btn ${added ? "added" : ""}`}
        >
          {added ? (<><Check size={16} /> Added</>) : (<><Plus size={16} /> Add to Cart</>)}
        </button>
      </div>
    </div>
  );
};

const EmptyNotFound = ({ navigate }) => (
  <div style={{ textAlign: "center", padding: "32px 16px" }}>
    <div style={{ fontSize: "40px" }}>❓</div>
    <h3>Product not found</h3>
    <button type="button" className="btn-primary" style={{ marginTop: "12px" }} onClick={() => navigate("/")}>
      Browse Products
    </button>
  </div>
);

export default ProductDetailPage;
