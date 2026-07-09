import { FiCamera, FiAlertTriangle, FiX } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import FormField from "@/components/ui/FormField";

export default function ProductFormModal({
  isBusy,
  formData,
  onChange,
  runit_options,
  scatg_options,
  fileInputRef,
  onImageUpload,
  onCloseModal,
  onSubmit,
}) {
  return (
    <div className="product-modal-overlay" onClick={onCloseModal}>
      <div className="product-modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="product-modal-header">
          <h3 className="product-modal-title">
            {formData.id !== null ? "Edit Product" : "Add Product"}
          </h3>
          <button onClick={onCloseModal} className="product-modal-close">
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
                {formData.image ? (
                  <img
                    src={formData.image}
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
              onChange={onImageUpload}
            />
          </FormField>

          <FormField label="Product Name" htmlFor="items_iname">
            <Input
              name="items_iname"
              placeholder="Product name"
              value={formData.items_iname}
              onChange={(e) => onChange("items_iname", e.target.value)}
            />
          </FormField>

          <div className="product-form-grid">
            <FormField label="Unit" htmlFor="items_runit">
              <Select
                name="items_runit"
                value={formData.items_runit}
                onChange={(e) => onChange("items_runit", e.target.value)}
              >
                <option value="">Select unit</option>
                {runit_options.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Category" htmlFor="items_scatg">
              <Select
                name="items_scatg"
                value={formData.items_scatg}
                onChange={(e) => onChange("items_scatg", e.target.value)}
              >
                <option value="">Select category</option>
                {scatg_options.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
          <div className="product-form-grid">
            <FormField label="Price (৳)" htmlFor="price_mrrat">
              <Input
                type="number"
                name="price_mrrat"
                min={0}
                step={0.01}
                placeholder="0.00"
                value={formData.price_mrrat || ""}
                onChange={(e) =>
                  onChange("price_mrrat", Number(e.target.value) || 0)
                }
              />
            </FormField>
            <FormField label="Discount (%)" htmlFor="price_dspct">
              <Input
                type="number"
                name="price_dspct"
                min={0}
                max={100}
                placeholder="0"
                value={formData.price_dspct || ""}
                onChange={(e) =>
                  onChange("price_dspct", Number(e.target.value) || 0)
                }
              />
            </FormField>
          </div>

          <FormField label="Stock Quantity" htmlFor="price_gdstk">
            <Input
              type="number"
              name="price_gdstk"
              min={0}
              placeholder="0 = out of stock"
              value={formData.price_gdstk ?? ""}
              onChange={(e) =>
                onChange(
                  "price_gdstk",
                  Math.max(0, Number(e.target.value) || 0),
                )
              }
            />
            {formData.price_gdstk > 0 && formData.price_gdstk <= 5 && (
              <div className="product-lowstock-warning">
                <FiAlertTriangle size={12} /> Low stock — only{" "}
                {formData.price_gdstk} units
              </div>
            )}
          </FormField>

          <div className="product-form-actions">
            <Button
              variant="secondary"
              className="product-form-btn"
              onClick={onCloseModal}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="product-form-btn"
              onClick={onSubmit}
              disabled={!formData.items_iname.trim() || isBusy}
            >
              {formData.id !== null ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
