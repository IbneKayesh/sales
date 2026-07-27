import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import { IconPlus, } from "@/icons";

const RMPMForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onAddToList,
  items_Options,
  units_Options,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-4">
          <Dropdown
            label="Type"
            options={[
              { label: "Raw Material (RM)", value: "RM" },
              { label: "Packing Material (PM)", value: "PM" },
              { label: "Semi-FG", value: "SFG" },
              { label: "FG", value: "FG" },
            ]}
            value={formData.borpm_types}
            onChange={(e) => onChange("borpm_types", e.target.value)}
            error={formErrors.borpm_types}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <Dropdown
            label="Item"
            options={items_Options}
            value={formData.borpm_items}
            onChange={(e) => onChange("borpm_items", e.target.value)}
            error={formErrors.borpm_items}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="items_iname"
          />
        </div>
        <div className="col-span-4">
          <InputNumber
            label="Quantity"
            placeholder="Enter qty"
            value={formData.borpm_rmqty}
            onChange={(e) => onChange("borpm_rmqty", e.target.value)}
            error={formErrors.borpm_rmqty}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputNumber
            label="Ratio"
            placeholder="Enter ratio"
            value={formData.borpm_rmrto}
            onChange={(e) => onChange("borpm_rmrto", e.target.value)}
            error={formErrors.borpm_rmrto}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputNumber
            label="Rate"
            placeholder="Enter rate"
            value={formData.borpm_rmrat}
            onChange={(e) => onChange("borpm_rmrat", e.target.value)}
            error={formErrors.borpm_rmrat}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <Dropdown
            label="Unit"
            options={units_Options}
            value={formData.borpm_units}
            onChange={(e) => onChange("borpm_units", e.target.value)}
            error={formErrors.borpm_units}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="units_cname"
          />
        </div>
        <div className="col-span-12">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.borpm_notes}
            onChange={(e) => onChange("borpm_notes", e.target.value)}
            error={formErrors.borpm_notes}
            disabled={readOnly}
          />
        </div>
      </div>
      <div className="form-actions">
        <Button variant="outline" onClick={onAddToList} disabled={isBusy}>
          <IconPlus size={16} className="icon-left" />
          Add
        </Button>
      </div>
    </div>
  );
};
export default RMPMForm;
