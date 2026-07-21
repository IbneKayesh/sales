import Button from "@/components/Button";
import InputText from "@/components/InputText";
import AuditData from "@/components/AuditData";
import {
  IconClose,
  IconSave,
} from "@/icons";

const AttrbForm = ({
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
            label="Attribute Name"
            placeholder="Enter attribute name"
            value={formData.attrb_cname}
            onChange={(e) => onChange("attrb_cname", e.target.value)}
            error={formErrors.attrb_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputText
            label="Data Type"
            placeholder="Enter data type"
            value={formData.attrb_dtype}
            onChange={(e) => onChange("attrb_dtype", e.target.value)}
            error={formErrors.attrb_dtype}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputText
            label="Default Value"
            placeholder="Enter default value"
            value={formData.attrb_dvalu}
            onChange={(e) => onChange("attrb_dvalu", e.target.value)}
            error={formErrors.attrb_dvalu}
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.attrb_actve}
          cname={formData.crusr_cname}
          cdate={formData.attrb_crdat}
          uname={formData.upusr_cname}
          udate={formData.attrb_updat}
          rvnmr={formData.attrb_rvnmr}
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
export default AttrbForm;
