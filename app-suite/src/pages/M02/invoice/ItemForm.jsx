import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
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
            value={formData.invcc_price}
            onChange={(e) => onChange("invcc_price", e.target.value)}
            error={formErrors.invcc_price}
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
            value={formData.invcc_itrat}
            onChange={(e) => onChange("invcc_itrat", e.target.value)}
            error={formErrors.invcc_itrat}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
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
          <InputNumber
            label="Disc %"
            placeholder="0.00"
            value={formData.invcc_dspct}
            onChange={(e) => onChange("invcc_dspct", e.target.value)}
            error={formErrors.invcc_dspct}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="VAT %"
            placeholder="0.00"
            value={formData.invcc_vtpct}
            onChange={(e) => onChange("invcc_vtpct", e.target.value)}
            error={formErrors.invcc_vtpct}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Fix Cost Amount"
            placeholder="0.00"
            value={formData.invcc_fcamt}
            onChange={(e) => onChange("invcc_fcamt", e.target.value)}
            error={formErrors.invcc_fcamt}
            step="0.01"
            disabled={readOnly}
          />
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
