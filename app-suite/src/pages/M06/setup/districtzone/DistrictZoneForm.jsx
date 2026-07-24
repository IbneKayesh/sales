import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Dropdown from "@/components/Dropdown";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";
import { cntry_Options } from "@/utils/vtable.js";

const DistrictZoneForm = ({
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
          <Dropdown
            label="Country"
            options={cntry_Options}
            value={formData.dzone_cntry}
            onChange={(e) => onChange("dzone_cntry", e.target.value)}
            error={formErrors.dzone_cntry}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputText
            label="Zone Name"
            placeholder="Enter zone name"
            value={formData.dzone_cname}
            onChange={(e) => onChange("dzone_cname", e.target.value)}
            error={formErrors.dzone_cname}
            required
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.dzone_actve}
          cname={formData.crusr_cname}
          cdate={formData.dzone_crdat}
          uname={formData.upusr_cname}
          udate={formData.dzone_updat}
          rvnmr={formData.dzone_rvnmr}
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
export default DistrictZoneForm;
