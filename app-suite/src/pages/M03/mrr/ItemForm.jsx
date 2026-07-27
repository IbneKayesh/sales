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
          <InputText
            label="Price List Id"
            placeholder="Enter price list id"
            value={formData.mrrdc_price}
            onChange={(e) => onChange("mrrdc_price", e.target.value)}
            error={formErrors.mrrdc_price}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
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
        <div className="col-span-2">
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
            label="VAT %"
            placeholder="0.00"
            value={formData.mrrdc_sdvat}
            onChange={(e) => onChange("mrrdc_sdvat", e.target.value)}
            error={formErrors.mrrdc_sdvat}
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
        <div className="col-span-2">
          <InputNumber
            label="Other Cost"
            placeholder="0.00"
            value={formData.mrrdc_otcst}
            onChange={(e) => onChange("mrrdc_otcst", e.target.value)}
            error={formErrors.mrrdc_otcst}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-8">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.mrrdc_notes}
            onChange={(e) => onChange("mrrdc_notes", e.target.value)}
            error={formErrors.mrrdc_notes}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Ref Id"
            placeholder="Enter reference id"
            value={formData.mrrdc_refid}
            onChange={(e) => onChange("mrrdc_refid", e.target.value)}
            error={formErrors.mrrdc_refid}
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
