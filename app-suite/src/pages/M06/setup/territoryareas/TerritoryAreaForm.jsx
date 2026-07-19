import Button from "@/components/Button";
import InputText from "@/components/InputText";
import AuditData from "@/components/AuditData";
import {
  IconClose,
  IconSave,
} from "@/icons";

const TerritoryAreaForm = ({
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
            label="Area Name"
            placeholder="Enter area name"
            value={formData.tarea_cname}
            onChange={(e) => onChange("tarea_cname", e.target.value)}
            error={formErrors.tarea_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputText
            label="Delivery Zone"
            placeholder="Enter delivery zone"
            value={formData.tarea_dzone}
            onChange={(e) => onChange("tarea_dzone", e.target.value)}
            error={formErrors.tarea_dzone}
            required
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.tarea_actve}
          cname={formData.crusr_cname}
          cdate={formData.tarea_crdat}
          uname={formData.upusr_cname}
          udate={formData.tarea_updat}
          rvnmr={formData.tarea_rvnmr}
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
export default TerritoryAreaForm;
