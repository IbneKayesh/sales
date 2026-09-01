import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import InputLabel from "@/components/InputLabel";
import { IconPlus } from "@/icons";
import { itype_Options } from "@/utils/vtable.js";

const group_Options = [
  { label: "Main", value: "MAIN" },
  { label: "Co-Product (CO)", value: "CO" },
  { label: "By-Product (BY)", value: "BY" },
];

const SFGForm = ({
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
        <div className="col-span-3">
          <Dropdown
            label="Group"
            options={group_Options}
            value={formData.bosfg_group}
            onChange={(e) => onChange("bosfg_group", e.target.value)}
            error={formErrors.bosfg_group}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Type"
            options={itype_Options.filter((x) => x.output)}
            value={formData.bosfg_itype}
            onChange={(e) => onChange("bosfg_itype", e.target.value)}
            error={formErrors.bosfg_itype}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <Dropdown
            label="Item"
            options={items_Options}
            value={formData.bosfg_price}
            onChange={(e) => onChange("bosfg_price", e.target.value)}
            error={formErrors.bosfg_price}
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
            value={formData.bosfg_fgqty}
            onChange={(e) => onChange("bosfg_fgqty", e.target.value)}
            error={formErrors.bosfg_fgqty}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Qty Ratio(%)"
            placeholder="Enter ratio"
            value={formData.bosfg_fgrto}
            onChange={(e) => onChange("bosfg_fgrto", e.target.value)}
            error={formErrors.bosfg_fgrto}
            step="0.01"
            disabled={readOnly || true}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Rate"
            placeholder="Enter rate"
            value={formData.bosfg_fgrat}
            onChange={(e) => onChange("bosfg_fgrat", e.target.value)}
            error={formErrors.bosfg_fgrat}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputLabel label="Unit" value={formData.runit_uname} />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Cost Ratio (%)"
            placeholder="Enter ratio"
            value={formData.bosfg_rtrto}
            onChange={(e) => onChange("bosfg_rtrto", e.target.value)}
            error={formErrors.bosfg_rtrto}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-12">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.bosfg_notes}
            onChange={(e) => onChange("bosfg_notes", e.target.value)}
            error={formErrors.bosfg_notes}
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
export default SFGForm;
