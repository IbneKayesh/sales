import { useState, useEffect, useCallback, useRef } from "react";
import { FiShoppingCart, FiFilter, FiHeart } from "react-icons/fi";
import { data, useNavigate, useSearchParams } from "react-router-dom";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";
import { calcAvg } from "../../utils/helpers";
import StarDisplay from "../../components/StarDisplay";
import ProductDetailModal from "../../components/ProductDetailModal";
import SearchInput from "../../components/ui/SearchInput";
import "./ShoppingPage.css";
import useShopping from "@/hooks/useShopping";

export default function ShoppingPage() {
  const navigate = useNavigate();
  const {
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    showModal,
    scatg_options,
    bsins_options,
    cartItems,
    cartItemsQty,
    handleChange,
    handleEdit,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    handleAddToCart,
    isInCart,
  } = useShopping();

  const { showToast, setBusy } = useUI();
  const [products, setProducts] = useState([]);
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

  // useEffect(() => {
  //   setProducts(load(KEYS.PRODUCTS));
  //   setCart(load(KEYS.CART));
  //   setShops(load(KEYS.SHOPS));
  //   setFavorites(load(KEYS.FAVORITES));
  //   setAllReviews(load(KEYS.REVIEWS));
  //   const shopParam = searchParams.get("shop");
  //   if (shopParam) setSelectedShop(shopParam);
  //   return () => {
  //     if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
  //   };
  // }, []);

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

  const getStock = (p) => p.price_gdstk ?? (Number(p.price_gdstk) ? 10 : 0);
  const inStockProducts = dataList.filter((p) => getStock(p) > 0);

  const filtered = dataList
    .filter((p) => {
      if (selectedShop && p.bsins_id !== selectedShop) return false;
      if (selectedCategory && p.items_scatg !== selectedCategory) return false;
      if (
        searchQuery &&
        !p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      const aPrice = Number(a.price_mrrat) - (Number(a.price_dspct) * (Number(a.discount) || 0)) / 100;
      const bPrice = Number(b.price_mrrat) - (Number(b.price_dspct) * (Number(b.discount) || 0)) / 100;
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
    if (stock <= 5)
      return { label: `Only ${Number(stock)} left`, color: "orange" };
    return { label: `${Number(stock)} in stock`, color: "green" };
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
          {cartItemsQty > 0 && (
            <span className="shop-cart-badge">{cartItemsQty}</span>
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
            {bsins_options.map((s) => (
              <option key={s.bsins_id} value={s.bsins_id}>
                {s.bsins_cname}
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
            {scatg_options.map((cat) => (
              <option key={cat.items_scatg} value={cat.items_scatg}>
                {cat.items_scatg}
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
        bsins_options.length > 0 &&
        filtered.length > 0 && (
          <div className="ui-card shop-chips-card">
            <div className="shop-chips-wrap">
              {bsins_options.map((s) => {
                const count = filtered.filter((p) => p.bsins_id === s.bsins_id).length;
                if (count === 0) return null;
                return (
                  <button
                    key={s.bsins_id}
                    onClick={() => setSelectedShop(s.bsins_id)}
                    className="shop-chip-btn"
                  >
                    🏪 {s.bsins_cname} <span className="shop-chip-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      {/* Product list */}
      {dataList.length === 0 ? (
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
          {/* {JSON.stringify(dataList)} */}
          {dataList.map((p, idx) => {
            const finalPrice =
              Number(p.price_mrrat) -
              (Number(p.price_mrrat) * (Number(p.price_dspct) || 0)) / 100;
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
                  {p.items_image ? (
                    <img
                      src={p.items_image}
                      alt={p.items_iname}
                      className="compact-thumb-img"
                    />
                  ) : (
                    <span className="compact-thumb-placeholder">📦</span>
                  )}
                  {p.price_dspct > 0 && (
                    <span className="compact-discount-badge">
                      -{Number(p.price_dspct)}%
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
                    <span className="compact-name">{p.items_iname}</span>
                    {p.bsins_cname && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedShop(p.shop);
                        }}
                        className="compact-shop-badge"
                        title={`Show only ${p.bsins_cname} products`}
                      >
                        🏪 {p.bsins_cname}
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
                        ৳{finalPrice.toFixed(2)}
                      </span>
                      {p.discount > 0 && (
                        <span className="compact-price-old">
                          ৳{p.price_mrrat.toFixed(2)}
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
                          handleAddToCart(p);
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
          cart={cartItems}
          onAddToCart={handleAddToCart}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />
      )}
    </section>
  );
}
