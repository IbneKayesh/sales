import { useState, useEffect, useCallback, useRef } from "react";
import { FiShoppingCart, FiFilter, FiHeart } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";
import { calcAvg } from "../../utils/helpers";
import StarDisplay from "../../components/StarDisplay";
import ProductDetailModal from "../../components/ProductDetailModal";
import SearchInput from "../../components/ui/SearchInput";
import "./ShoppingPage.css";

export default function ShoppingPage() {
  const navigate = useNavigate();
  const { showToast, setBusy } = useUI();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [shops, setShops] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchTimerRef = useRef(null);
  const [sortBy, setSortBy] = useState("default");
  const [allReviews, setAllReviews] = useState([]);
  const [detailModal, setDetailModal] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setProducts(load(KEYS.PRODUCTS));
    setCart(load(KEYS.CART));
    setShops(load(KEYS.SHOPS));
    setFavorites(load(KEYS.FAVORITES));
    setAllReviews(load(KEYS.REVIEWS));
    const shopParam = searchParams.get("shop");
    if (shopParam) setSelectedShop(shopParam);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  const toggleFavorite = useCallback(
    (product) => {
      setBusy(true);
      setFavorites((prev) => {
        const exists = prev.some(
          (f) => f.name === product.name && f.shop === product.shop,
        );
        let next;
        if (exists) {
          next = prev.filter(
            (f) => !(f.name === product.name && f.shop === product.shop),
          );
          showToast("Removed from favorites");
        } else {
          next = [
            ...prev,
            {
              name: product.name,
              price: product.price,
              discount: product.discount,
              category: product.category,
              shop: product.shop,
              image: product.image || "",
            },
          ];
          showToast(`${product.name} saved to favorites!`);
        }
        save(KEYS.FAVORITES, next);
        return next;
      });
      setBusy(false);
    },
    [showToast, setBusy],
  );

  const isFavorite = useCallback(
    (product) =>
      favorites.some((f) => f.name === product.name && f.shop === product.shop),
    [favorites],
  );
  const isInCart = useCallback(
    (product) =>
      cart.some((c) => c.name === product.name && c.shop === product.shop),
    [cart],
  );
  const getCartItem = useCallback(
    (product) =>
      cart.find((c) => c.name === product.name && c.shop === product.shop),
    [cart],
  );

  const addToCart = useCallback(
    (product, qty = 1) => {
      setBusy(true);
      setCart((prev) => {
        const existing = prev.find(
          (p) => p.name === product.name && p.shop === product.shop,
        );
        let next;
        if (existing) {
          next = prev.map((p) =>
            p.name === product.name && p.shop === product.shop
              ? { ...p, qty: p.qty + qty }
              : p,
          );
        } else {
          next = [
            ...prev,
            {
              name: product.name,
              qty,
              price: product.price || 0,
              discount: product.discount || 0,
              shop: product.shop || "",
            },
          ];
        }
        save(KEYS.CART, next);
        return next;
      });
      showToast(`${product.name} added to cart!`);
      setBusy(false);
    },
    [showToast, setBusy],
  );

  const cartCount = cart.reduce((s, p) => s + p.qty, 0);
  const getStock = (p) => p.stock ?? (p.inStock ? 10 : 0);
  const inStockProducts = products.filter((p) => getStock(p) > 0);
  const categories = [
    ...new Set(
      inStockProducts.filter((p) => p.category).map((p) => p.category),
    ),
  ];

  const filtered = products
    .filter((p) => {
      if (selectedShop && p.shop !== selectedShop) return false;
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (
        searchQuery &&
        !p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      const aPrice = a.price - (a.price * (a.discount || 0)) / 100;
      const bPrice = b.price - (b.price * (b.discount || 0)) / 100;
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return aPrice - bPrice;
        case "price-desc":
          return bPrice - aPrice;
        case "discount":
          return (b.discount || 0) - (a.discount || 0);
        default:
          return 0; // default order (as loaded)
      }
    });

  const getStockStatus = (p) => {
    const stock = getStock(p);
    if (stock <= 0) return { label: "Out of stock", color: "var(--error)" };
    if (stock <= 5) return { label: `Only ${stock} left`, color: "orange" };
    return { label: `${stock} in stock`, color: "green" };
  };

  const getProductReviews = (product) =>
    allReviews.filter(
      (r) =>
        r.productName === product.name &&
        r.productShop === (product.shop || ""),
    );

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Shop</p>
          <h1 className="page-heading">Products</h1>
        </div>
        <button
          className="ui-badge shop-cart-btn"
          onClick={() => navigate("/cart")}
        >
          <FiShoppingCart />
          {cartCount > 0 && (
            <span className="shop-cart-badge">{cartCount}</span>
          )}
        </button>
      </div>

      {/* Search bar */}
      <SearchInput
        id="shopping-search"
        placeholder="Search products by name..."
        value={searchInput}
        onChange={(e) => {
          const val = e.target.value;
          setSearchInput(val);
          setIsSearching(true);
          if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
          searchTimerRef.current = setTimeout(() => {
            setSearchQuery(val);
            setIsSearching(false);
          }, 300);
        }}
        inputClassName="shop-search-input"
        loading={isSearching}
      />

      {/* Filters */}
      <div className="shop-filters-row">
        <FiFilter size={14} className="shop-filter-icon" />
        <div className="ui-select-wrapper shop-filter-select-wrapper">
          <select
            id="shopping-shop-filter"
            name="shopping-shop-filter"
            className="ui-select shop-filter-select"
            value={selectedShop}
            onChange={(e) => setSelectedShop(e.target.value)}
          >
            <option value="">All Shops</option>
            {shops.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="ui-select-wrapper shop-filter-select-wrapper">
          <select
            id="shopping-category-filter"
            name="shopping-category-filter"
            className="ui-select shop-filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="ui-select-wrapper shop-sort-wrapper">
          <select
            id="shopping-sort"
            name="shopping-sort"
            className="ui-select shop-filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Sort: Default</option>
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>
      </div>

      {/* Shop chips */}
      {!selectedShop &&
        !searchQuery &&
        shops.length > 0 &&
        filtered.length > 0 && (
          <div className="ui-card shop-chips-card">
            <div className="shop-chips-wrap">
              {shops.map((s) => {
                const count = filtered.filter((p) => p.shop === s.name).length;
                if (count === 0) return null;
                return (
                  <button
                    key={s.name}
                    onClick={() => setSelectedShop(s.name)}
                    className="shop-chip-btn"
                  >
                    🏪 {s.name} <span className="shop-chip-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      {/* Product list */}
      {filtered.length === 0 ? (
        <div className="shop-empty-state">
          <div className="shop-empty-icon">🛍️</div>
          <div>
            <h3 className="shop-empty-title">
              {searchQuery
                ? "No matching products"
                : products.length === 0
                  ? "No products available"
                  : "No matching products"}
            </h3>
            <p className="shop-empty-desc">
              {searchQuery
                ? `No products matching "${searchQuery}"`
                : products.length === 0
                  ? "Add products in the Products page first."
                  : "Try adjusting the filters."}
            </p>
          </div>
        </div>
      ) : (
        <div className="shop-product-list">
          {filtered.map((p, idx) => {
            const finalPrice = p.price - (p.price * (p.discount || 0)) / 100;
            const stockStatus = getStockStatus(p);
            const prodReviews = getProductReviews(p);
            const avgRating = calcAvg(prodReviews);
            return (
              <div
                key={idx}
                className="compact-product-card"
                onClick={() => setDetailModal(p)}
              >
                <div className="compact-thumb">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="compact-thumb-img"
                    />
                  ) : (
                    <span className="compact-thumb-placeholder">📦</span>
                  )}
                  {p.discount > 0 && (
                    <span className="compact-discount-badge">
                      -{p.discount}%
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(p);
                    }}
                    className={`compact-fav-btn${isFavorite(p) ? " compact-fav-btn--active" : " compact-fav-btn--inactive"}`}
                    aria-label={
                      isFavorite(p)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <FiHeart
                      fill={isFavorite(p) ? "currentColor" : "none"}
                      size={10}
                    />
                  </button>
                </div>
                <div className="compact-info">
                  <div className="compact-name-row">
                    <span className="compact-name">{p.name}</span>
                    {p.shop && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedShop(p.shop);
                        }}
                        className="compact-shop-badge"
                        title={`Show only ${p.shop} products`}
                      >
                        🏪 {p.shop}
                      </button>
                    )}
                  </div>
                  <div className="compact-rating-row">
                    <span className="compact-rating-stars">
                      <StarDisplay rating={Math.round(avgRating)} size={10} />
                      <span className="compact-rating-num">
                        {prodReviews.length > 0
                          ? `${avgRating.toFixed(1)}`
                          : ""}
                      </span>
                    </span>
                    {stockStatus && (
                      <span className="compact-stock-label">
                        {stockStatus.label}
                      </span>
                    )}
                  </div>
                  <div className="compact-price-row">
                    <div className="compact-price-left">
                      <span className="compact-price-current">
                        ₹{finalPrice.toFixed(2)}
                      </span>
                      {p.discount > 0 && (
                        <span className="compact-price-old">
                          ₹{p.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {getStock(p) <= 0 ? (
                      <span className="compact-out-of-stock">Out of Stock</span>
                    ) : isInCart(p) ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/cart");
                        }}
                        className="compact-in-cart-btn"
                      >
                        ✓ In Cart
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(p);
                        }}
                        className="ui-btn ui-btn-primary compact-add-btn"
                      >
                        <FiShoppingCart size={12} /> Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Detail Modal */}
      {detailModal && (
        <ProductDetailModal
          product={detailModal}
          onClose={() => setDetailModal(null)}
          cart={cart}
          onAddToCart={addToCart}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />
      )}
    </section>
  );
}
