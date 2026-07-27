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
      <div className="grid">
        <div className="col-span-4">
          <Dropdown
            label="Item"
            options={items_Options}
            value={formData.mrrdc_items}
            onChange={(e) => onChange("mrrdc_items", e.target.value)}
            error={formErrors.mrrdc_items}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="items_iname"
          />
        </div>
        <div className="col-span-4">
          <InputNumber
            label="Rate"
            placeholder="0.00"
            value={formData.mrrdc_trate}
            onChange={(e) => onChange("mrrdc_trate", e.target.value)}
            error={formErrors.mrrdc_trate}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputNumber
            label="Quantity"
            placeholder="0"
            value={formData.mrrdc_trqty}
            onChange={(e) => onChange("mrrdc_trqty", e.target.value)}
            error={formErrors.mrrdc_trqty}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-12">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.mrrdc_notes}
            onChange={(e) => onChange("mrrdc_notes", e.target.value)}
            error={formErrors.mrrdc_notes}
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
