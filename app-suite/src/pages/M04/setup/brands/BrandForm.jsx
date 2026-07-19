import Button from "@/components/Button";
import InputText from "@/components/InputText";
import AuditData from "@/components/AuditData";
import {
  IconClose,
  IconSave,
} from "@/icons";

const BrandForm = ({
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
            label="Brand Code"
            placeholder="Enter brand code"
            value={formData.brand_ccode}
            onChange={(e) => onChange("brand_ccode", e.target.value)}
            error={formErrors.brand_ccode}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputText
            label="Brand Name"
            placeholder="Enter brand name"
            value={formData.brand_cname}
            onChange={(e) => onChange("brand_cname", e.target.value)}
            error={formErrors.brand_cname}
            required
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.brand_actve}
          cname={formData.crusr_cname}
          cdate={formData.brand_crdat}
          uname={formData.upusr_cname}
          udate={formData.brand_updat}
          rvnmr={formData.brand_rvnmr}
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
export default BrandForm;
