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
            value={formData.bndlc_price}
            onChange={(e) => onChange("bndlc_price", e.target.value)}
            error={formErrors.bndlc_price}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="price_cname"
            optionGrid="price_cname:Item,price_ccode:Price Code,runit_cname:Unit,price_mrrat:MRP,items_icode:Item Code"
          />
        </div>
        <div className="col-span-6">
          <InputNumber
            label="Quantity"
            placeholder="0"
            value={formData.bndlc_itqty}
            onChange={(e) => onChange("bndlc_itqty", e.target.value)}
            error={formErrors.bndlc_itqty}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputNumber
            label="Rate"
            placeholder="0.00"
            value={formData.bndlc_itrat}
            onChange={(e) => onChange("bndlc_itrat", e.target.value)}
            error={formErrors.bndlc_itrat}
            step="0.01"
            disabled={readOnly || true}
          />
        </div>
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
