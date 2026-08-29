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
      <div className="grid">
        <div className="col-span-3">
          <Dropdown
            label="Group"
            options={group_Options}
            value={formData.prsfg_group}
            onChange={(e) => onChange("prsfg_group", e.target.value)}
            error={formErrors.prsfg_group}
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
            value={formData.prsfg_types}
            onChange={(e) => onChange("prsfg_types", e.target.value)}
            error={formErrors.prsfg_types}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Item"
            options={items_Options}
            value={formData.prsfg_items}
            onChange={(e) => onChange("prsfg_items", e.target.value)}
            error={formErrors.prsfg_items}
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
            value={formData.prsfg_fgqty}
            onChange={(e) => onChange("prsfg_fgqty", e.target.value)}
            error={formErrors.prsfg_fgqty}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Ratio"
            placeholder="Enter ratio"
            value={formData.prsfg_fgrto}
            onChange={(e) => onChange("prsfg_fgrto", e.target.value)}
            error={formErrors.prsfg_fgrto}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Rate"
            placeholder="Enter rate"
            value={formData.prsfg_fgrat}
            onChange={(e) => onChange("prsfg_fgrat", e.target.value)}
            error={formErrors.prsfg_fgrat}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Unit"
            options={units_Options}
            value={formData.prsfg_units}
            onChange={(e) => onChange("prsfg_units", e.target.value)}
            error={formErrors.prsfg_units}
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
            value={formData.prsfg_notes}
            onChange={(e) => onChange("prsfg_notes", e.target.value)}
            error={formErrors.prsfg_notes}
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
