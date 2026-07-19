import Button from "@/components/Button";
import InputText from "@/components/InputText";
import AuditData from "@/components/AuditData";
import {
  IconClose,
  IconSave,
} from "@/icons";

const UnitsForm = ({
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
            label="Unit Code"
            placeholder="Enter unit code"
            value={formData.units_ccode}
            onChange={(e) => onChange("units_ccode", e.target.value)}
            error={formErrors.units_ccode}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Unit Name"
            placeholder="Enter unit name"
            value={formData.units_cname}
            onChange={(e) => onChange("units_cname", e.target.value)}
            error={formErrors.units_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Unit Group"
            placeholder="Enter unit group"
            value={formData.units_untgr}
            onChange={(e) => onChange("units_untgr", e.target.value)}
            error={formErrors.units_untgr}
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.units_actve}
          cname={formData.crusr_cname}
          cdate={formData.units_crdat}
          uname={formData.upusr_cname}
          udate={formData.units_updat}
          rvnmr={formData.units_rvnmr}
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
export default UnitsForm;
