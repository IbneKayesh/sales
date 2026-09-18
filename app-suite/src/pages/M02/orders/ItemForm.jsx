import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import { IconPlus } from "@/icons";
import InputLabel from "@/components/InputLabel";
import ConvertUOM from "@/components/common/ConvertUOM";
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
  const punit = (
    <ConvertUOM
      qty={formData.odrdc_itqty}
      dfQty={formData.items_pkqty}
      runit={formData.runit_cname}
      punit={formData.punit_cname}
    />
  );
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-12">
          <Dropdown
            label="Item"
            options={items_Options}
            value={formData.odrdc_stock}
            onChange={(e) => onChange("odrdc_stock", e.target.value)}
            error={formErrors.odrdc_stock}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="stock_id"
            optionLabel="price_cname"
            optionGrid="price_cname:Item, runit_cname:Unit, price_mrrat:MRP, price_dspct:Disc%, items_slvat:VAT%, items_stvat:VAT Type, price_gdstk:g.Stock, stock_ohqty:Line Stock, items_icode:Code, stock_batch:Batch, stock_srial:Serial"
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Rate"
            placeholder="0.00"
            value={formData.odrdc_itrat}
            onChange={(e) => onChange("odrdc_itrat", e.target.value)}
            error={formErrors.odrdc_itrat}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Quantity"
            placeholder="0"
            value={formData.odrdc_itqty}
            onChange={(e) => onChange("odrdc_itqty", e.target.value)}
            error={formErrors.odrdc_itqty}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Disc (%)"
            placeholder="0.00"
            value={formData.odrdc_dspct}
            onChange={(e) => onChange("odrdc_dspct", e.target.value)}
            error={formErrors.odrdc_dspct}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="VAT (%)"
            placeholder="0.00"
            value={formData.odrdc_vtpct}
            onChange={(e) => onChange("odrdc_vtpct", e.target.value)}
            error={formErrors.odrdc_vtpct}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="VAT Type"
            options={txmod_Options}
            value={formData.odrdc_vtype}
            onChange={(e) => onChange("odrdc_vtype", e.target.value)}
            error={formErrors.odrdc_vtype}
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputLabel label="Pack Unit" value={punit} />
        </div>
        <div className="col-span-9">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.odrdc_notes}
            onChange={(e) => onChange("odrdc_notes", e.target.value)}
            error={formErrors.odrdc_notes}
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
