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
            value={formData.mrrdc_price}
            onChange={(e) => onChange("mrrdc_price", e.target.value)}
            error={formErrors.mrrdc_price}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="price_id"
            optionLabel="price_cname"
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
        {Number(formData.mrrdc_fcpct) < 0.1 ? (
          <div className="col-span-2">
            <InputNumber
              label="Fix Cost Amount"
              placeholder="0.00"
              value={formData.mrrdc_fcamt}
              onChange={(e) => onChange("mrrdc_fcamt", e.target.value)}
              error={formErrors.mrrdc_fcamt}
              step="0.01"
              disabled={readOnly}
            />
          </div>
        ) : (
          <div className="col-span-2">
            <InputNumber
              label="Fix Cost %"
              placeholder="0.00"
              value={formData.mrrdc_fcpct}
              onChange={(e) => onChange("mrrdc_fcpct", e.target.value)}
              error={formErrors.mrrdc_fcpct}
              step="0.01"
              disabled={true}
            />
          </div>
        )}
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
