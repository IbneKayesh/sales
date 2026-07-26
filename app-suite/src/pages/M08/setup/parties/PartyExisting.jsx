import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";
import { party_ptype_Options } from "@/utils/vtable.js";

const PartyExisting = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
  vndor_Options,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-6">
          <Dropdown
            label="Party Type"
            options={party_ptype_Options.filter((p) => p.auto_create)}
            value={formData.party_ptype}
            onChange={(e) => onChange("party_ptype", e.target.value)}
            error={formErrors.party_ptype}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          {/* <InputText
            label="Vendor Code"
            placeholder="Enter vendor code"
            value={formData.party_vndor}
            onChange={(e) => onChange("party_vndor", e.target.value)}
            error={formErrors.party_vndor}
            required
            disabled={readOnly}
          /> */}
        {/* {JSON.stringify(vndor_Options)} */}
          <Dropdown
            label="Vendor Code"
            options={vndor_Options}
            value={formData.party_vndor}
            onChange={(e) => onChange("party_vndor", e.target.value)}
            error={formErrors.party_vndor}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="cname"
          />
        </div>
      </div>
      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel} disabled={isBusy}>
          <IconClose size={16} className="icon-left" />
          Cancel
        </Button>
        <Button variant="info" onClick={onSubmit} disabled={isBusy}>
          <IconSave size={16} className="icon-left" />
          {formData?.id ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );
};
export default PartyExisting;
