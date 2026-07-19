import Button from "@/components/Button";
import InputText from "@/components/InputText";
import AuditData from "@/components/AuditData";
import {
  IconClose,
  IconSave,
} from "@/icons";

const McatgForm = ({
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
            label="Category Code"
            placeholder="Enter category code"
            value={formData.mcatg_ccode}
            onChange={(e) => onChange("mcatg_ccode", e.target.value)}
            error={formErrors.mcatg_ccode}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputText
            label="Category Name"
            placeholder="Enter category name"
            value={formData.mcatg_cname}
            onChange={(e) => onChange("mcatg_cname", e.target.value)}
            error={formErrors.mcatg_cname}
            required
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.mcatg_actve}
          cname={formData.crusr_cname}
          cdate={formData.mcatg_crdat}
          uname={formData.upusr_cname}
          udate={formData.mcatg_updat}
          rvnmr={formData.mcatg_rvnmr}
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
export default McatgForm;
