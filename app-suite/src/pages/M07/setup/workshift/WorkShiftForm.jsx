import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import InputTime from "@/components/InputTime";
import Dropdown from "@/components/Dropdown";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";
import { bool_Options } from "@/utils/vtable.js";

const WorkShiftForm = ({
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
            label="Shift Name"
            placeholder="Enter shift name"
            value={formData.wkshf_cname}
            onChange={(e) => onChange("wkshf_cname", e.target.value)}
            error={formErrors.wkshf_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Buffer Before Start (Min)"
            value={formData.wkshf_bbstr}
            onChange={(e) => onChange("wkshf_bbstr", Number(e.target.value))}
            error={formErrors.wkshf_bbstr}
            min={0}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Grace Start (Min)"
            value={formData.wkshf_gsmin}
            onChange={(e) => onChange("wkshf_gsmin", Number(e.target.value))}
            error={formErrors.wkshf_gsmin}
            min={0}
            disabled={readOnly}
          />
        </div>
      </div>

      <div className="grid">
        <div className="col-span-3">
          <InputTime
            label="Start Time"
            placeholder="HH:MM"
            value={formData.wkshf_satim}
            onChange={(e) => onChange("wkshf_satim", e.target.value)}
            error={formErrors.wkshf_satim}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputTime
            label="End Time"
            placeholder="HH:MM"
            value={formData.wkshf_entim}
            onChange={(e) => onChange("wkshf_entim", e.target.value)}
            error={formErrors.wkshf_entim}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Grace End (Min)"
            value={formData.wkshf_gemin}
            onChange={(e) => onChange("wkshf_gemin", Number(e.target.value))}
            error={formErrors.wkshf_gemin}
            min={0}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Buffer After End (Min)"
            value={formData.wkshf_baend}
            onChange={(e) => onChange("wkshf_baend", Number(e.target.value))}
            error={formErrors.wkshf_baend}
            min={0}
            disabled={readOnly}
          />
        </div>
      </div>

      <div className="grid">
        <div className="col-span-3">
          <InputNumber
            label="Working Hours"
            value={formData.wkshf_wkhrs}
            onChange={(e) => onChange("wkshf_wkhrs", Number(e.target.value))}
            error={formErrors.wkshf_wkhrs}
            min={0}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Minimum Hours"
            value={formData.wkshf_mnhrs}
            onChange={(e) => onChange("wkshf_mnhrs", Number(e.target.value))}
            error={formErrors.wkshf_mnhrs}
            min={0}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Cross Day"
            options={bool_Options}
            value={formData.wkshf_crday}
            onChange={(e) => onChange("wkshf_crday", e.target.value)}
            error={formErrors.wkshf_crday}
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Single Punch"
            options={bool_Options}
            value={formData.wkshf_sgpnc}
            onChange={(e) => onChange("wkshf_sgpnc", e.target.value)}
            error={formErrors.wkshf_sgpnc}
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Overtime"
            options={bool_Options}
            value={formData.wkshf_ovrtm}
            onChange={(e) => onChange("wkshf_ovrtm", e.target.value)}
            error={formErrors.wkshf_ovrtm}
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
      </div>

      {formData?.id && (
        <AuditData
          actve={formData.wkshf_actve}
          cname={formData.crusr_cname}
          cdate={formData.wkshf_crdat}
          uname={formData.upusr_cname}
          udate={formData.wkshf_updat}
          rvnmr={formData.wkshf_rvnmr}
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
export default WorkShiftForm;
