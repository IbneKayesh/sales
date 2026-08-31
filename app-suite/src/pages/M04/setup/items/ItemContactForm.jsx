import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import { IconPlus } from "@/icons";
import { csmod_Options, clmod_Options } from "@/utils/vtable";

const ItemContactForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onSubmit,
  cntct_Options,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-12 mb-5">
          <Dropdown
            label="Name"
            options={cntct_Options}
            value={formData.itmct_cntct}
            onChange={(e) => onChange("itmct_cntct", e.target.value)}
            error={formErrors.itmct_cntct}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="cntct_cname"
            optionGrid="cntct_cname:Name,cntct_cntps:Person,cntct_cntno:Contact,cntct_ofadr:Address"
          />
        </div>
        <div className="col-span-12 mt-5 text-red-500">{formErrors.itmct_items}</div>
        <div className="col-span-12 mt-5"></div>
        <div className="col-span-12 mt-5"></div>
      </div>
      <div className="form-actions">
        <Button
          variant="outline"
          onClick={onSubmit}
          disabled={isBusy || readOnly}
        >
          <IconPlus size={16} className="icon-left" />
          Add
        </Button>
      </div>
    </div>
  );
};
export default ItemContactForm;
