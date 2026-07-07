import { FiCamera, FiAlertTriangle, FiX } from "react-icons/fi";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import FormField from "../../components/ui/FormField";

const categories = [
  "Groceries",
  "Electronics",
  "Clothing",
  "Home",
  "Beauty",
  "Other",
];

export default function ProductFormModal({
  editingIdx,
  closeModal,
  shops,
  form,
  handleChange,
  saveProduct,
  fileInputRef,
  handleImageUpload,
  isBusy,
}) {
  return (
    <div className="product-modal-overlay" onClick={closeModal}>
      <div className="product-modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="product-modal-header">
          <h3 className="product-modal-title">
            {editingIdx !== null ? "Edit Product" : "Add Product"}
          </h3>
          <button onClick={closeModal} className="product-modal-close">
            <FiX />
          </button>
        </div>

        <div className="product-form-body">
          {/* Image upload */}
          <FormField label="Product Image" htmlFor="product-image">
            <div className="product-image-upload-row">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="product-image-box"
              >
                {form.image ? (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="product-image-preview"
                  />
                ) : (
                  <FiCamera />
                )}
              </div>
              <div className="product-image-hint">
                Tap to upload photo
                <br />
                Max 2MB
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              id="product-image"
              name="product-image"
              accept="image/*"
              className="product-hidden-input"
              onChange={handleImageUpload}
            />
          </FormField>

          <FormField label="Product Name" htmlFor="product-name">
            <Input
              id="product-name"
              name="product-name"
              placeholder="Product name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </FormField>

          <FormField label="Shop / Vendor" htmlFor="product-shop">
            <Select
              id="product-shop"
              name="product-shop"
              value={form.shop}
              onChange={(e) => handleChange("shop", e.target.value)}
            >
              <option value="">Select shop</option>
              {shops.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Category" htmlFor="product-category">
            <Select
              id="product-category"
              name="product-category"
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </FormField>

          <div className="product-form-grid">
            <FormField label="Price (₹)" htmlFor="product-price">
              <Input
                type="number"
                id="product-price"
                name="product-price"
                min={0}
                step={0.01}
                placeholder="0.00"
                value={form.price || ""}
                onChange={(e) =>
                  handleChange("price", Number(e.target.value) || 0)
                }
              />
            </FormField>
            <FormField label="Discount (%)" htmlFor="product-discount">
              <Input
                type="number"
                id="product-discount"
                name="product-discount"
                min={0}
                max={100}
                placeholder="0"
                value={form.discount || ""}
                onChange={(e) =>
                  handleChange("discount", Number(e.target.value) || 0)
                }
              />
            </FormField>
          </div>

          <FormField label="Stock Quantity" htmlFor="product-stock">
            <Input
              type="number"
              id="product-stock"
              name="product-stock"
              min={0}
              placeholder="0 = out of stock"
              value={form.stock ?? ""}
              onChange={(e) =>
                handleChange("stock", Math.max(0, Number(e.target.value) || 0))
              }
            />
            {form.stock > 0 && form.stock <= 5 && (
              <div className="product-lowstock-warning">
                <FiAlertTriangle size={12} /> Low stock — only {form.stock}{" "}
                units
              </div>
            )}
          </FormField>

          <div className="product-form-actions">
            <Button
              variant="secondary"
              className="product-form-btn"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="product-form-btn"
              onClick={saveProduct}
              disabled={!form.name.trim() || isBusy}
            >
              {editingIdx !== null ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
