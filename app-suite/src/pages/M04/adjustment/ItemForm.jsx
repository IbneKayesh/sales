import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import InputLabel from "@/components/InputLabel";
import { IconPlus } from "@/icons";
import { validNumber } from "@/utils/misc.js";

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
            value={formData.adjsc_refid}
            onChange={(e) => onChange("adjsc_refid", e.target.value)}
            error={formErrors.adjsc_refid}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="stock_id"
            optionLabel="price_cname"
            optionGrid="items_iname:Item, price_cname:Name, stock_cprat:Rate, units_cname:Unit, stock_ohqty:Stock, stock_trqty:Trn Qty, stock_sorce:Source, stock_trnno:Trn No, stock_trdat:Trn Date, stock_brcod:Barcode, stock_batch:Batch, stock_srial:Serial, stock_wrdat:Warranty, stock_fgdat:MFG, stock_exdat:Expiry"
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Rate"
            placeholder="0.00"
            value={formData.adjsc_itrat}
            onChange={(e) => onChange("adjsc_itrat", e.target.value)}
            error={formErrors.adjsc_itrat}
            step="0.01"
            disabled={readOnly || validNumber(formData.adjsc_itrat) > 0}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Quantity"
            placeholder="0"
            value={formData.adjsc_itqty}
            onChange={(e) => onChange("adjsc_itqty", e.target.value)}
            error={formErrors.adjsc_itqty}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.adjsc_notes}
            onChange={(e) => onChange("adjsc_notes", e.target.value)}
            error={formErrors.adjsc_notes}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
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
