import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import { IconClose, IconSave } from "@/icons";

const sfgGroup_Options = [
  { label: "Main (MAIN)", value: "MAIN" },
  { label: "Co-Product (CO)", value: "CO" },
  { label: "By-Product (BY)", value: "BY" },
];

const sfgInOut_Options = [
  { label: "Input", value: "Input" },
  { label: "Output", value: "Output" },
];

const OutputSFGForm = ({
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
            value={formData.bosfg_items}
            onChange={(e) => onChange("bosfg_items", e.target.value)}
            error={formErrors.bosfg_items}
            required
            placeholder="Select item..."
            optionValue="id"
            optionLabel="items_iname"
          />
        </div>
        <div className="col-span-3">
          <InputText
            label="Type"
            placeholder="Enter type (SFG/FG)"
            value={formData.bosfg_types}
            onChange={(e) => onChange("bosfg_types", e.target.value)}
            error={formErrors.bosfg_types}
            required
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="I/O"
            options={sfgInOut_Options}
            value={formData.bosfg_inout}
            onChange={(e) => onChange("bosfg_inout", e.target.value)}
            error={formErrors.bosfg_inout}
            required
            placeholder="Select..."
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Group"
            options={sfgGroup_Options}
            value={formData.bosfg_group}
            onChange={(e) => onChange("bosfg_group", e.target.value)}
            error={formErrors.bosfg_group}
            required
            placeholder="Select..."
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Quantity"
            placeholder="Enter qty"
            value={formData.bosfg_rmqty}
            onChange={(e) => onChange("bosfg_rmqty", e.target.value)}
            error={formErrors.bosfg_rmqty}
            step="0.01"
          />
        </div>
      </div>
      <div className="grid">
        <div className="col-span-2">
          <InputNumber
            label="Ratio"
            placeholder="Enter ratio"
            value={formData.bosfg_rmrto}
            onChange={(e) => onChange("bosfg_rmrto", e.target.value)}
            error={formErrors.bosfg_rmrto}
            step="0.01"
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Rate"
            placeholder="Enter rate"
            value={formData.bosfg_rmrat}
            onChange={(e) => onChange("bosfg_rmrat", e.target.value)}
            error={formErrors.bosfg_rmrat}
            step="0.01"
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Value"
            placeholder="Enter value"
            value={formData.bosfg_rmval}
            onChange={(e) => onChange("bosfg_rmval", e.target.value)}
            error={formErrors.bosfg_rmval}
            step="0.01"
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Unit"
            options={unitsOptions}
            value={formData.bosfg_units}
            onChange={(e) => onChange("bosfg_units", e.target.value)}
            error={formErrors.bosfg_units}
            required
            placeholder="Select unit..."
            optionValue="id"
            optionLabel="units_cname"
          />
        </div>
        <div className="col-span-3">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.bosfg_notes}
            onChange={(e) => onChange("bosfg_notes", e.target.value)}
            error={formErrors.bosfg_notes}
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
export default OutputSFGForm;
