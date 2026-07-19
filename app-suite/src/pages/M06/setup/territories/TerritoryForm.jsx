import Button from "@/components/Button";
import InputText from "@/components/InputText";
import AuditData from "@/components/AuditData";
import {
  IconClose,
  IconSave,
} from "@/icons";

const TerritoryForm = ({
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
        <div className="col-span-6">
          <InputText
            label="Territory Name"
            placeholder="Enter territory name"
            value={formData.trtry_cname}
            onChange={(e) => onChange("trtry_cname", e.target.value)}
            error={formErrors.trtry_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputText
            label="Territory Area"
            placeholder="Enter territory area"
            value={formData.trtry_tarea}
            onChange={(e) => onChange("trtry_tarea", e.target.value)}
            error={formErrors.trtry_tarea}
            required
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.trtry_actve}
          cname={formData.crusr_cname}
          cdate={formData.trtry_crdat}
          uname={formData.upusr_cname}
          udate={formData.trtry_updat}
          rvnmr={formData.trtry_rvnmr}
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
export default TerritoryForm;
