import { useState } from "react";
import { InputText } from "primereact/inputtext";
import "./ProductsComp.css";

const ProductsComp = ({
  currencyIcon,
  dataListCategory,
  dataListProduct,
  dataListCart = [],
  activeCategory,
  onCategoryClick,
  onProductClick,
  onBarcodeSearch,
}) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    if (onBarcodeSearch(val)) {
      setSearchValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (onBarcodeSearch(searchValue)) {
        setSearchValue("");
      }
    }
  };

  return (
    <div className="products-comp">
      {/* {JSON.stringify(dataListProduct)} */}
      <div className="products-header">
        <div className="search-section">
          <InputText
            className="barcode-input"
            placeholder="Barcode or search ..."
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>

        <div className="categories-section">
          <button
            type="button"
            className={`category-btn ${activeCategory === null ? "active" : ""}`}
            onClick={() => onCategoryClick(null)}
          >
            All
          </button>
          {dataListCategory.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`category-btn ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => onCategoryClick(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="products-grid">
        {dataListProduct.map((prod) => {
          const inCart = dataListCart.some(
            (item) => item.amim_id === prod.amim_id,
          );
          return (
            <div
              key={prod.amim_id}
              className={`product-card ${inCart ? "in-cart" : ""}`}
              onClick={() => onProductClick(prod)}
            >
              <div className="product-image">
                {prod.amim_imgl ? (
                  <img src={prod.amim_imgl} alt={prod.amim_name} />
                ) : (
                  <div className="empty-placeholder">No Image</div>
                )}

                {prod.amim_bcod && (
                  <div className="product-barcode">{prod.amim_bcod}</div>
                )}
                {prod.itcl_name && (
                  <div className="product-category">{prod.itcl_name}</div>
                )}
                {prod.pldt_dfds > 0 && (
                  <div className="product-discount">
                    -{prod.pldt_dfds || 0}%
                  </div>
                )}
              </div>
              <div className="product-info">
                <div className="product-name">{prod.amim_name}</div>
                <div className="product-meta">
                  <div className="product-price">
                    {currencyIcon}
                    {prod.amim_mrpp}
                  </div>
                  <div className="product-tax">
                    Tax: {prod.amim_pvat || prod.amim_pexc || 0}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsComp;
