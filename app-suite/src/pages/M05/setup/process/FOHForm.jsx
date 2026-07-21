import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import { IconPlus } from "@/icons";

const FOHForm = ({
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
      <h4>Input → FOH</h4>
      <div className="grid">
        <div className="col-span-3">
          <Dropdown
            label="Type"
            options={[{ label: "Factory Overhead (FOH)", value: "FOH" }]}
            value={formData.prfoh_types}
            onChange={(e) => onChange("prfoh_types", e.target.value)}
            error={formErrors.prfoh_types}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Item"
            options={items_Options}
            value={formData.prfoh_items}
            onChange={(e) => onChange("prfoh_items", e.target.value)}
            error={formErrors.prfoh_items}
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
            value={formData.prfoh_foqty}
            onChange={(e) => onChange("prfoh_foqty", e.target.value)}
            error={formErrors.prfoh_foqty}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Ratio"
            placeholder="Enter ratio"
            value={formData.prfoh_forto}
            onChange={(e) => onChange("prfoh_forto", e.target.value)}
            error={formErrors.prfoh_forto}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Rate"
            placeholder="Enter rate"
            value={formData.prfoh_forat}
            onChange={(e) => onChange("prfoh_forat", e.target.value)}
            error={formErrors.prfoh_forat}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Unit"
            options={units_Options}
            value={formData.prfoh_units}
            onChange={(e) => onChange("prfoh_units", e.target.value)}
            error={formErrors.prfoh_units}
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
            value={formData.prfoh_notes}
            onChange={(e) => onChange("prfoh_notes", e.target.value)}
            error={formErrors.prfoh_notes}
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
export default FOHForm;
