import { FiX } from "react-icons/fi";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import FormField from "../../components/ui/FormField";

export default function ShopFormModal({
  editingIdx,
  closeModal,
  form,
  handleChange,
  saveShop,
  isBusy,
}) {
  return (
    <div className="shop-modal-overlay" onClick={closeModal}>
      <div className="shop-modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="shop-modal-header">
          <h3 className="shop-modal-title">
            {editingIdx !== null ? "Edit Shop" : "Add Shop / Vendor"}
          </h3>
          <button onClick={closeModal} className="shop-modal-close">
            <FiX />
          </button>
        </div>

        <div className="shop-form-body">
          <FormField label="Shop Name" htmlFor="shop-name">
            <Input
              id="shop-name"
              name="shop-name"
              placeholder="e.g. Fresh Mart"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </FormField>

          <FormField label="Description" htmlFor="shop-description">
            <Textarea
              id="shop-description"
              name="shop-description"
              placeholder="What does this shop offer?"
              rows={2}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </FormField>

          <div className="shop-form-grid">
            <FormField label="Contact" htmlFor="shop-contact">
              <Input
                type="tel"
                id="shop-contact"
                name="shop-contact"
                placeholder="Phone number"
                value={form.contact}
                onChange={(e) => handleChange("contact", e.target.value)}
              />
            </FormField>
            <FormField label="Address" htmlFor="shop-address">
              <Input
                id="shop-address"
                name="shop-address"
                placeholder="Shop address"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </FormField>
          </div>

          <div className="shop-form-actions">
            <Button
              variant="secondary"
              className="shop-form-btn"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="shop-form-btn"
              onClick={saveShop}
              disabled={!form.name.trim() || isBusy}
            >
              {editingIdx !== null ? "Update Shop" : "Add Shop"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
