import Button from "@/components/Button";
import InputText from "@/components/InputText";
import AuditData from "@/components/AuditData";
import {
  IconClose,
  IconSave,
} from "@/icons";

const ScatgForm = ({
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
            label="Code"
            placeholder="Enter sub category code"
            value={formData.scatg_ccode}
            onChange={(e) => onChange("scatg_ccode", e.target.value)}
            error={formErrors.scatg_ccode}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Main Category"
            placeholder="Enter main category"
            value={formData.scatg_mcatg}
            onChange={(e) => onChange("scatg_mcatg", e.target.value)}
            error={formErrors.scatg_mcatg}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Sub Category Name"
            placeholder="Enter sub category name"
            value={formData.scatg_cname}
            onChange={(e) => onChange("scatg_cname", e.target.value)}
            error={formErrors.scatg_cname}
            required
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.scatg_actve}
          cname={formData.crusr_cname}
          cdate={formData.scatg_crdat}
          uname={formData.upusr_cname}
          udate={formData.scatg_updat}
          rvnmr={formData.scatg_rvnmr}
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
export default ScatgForm;
