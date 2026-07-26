import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";
import { party_ptype_Options } from "@/utils/vtable.js";

const PartyAutoForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
  chtac_Options,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-4">
          <InputText
            label="Code"
            placeholder="Enter Code"
            value={formData.prtya_ccode}
            onChange={(e) => onChange("prtya_ccode", e.target.value)}
            error={formErrors.prtya_ccode}
            required
            disabled={true}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Source"
            placeholder="Enter Source"
            value={formData.prtya_sorce}
            onChange={(e) => onChange("prtya_sorce", e.target.value)}
            error={formErrors.prtya_sorce}
            required
            disabled={true}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Name"
            placeholder="Enter Name"
            value={formData.prtya_cname}
            onChange={(e) => onChange("prtya_cname", e.target.value)}
            error={formErrors.prtya_cname}
            required
            disabled={true}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Ledger"
            placeholder="Enter Ledger"
            value={formData.chtac_chtno}
            onChange={(e) => onChange("chtac_chtno", e.target.value)}
            error={formErrors.chtac_chtno}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-8">
          <InputText
            label="Note"
            placeholder="Enter Note"
            value={formData.prtya_notes}
            onChange={(e) => onChange("prtya_notes", e.target.value)}
            error={formErrors.prtya_notes}
            required
            disabled={true}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.prtya_actve}
          cname={formData.crusr_cname}
          cdate={formData.prtya_crdat}
          uname={formData.upusr_cname}
          udate={formData.prtya_updat}
          rvnmr={formData.prtya_rvnmr}
        />
      )}
      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel} disabled={isBusy}>
          <IconClose size={16} className="icon-left" />
          Cancel
        </Button>
        <Button variant="info" onClick={onSubmit} disabled={isBusy || true}>
          <IconSave size={16} className="icon-left" />
          {formData?.id ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );
};
export default PartyAutoForm;
