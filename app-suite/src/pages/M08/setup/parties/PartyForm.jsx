import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";
import { party_ptype_Options } from "@/utils/vtable.js";

const PartyForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-4">
          <Dropdown
            label="Party Type"
            options={party_ptype_Options}
            value={formData.party_ptype}
            onChange={(e) => onChange("party_ptype", e.target.value)}
            error={formErrors.party_ptype}
            required
            placeholder="Select party type..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Party Name"
            placeholder="Enter party name"
            value={formData.party_cname}
            onChange={(e) => onChange("party_cname", e.target.value)}
            error={formErrors.party_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Account"
            placeholder="Select account"
            value={formData.party_chtac}
            onChange={(e) => onChange("party_chtac", e.target.value)}
            error={formErrors.party_chtac}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputText
            label="Vendor"
            placeholder="Select vendor"
            value={formData.party_vndor}
            onChange={(e) => onChange("party_vndor", e.target.value)}
            error={formErrors.party_vndor}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputNumber
            label="Opening Balance"
            placeholder="Enter opening balance"
            value={formData.party_opbal}
            onChange={(e) => onChange("party_opbal", e.target.value)}
            error={formErrors.party_opbal}
            step="0.01"
            required
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.party_actve}
          cname={formData.crusr_cname}
          cdate={formData.party_crdat}
          uname={formData.upusr_cname}
          udate={formData.party_updat}
          rvnmr={formData.party_rvnmr}
        />
      )}
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
export default PartyForm;
