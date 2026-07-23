import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import InputCalendar from "@/components/InputCalendar";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";

const HolidayForm = ({
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
          <InputNumber
            label="Year"
            placeholder="2025"
            value={formData.hlday_yerid}
            onChange={(e) => onChange("hlday_yerid", Number(e.target.value))}
            error={formErrors.hlday_yerid}
            min={2025}
            max={2050}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputCalendar
            label="Holiday Date"
            placeholder="Select date..."
            value={formData.hlday_hldat}
            onChange={(e) => onChange("hlday_hldat", e.target.value)}
            error={formErrors.hlday_hldat}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputText
            label="Holiday Name"
            placeholder="Enter holiday name"
            value={formData.hlday_hldnm}
            onChange={(e) => onChange("hlday_hldnm", e.target.value)}
            error={formErrors.hlday_hldnm}
            required
            disabled={readOnly}
          />
        </div>
      </div>

      <div className="grid">
        <div className="col-span-12">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.hlday_notes}
            onChange={(e) => onChange("hlday_notes", e.target.value)}
            error={formErrors.hlday_notes}
            disabled={readOnly}
          />
        </div>
      </div>

      {formData?.id && (
        <AuditData
          actve={formData.hlday_actve}
          cname={formData.crusr_cname}
          cdate={formData.hlday_crdat}
          uname={formData.upusr_cname}
          udate={formData.hlday_updat}
          rvnmr={formData.hlday_rvnmr}
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
export default HolidayForm;
