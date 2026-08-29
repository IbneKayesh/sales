import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import { IconPlus } from "@/icons";

const RMPMSTOCKForm = ({
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
            label="Item Stock"
            options={items_Options}
            value={formData.stock_id}
            onChange={(e) => onChange("stock_id", e.target.value)}
            error={formErrors.stock_id}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="stock_id"
            optionLabel="price_cname"
            optionGrid="price_cname:Name,units_cname:Unit,stock_cprat:Cost Price,stock_ohqty:Current Stock,stock_batch:Batch"
          />
        </div>
        <div className="col-span-12 mt-5"></div>
        <div className="col-span-12 mt-5"></div>
        <div className="col-span-12 mt-5"></div>
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
export default RMPMSTOCKForm;
