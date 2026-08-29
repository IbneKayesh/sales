import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import InputLabel from "@/components/InputLabel";
import { IconPlus } from "@/icons";
import { itype_Options } from "@/utils/vtable.js";

const RMPMForm = ({
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
        <div className="col-span-4">
          <Dropdown
            label="Type"
            options={itype_Options.filter((x) => x.input)}
            value={formData.borpm_itype}
            onChange={(e) => onChange("borpm_itype", e.target.value)}
            error={formErrors.borpm_itype}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-8">
          <Dropdown
            label="Item"
            options={items_Options}
            value={formData.borpm_price}
            onChange={(e) => onChange("borpm_price", e.target.value)}
            error={formErrors.borpm_price}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="price_id"
            optionLabel="price_cname"
            optionGrid="price_cname:Name,runit_uname:Unit,items_itype:Type,price_mrrat:MRP,items_icode:Code"
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Quantity"
            placeholder="Enter qty"
            value={formData.borpm_rmqty}
            onChange={(e) => onChange("borpm_rmqty", e.target.value)}
            error={formErrors.borpm_rmqty}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Ratio"
            placeholder="Enter ratio"
            value={formData.borpm_rmrto}
            onChange={(e) => onChange("borpm_rmrto", e.target.value)}
            error={formErrors.borpm_rmrto}
            step="0.01"
            disabled={readOnly || true}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Rate"
            placeholder="Enter rate"
            value={formData.borpm_rmrat}
            onChange={(e) => onChange("borpm_rmrat", e.target.value)}
            error={formErrors.borpm_rmrat}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputLabel label="Unit" value={formData.runit_uname} />
        </div>
        <div className="col-span-12">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.borpm_notes}
            onChange={(e) => onChange("borpm_notes", e.target.value)}
            error={formErrors.borpm_notes}
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
export default RMPMForm;
