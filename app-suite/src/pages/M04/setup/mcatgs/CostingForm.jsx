import Button from "@/components/Button";
import InputText from "@/components/InputText";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";

const CostingForm = ({
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
          <InputText
            label="Cost Party"
            placeholder="Enter cost party"
            value={formData.pcost_party}
            onChange={(e) => onChange("pcost_party", e.target.value)}
            error={formErrors.pcost_party}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputText
            label="Cost Amount"
            placeholder="Enter cost amount"
            value={formData.pcost_csamt}
            onChange={(e) => onChange("pcost_csamt", e.target.value)}
            error={formErrors.pcost_csamt}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputText
            label="Cost Ratio"
            placeholder="Enter cost ratio"
            value={formData.pcost_csrto}
            onChange={(e) => onChange("pcost_csrto", e.target.value)}
            error={formErrors.pcost_csrto}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.pcost_notes}
            onChange={(e) => onChange("pcost_notes", e.target.value)}
            error={formErrors.pcost_notes}
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.pcost_actve}
          cname={formData.crusr_cname}
          cdate={formData.pcost_crdat}
          uname={formData.upusr_cname}
          udate={formData.pcost_updat}
          rvnmr={formData.pcost_rvnmr}
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
export default CostingForm;
