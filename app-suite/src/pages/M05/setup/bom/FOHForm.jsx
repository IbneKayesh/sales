import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import InputLabel from "@/components/InputLabel";
import { IconPlus } from "@/icons";
import { itype_Options } from "@/utils/vtable.js";

const FOHForm = ({
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
            options={itype_Options.filter((x) => x.nostock)}
            value={formData.bofoh_itype}
            onChange={(e) => onChange("bofoh_itype", e.target.value)}
            error={formErrors.bofoh_itype}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-8">
          <Dropdown
            label="Item"
            options={items_Options}
            value={formData.bofoh_price}
            onChange={(e) => onChange("bofoh_price", e.target.value)}
            error={formErrors.bofoh_price}
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
            value={formData.bofoh_foqty}
            onChange={(e) => onChange("bofoh_foqty", e.target.value)}
            error={formErrors.bofoh_foqty}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Ratio"
            placeholder="Enter ratio"
            value={formData.bofoh_forto}
            onChange={(e) => onChange("bofoh_forto", e.target.value)}
            error={formErrors.bofoh_forto}
            step="0.01"
            disabled={readOnly || true}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Rate"
            placeholder="Enter rate"
            value={formData.bofoh_forat}
            onChange={(e) => onChange("bofoh_forat", e.target.value)}
            error={formErrors.bofoh_forat}
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
            value={formData.bofoh_notes}
            onChange={(e) => onChange("bofoh_notes", e.target.value)}
            error={formErrors.bofoh_notes}
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
export default FOHForm;
