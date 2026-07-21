import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import { IconPlus } from "@/icons";

const group_Options = [
  { label: "Main", value: "MAIN" },
  { label: "Co-Product (CO)", value: "CO" },
  { label: "By-Product (BY)", value: "BY" },
];

const SFGForm = ({
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
      <h4>Output → SFG/FG</h4>
      <div className="grid">
        <div className="col-span-3">
          <Dropdown
            label="Group"
            options={group_Options}
            value={formData.bosfg_group}
            onChange={(e) => onChange("bosfg_group", e.target.value)}
            error={formErrors.bosfg_group}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Type"
            options={[
              { label: "FG", value: "FG" },
              { label: "Semi-FG", value: "SFG" },
            ]}
            value={formData.bosfg_types}
            onChange={(e) => onChange("bosfg_types", e.target.value)}
            error={formErrors.bosfg_types}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Item"
            options={items_Options}
            value={formData.bosfg_items}
            onChange={(e) => onChange("bosfg_items", e.target.value)}
            error={formErrors.bosfg_items}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="items_iname"
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Quantity"
            placeholder="Enter qty"
            value={formData.bosfg_fgqty}
            onChange={(e) => onChange("bosfg_fgqty", e.target.value)}
            error={formErrors.bosfg_fgqty}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Ratio"
            placeholder="Enter ratio"
            value={formData.bosfg_fgrto}
            onChange={(e) => onChange("bosfg_fgrto", e.target.value)}
            error={formErrors.bosfg_fgrto}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Rate"
            placeholder="Enter rate"
            value={formData.bosfg_fgrat}
            onChange={(e) => onChange("bosfg_fgrat", e.target.value)}
            error={formErrors.bosfg_fgrat}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Unit"
            options={units_Options}
            value={formData.bosfg_units}
            onChange={(e) => onChange("bosfg_units", e.target.value)}
            error={formErrors.bosfg_units}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="units_cname"
          />
        </div>
        <div className="col-span-5">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.bosfg_notes}
            onChange={(e) => onChange("bosfg_notes", e.target.value)}
            error={formErrors.bosfg_notes}
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
export default SFGForm;
