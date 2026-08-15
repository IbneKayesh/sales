import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import InputLabel from "@/components/InputLabel";
import { IconPlus } from "@/icons";

const ItemForm = ({
  isBusy,
  readOnly,
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
            value={formData.invcc_stock}
            onChange={(e) => onChange("invcc_stock", e.target.value)}
            error={formErrors.invcc_stock}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="stock_id"
            optionLabel="price_cname"
            optionGrid="price_cname:Item, runit_uname:Unit, price_mrrat:MRP, price_dspct:Disc%, items_sdvat: VAT%, price_gdstk:g.Stock,stock_ohqty:Line Stock, items_icode:Code, stock_batch:Batch, stock_srial:Serial, stock_fgdat: MFG, "
          />
        </div>
        <div className="col-span-4">
          <InputNumber
            label="Rate"
            placeholder="0.00"
            value={formData.invcc_itrat}
            onChange={(e) => onChange("invcc_itrat", e.target.value)}
            error={formErrors.invcc_itrat}
            step="0.01"
            disabled={readOnly || true}
          />
        </div>
        <div className="col-span-4">
          <InputNumber
            label="Quantity"
            placeholder="0"
            value={formData.invcc_itqty}
            onChange={(e) => onChange("invcc_itqty", e.target.value)}
            error={formErrors.invcc_itqty}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputLabel label="Disc (%)" value={formData.invcc_dspct} />
        </div>
        <div className="col-span-2">
          <InputLabel label="VAT (%)" value={formData.invcc_vtpct} />
        </div>
        <div className="col-span-8">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.invcc_notes}
            onChange={(e) => onChange("invcc_notes", e.target.value)}
            error={formErrors.invcc_notes}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputLabel label="Stock" value={formData.stock_ohqty || 0} />
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
