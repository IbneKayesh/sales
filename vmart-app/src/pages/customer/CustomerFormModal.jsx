import { FiX } from "react-icons/fi";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import FormField from "../../components/ui/FormField";

export default function CustomerFormModal({ editingIdx, closeModal, form, handleChange, saveCustomer, isBusy }) {
  return (
    <div className="customer-modal-overlay" onClick={closeModal}>
      <div className="customer-modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="customer-modal-header">
          <h3 className="customer-modal-title">{editingIdx !== null ? "Edit Customer" : "Add Customer"}</h3>
          <button onClick={closeModal} className="customer-modal-close"><FiX /></button>
        </div>

        <div className="customer-form-body">
          <FormField label="Customer Name" htmlFor="customer-name">
            <Input id="customer-name" name="customer-name" placeholder="Full name"
              value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
          </FormField>

          <FormField label="Contact No" htmlFor="customer-contact">
            <Input type="tel" id="customer-contact" name="customer-contact" placeholder="Phone number"
              value={form.contact} onChange={(e) => handleChange("contact", e.target.value)} />
          </FormField>

          <FormField label="Address" htmlFor="customer-address">
            <Textarea id="customer-address" name="customer-address" placeholder="Address" rows={2}
              value={form.address} onChange={(e) => handleChange("address", e.target.value)} />
          </FormField>

          <div className="customer-form-actions">
            <Button variant="secondary" className="customer-form-btn" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" className="customer-form-btn" onClick={saveCustomer} disabled={!form.name.trim() || isBusy}>
              {editingIdx !== null ? "Update Customer" : "Add Customer"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
