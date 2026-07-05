import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { DEMO_PRODUCTS, DEMO_SHOPS } from "@/hooks/useVmartData";
import SearchBar from "@/components/ui/SearchBar";
import FilterChipBar from "@/components/ui/FilterChipBar";
import EmptyState from "@/components/ui/EmptyState";
import {
  ShoppingCart, Plus, Check, Store, ClipboardList, Heart,
} from "lucide-react";
import "./CustomerHome.css";

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
  { value: "name", label: "Name" },
];

const CATEGORIES = ["All", ...new Set(DEMO_PRODUCTS.map((p) => p.category))];

const CustomerHome = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { addToCart, cartTotalItems } = useCart();
  const { toggleWishlist, isWishlisted, wishlistCount } = useWishlist();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [activeShop, setActiveShop] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [addedMap, setAddedMap] = useState({});

  useEffect(() => {
    const shopParam = searchParams.get("shop");
    if (shopParam) setActiveShop(Number(shopParam));
  }, [searchParams]);

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening";

  let filteredProducts = DEMO_PRODUCTS.filter((p) => {
    const matchShop = activeShop ? p.shopId === activeShop : true;
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchShop && matchCat && matchSearch;
  });

  if (sortBy === "price-asc") filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  else if (sortBy === "price-desc") filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  else if (sortBy === "name") filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const result = addToCart(product);
    if (!result.success) {
      showToast("warn", "Stock limit", result.message);
      return;
    }
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    showToast("success", "Added", product.name);
    setTimeout(() => setAddedMap((prev) => ({ ...prev, [product.id]: false })), 1200);
  };

  const shopOptions = [{ value: null, label: "All Shops" }, ...DEMO_SHOPS.map((s) => ({ value: s.id, label: s.name }))];
  const categoryOptions = CATEGORIES.map((c) => ({ value: c, label: c }));

  return (
    <div className="page-container customer-home-page">
      <div className="customer-home-header">
        <div>
          <p className="customer-home-greeting">{greeting} 👋</p>
          <h1 className="customer-home-name">{user?.name || "Guest"}</h1>
        </div>
        <div className="customer-home-header-actions">
          <button type="button" onClick={() => navigate("/customer/wishlist")} className="customer-home-icon-btn">
            <Heart size={20} />
            {wishlistCount > 0 && <span className="customer-home-mini-badge">{wishlistCount}</span>}
          </button>
          <button type="button" onClick={() => navigate("/customer/cart")} className="customer-home-icon-btn">
            <ShoppingCart size={20} />
            {cartTotalItems > 0 && <span className="customer-home-mini-badge">{cartTotalItems}</span>}
          </button>
        </div>
      </div>

      <div className="customer-home-content">
        <SearchBar value={search} onChange={setSearch} placeholder="Search products..." />

        <div className="customer-home-quick-actions">
          <button type="button" onClick={() => navigate("/customer/orders")} className="customer-home-action-btn">
            <div className="customer-home-action-icon-orders"><ClipboardList size={18} /></div>
            <span className="customer-home-action-text">Orders</span>
          </button>
          <button type="button" onClick={() => navigate("/customer/shops")} className="customer-home-action-btn">
            <div className="customer-home-action-icon-shops"><Store size={18} /></div>
            <span className="customer-home-action-text">Shops</span>
          </button>
        </div>

        <FilterChipBar options={shopOptions} value={activeShop} onChange={setActiveShop} />

        <div className="customer-home-toolbar">
          <FilterChipBar options={categoryOptions} value={activeCategory} onChange={setActiveCategory} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="customer-home-sort"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="customer-home-product-grid">
          {filteredProducts.map((product) => {
            const added = addedMap[product.id];
            const wishlisted = isWishlisted(product.id);
            const outOfStock = product.stock === 0;
            return (
              <div
                key={product.id}
                className="card customer-home-product-card"
                onClick={() => navigate(`/customer/products/${product.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/customer/products/${product.id}`)}
              >
                <button
                  type="button"
                  className={`customer-home-wishlist-btn ${wishlisted ? "active" : ""}`}
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                  aria-label="Toggle wishlist"
                >
                  <Heart size={14} fill={wishlisted ? "currentColor" : "none"} />
                </button>
                <div className="customer-home-product-icon">{product.icon}</div>
                <span className="customer-home-product-shop-badge">{product.shopName}</span>
                <div className="customer-home-product-name">{product.name}</div>
                <div className="customer-home-product-cat">
                  {product.category} · {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
                </div>
                <div className="customer-home-product-footer">
                  <span className="customer-home-product-price">৳{product.price}</span>
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={outOfStock}
                    className={`customer-home-product-add-btn ${added ? "customer-home-add-added" : "customer-home-add-not-added"}`}
                  >
                    {added ? (<><Check size={14} /> Added</>) : (<><Plus size={14} /> Add</>)}
                  </button>
                </div>
              </div>
            );
          })}
          {filteredProducts.length === 0 && (
            <EmptyState icon="🔍" title="No products found" message="Try a different search or filter" />
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;
