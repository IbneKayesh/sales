import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import { IconPlus } from "@/icons";
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
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-12">
          <Dropdown
            label="Item"
            options={items_Options}
            value={formData.pordc_price}
            onChange={(e) => onChange("pordc_price", e.target.value)}
            error={formErrors.pordc_price}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="price_id"
            optionLabel="price_cname"
            optionGrid="price_cname:Item, runit_cname:Unit, price_lprat:l.Purchase, price_gdstk:g.Stock, items_itype:Type, items_prvat:VAT (%), items_ptvat:VAT Type"
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Rate"
            placeholder="0.00"
            value={formData.pordc_itrat}
            onChange={(e) => onChange("pordc_itrat", e.target.value)}
            error={formErrors.pordc_itrat}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Quantity"
            placeholder="0"
            value={formData.pordc_itqty}
            onChange={(e) => onChange("pordc_itqty", e.target.value)}
            error={formErrors.pordc_itqty}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Disc (%)"
            placeholder="0.00"
            value={formData.pordc_dspct}
            onChange={(e) => onChange("pordc_dspct", e.target.value)}
            error={formErrors.pordc_dspct}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="VAT (%)"
            placeholder="0.00"
            value={formData.pordc_vtpct}
            onChange={(e) => onChange("pordc_vtpct", e.target.value)}
            error={formErrors.pordc_vtpct}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="VAT Type"
            options={txmod_Options}
            value={formData.pordc_vtype}
            onChange={(e) => onChange("pordc_vtype", e.target.value)}
            error={formErrors.pordc_vtype}
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        
        <div className="col-span-12">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.pordc_notes}
            onChange={(e) => onChange("pordc_notes", e.target.value)}
            error={formErrors.pordc_notes}
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
