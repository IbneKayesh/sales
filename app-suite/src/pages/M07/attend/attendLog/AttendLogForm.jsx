import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputCalendar from "@/components/InputCalendar";
import Dropdown from "@/components/Dropdown";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";
import { bool_Options } from "@/utils/vtable.js";

const AttendLogForm = ({
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
            label="Employee Code"
            placeholder="Enter employee code"
            value={formData.atnlg_ecode}
            onChange={(e) => onChange("atnlg_ecode", e.target.value)}
            error={formErrors.atnlg_ecode}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Card No"
            placeholder="Enter card number"
            value={formData.atnlg_crdno}
            onChange={(e) => onChange("atnlg_crdno", e.target.value)}
            error={formErrors.atnlg_crdno}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputCalendar
            label="Log Time"
            value={formData.atnlg_lgtim}
            onChange={(e) => onChange("atnlg_lgtim", e.target.value)}
            error={formErrors.atnlg_lgtim}
            required
            disabled={readOnly}
            placeholder="Select date and time..."
          />
        </div>
      </div>

      <div className="grid">
        <div className="col-span-6">
          <InputText
            label="Terminal"
            placeholder="Enter terminal name"
            value={formData.atnlg_trmnl}
            onChange={(e) => onChange("atnlg_trmnl", e.target.value)}
            error={formErrors.atnlg_trmnl}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <Dropdown
            label="Is Posted"
            options={bool_Options}
            value={formData.atnlg_ispst}
            onChange={(e) => onChange("atnlg_ispst", e.target.value)}
            error={formErrors.atnlg_ispst}
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
      </div>

      {formData?.id && (
        <AuditData
          actve={formData.atnlg_actve}
          cname={formData.crusr_cname}
          cdate={formData.atnlg_crdat}
          uname={formData.upusr_cname}
          udate={formData.atnlg_updat}
          rvnmr={formData.atnlg_rvnmr}
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
export default AttendLogForm;
