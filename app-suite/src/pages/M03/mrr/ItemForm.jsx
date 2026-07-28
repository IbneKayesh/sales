import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import { IconPlus } from "@/icons";

const ItemForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onAddToList,
  items_Options,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-12">
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
        <div className="col-span-3">
          <InputNumber
            label="Rate"
            placeholder="0.00"
            value={formData.mrrdc_itrat}
            onChange={(e) => onChange("mrrdc_itrat", e.target.value)}
            error={formErrors.mrrdc_itrat}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Quantity"
            placeholder="0"
            value={formData.mrrdc_itqty}
            onChange={(e) => onChange("mrrdc_itqty", e.target.value)}
            error={formErrors.mrrdc_itqty}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Disc %"
            placeholder="0.00"
            value={formData.mrrdc_dspct}
            onChange={(e) => onChange("mrrdc_dspct", e.target.value)}
            error={formErrors.mrrdc_dspct}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="iVAT %"
            placeholder="0.00"
            value={formData.mrrdc_ivpct}
            onChange={(e) => onChange("mrrdc_ivpct", e.target.value)}
            error={formErrors.mrrdc_ivpct}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="VAT %"
            placeholder="0.00"
            value={formData.mrrdc_vtpct}
            onChange={(e) => onChange("mrrdc_vtpct", e.target.value)}
            error={formErrors.mrrdc_vtpct}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="TAX %"
            placeholder="0.00"
            value={formData.mrrdc_txpct}
            onChange={(e) => onChange("mrrdc_txpct", e.target.value)}
            error={formErrors.mrrdc_txpct}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-10">
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
export default ItemForm;
