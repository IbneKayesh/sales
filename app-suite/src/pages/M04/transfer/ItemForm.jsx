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
            value={formData.trndc_refid}
            onChange={(e) => onChange("trndc_refid", e.target.value)}
            error={formErrors.trndc_refid}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="stock_id"
            optionLabel="price_cname"
            optionGrid="price_cname:Item, runit_cname:Unit, stock_cprat:C.Rate, stock_ohqty:Stock, items_itype:Type, stock_sorce:Source, stock_trnno:Ref, stock_trdat:Ref Date, stock_batch:Batch, stock_srial:Serial, stock_wrdat:Warranty, stock_fgdat:MFG, Expiry:stock_exdat"
            gridMaxHeight={120}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Rate"
            placeholder="0.00"
            value={formData.trndc_itrat}
            onChange={(e) => onChange("trndc_itrat", e.target.value)}
            error={formErrors.trndc_itrat}
            step="0.01"
            disabled={readOnly || true}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Quantity"
            placeholder="0"
            value={formData.trndc_itqty}
            onChange={(e) => onChange("trndc_itqty", e.target.value)}
            error={formErrors.trndc_itqty}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-8">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.trndc_notes}
            onChange={(e) => onChange("trndc_notes", e.target.value)}
            error={formErrors.trndc_notes}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-12 mt-5"></div>
        <div className="col-span-12 mt-5"></div>
        <div className="col-span-12 mt-5"></div>
        <div className="col-span-12 mt-5"></div>
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
