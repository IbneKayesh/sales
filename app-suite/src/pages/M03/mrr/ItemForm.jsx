import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import { IconPlus } from "@/icons";
import Badge from "@/components/Badge";
import { txmod_Options } from "@/utils/vtable.js";

const ItemForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onAddToList,
  items_Options,
  itemTaxList,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-12">
          <Dropdown
            label="Item"
            options={items_Options}
            value={formData.mrrdc_price}
            onChange={(e) => onChange("mrrdc_price", e.target.value)}
            error={formErrors.mrrdc_price}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="price_id"
            optionLabel="price_cname"
            optionGrid="price_cname:Item, runit_uname:Unit, price_lprat:l.Purchase, price_gdstk:g.Stock, items_itype:Type, items_prvat:VAT (%), items_ptvat:VAT Type"
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
        <div className="col-span-2">
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
            label="Disc (%)"
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
            label="VAT (%)"
            placeholder="0.00"
            value={formData.mrrdc_vtpct}
            onChange={(e) => onChange("mrrdc_vtpct", e.target.value)}
            error={formErrors.mrrdc_vtpct}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="VAT Type"
            options={txmod_Options}
            value={formData.mrrdc_vtype}
            onChange={(e) => onChange("mrrdc_vtype", e.target.value)}
            error={formErrors.mrrdc_vtype}
            placeholder="Select..."
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
        <Button
          variant="outline"
          onClick={() => onAddToList("NEXT")}
          disabled={isBusy || readOnly}
        >
          <IconPlus size={16} className="icon-left" />
          Add and Next
        </Button>
        <Button
          variant="outline"
          onClick={() => onAddToList("CLOSE")}
          disabled={isBusy || readOnly}
        >
          <IconPlus size={16} className="icon-left" />
          Add
        </Button>
      </div>
    </div>
  );
};
export default ItemForm;
