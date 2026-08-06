import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";

const DesignationsForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
  //others
  desig_Options
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-4">
          <InputText
            label="Name"
            placeholder="Enter name"
            value={formData.desig_cname}
            onChange={(e) => onChange("desig_cname", e.target.value)}
            error={formErrors.desig_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Desgination Level"
            value={formData.desig_level}
            onChange={(e) => onChange("desig_level", Number(e.target.value))}
            error={formErrors.desig_level}
            min={1}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputText
            label="Short Name"
            placeholder="Enter short name"
            value={formData.desig_sname}
            onChange={(e) => onChange("desig_sname", e.target.value)}
            error={formErrors.desig_sname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <Dropdown
            label="Parent"
            options={desig_Options}
            value={formData.desig_desig}
            onChange={(e) => onChange("desig_desig", e.target.value)}
            error={formErrors.desig_desig}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
      </div>

      {formData?.id && (
        <AuditData
          actve={formData.desig_actve}
          cname={formData.crusr_cname}
          cdate={formData.desig_crdat}
          uname={formData.upusr_cname}
          udate={formData.desig_updat}
          rvnmr={formData.desig_rvnmr}
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
export default DesignationsForm;
