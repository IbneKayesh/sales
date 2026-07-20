import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import { IconClose, IconSave } from "@/icons";

const FOHForm = ({
  isBusy,
  formData,
  formErrors,
  itemOptions,
  unitsOptions,
  onChange,
  onCancel,
  onSubmit,
}) => {
  return (
    <div className="form-wrap" style={{ padding: "16px 0" }}>
      <div className="grid">
        <div className="col-span-3">
          <Dropdown
            label="Item"
            options={itemOptions}
            value={formData.bofoh_items}
            onChange={(e) => onChange("bofoh_items", e.target.value)}
            error={formErrors.bofoh_items}
            required
            placeholder="Select item..."
            optionValue="id"
            optionLabel="items_iname"
          />
        </div>
        <div className="col-span-3">
          <InputText
            label="Type"
            placeholder="Enter type (FOH)"
            value={formData.bofoh_types}
            onChange={(e) => onChange("bofoh_types", e.target.value)}
            error={formErrors.bofoh_types}
            required
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Quantity"
            placeholder="Enter qty"
            value={formData.bofoh_rmqty}
            onChange={(e) => onChange("bofoh_rmqty", e.target.value)}
            error={formErrors.bofoh_rmqty}
            step="0.01"
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Ratio"
            placeholder="Enter ratio"
            value={formData.bofoh_rmrto}
            onChange={(e) => onChange("bofoh_rmrto", e.target.value)}
            error={formErrors.bofoh_rmrto}
            step="0.01"
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Rate"
            placeholder="Enter rate"
            value={formData.bofoh_rmrat}
            onChange={(e) => onChange("bofoh_rmrat", e.target.value)}
            error={formErrors.bofoh_rmrat}
            step="0.01"
          />
        </div>
      </div>
      <div className="grid">
        <div className="col-span-3">
          <InputNumber
            label="Value"
            placeholder="Enter value"
            value={formData.bofoh_rmval}
            onChange={(e) => onChange("bofoh_rmval", e.target.value)}
            error={formErrors.bofoh_rmval}
            step="0.01"
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Unit"
            options={unitsOptions}
            value={formData.bofoh_units}
            onChange={(e) => onChange("bofoh_units", e.target.value)}
            error={formErrors.bofoh_units}
            required
            placeholder="Select unit..."
            optionValue="id"
            optionLabel="units_cname"
          />
        </div>
        <div className="col-span-6">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.bofoh_notes}
            onChange={(e) => onChange("bofoh_notes", e.target.value)}
            error={formErrors.bofoh_notes}
          />
        </div>
      </div>
      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel} disabled={isBusy}>
          <IconClose size={16} className="icon-left" />
          Cancel
        </Button>
        <Button variant="info" onClick={onSubmit} disabled={isBusy}>
          <IconSave size={16} className="icon-left" />
          {formData?.id ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );
};
export default FOHForm;
