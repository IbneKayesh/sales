import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import { IconPlus } from "@/icons";

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
        <div className="col-span-3">
          <Dropdown
            label="Type"
            options={[
              { label: "Raw Material (RM)", value: "RM" },
              { label: "Packing Material (PM)", value: "PM" },
              { label: "Semi-FG", value: "SFG" },
              { label: "FG", value: "FG" },
            ]}
            value={formData.prrpm_types}
            onChange={(e) => onChange("prrpm_types", e.target.value)}
            error={formErrors.prrpm_types}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Item"
            options={items_Options}
            value={formData.prrpm_items}
            onChange={(e) => onChange("prrpm_items", e.target.value)}
            error={formErrors.prrpm_items}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="items_iname"
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Quantity"
            placeholder="Enter qty"
            value={formData.prrpm_rmqty}
            onChange={(e) => onChange("prrpm_rmqty", e.target.value)}
            error={formErrors.prrpm_rmqty}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Ratio"
            placeholder="Enter ratio"
            value={formData.prrpm_rmrto}
            onChange={(e) => onChange("prrpm_rmrto", e.target.value)}
            error={formErrors.prrpm_rmrto}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Rate"
            placeholder="Enter rate"
            value={formData.prrpm_rmrat}
            onChange={(e) => onChange("prrpm_rmrat", e.target.value)}
            error={formErrors.prrpm_rmrat}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Unit"
            options={units_Options}
            value={formData.prrpm_units}
            onChange={(e) => onChange("prrpm_units", e.target.value)}
            error={formErrors.prrpm_units}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="units_cname"
          />
        </div>
        <div className="col-span-9">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.prrpm_notes}
            onChange={(e) => onChange("prrpm_notes", e.target.value)}
            error={formErrors.prrpm_notes}
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
