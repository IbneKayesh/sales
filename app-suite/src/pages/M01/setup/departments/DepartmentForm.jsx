import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";

const DepartmentForm = ({
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
        <div className="col-span-3">
          <InputText
            label="Department Name"
            placeholder="Enter department name"
            value={formData.dpart_cname}
            onChange={(e) => onChange("dpart_cname", e.target.value)}
            error={formErrors.dpart_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Employee Capacity"
            placeholder="Enter capacity"
            value={formData.dpart_emcap}
            onChange={(e) => onChange("dpart_emcap", e.target.value)}
            min={1}
            error={formErrors.dpart_emcap}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputText
            label="Office Address"
            placeholder="Enter office address"
            value={formData.dpart_ofadr}
            onChange={(e) => onChange("dpart_ofadr", e.target.value)}
            error={formErrors.dpart_ofadr}
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.dpart_actve}
          cname={formData.crusr_cname}
          cdate={formData.dpart_crdat}
          uname={formData.upusr_cname}
          udate={formData.dpart_updat}
          rvnmr={formData.dpart_rvnmr}
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
export default DepartmentForm;
