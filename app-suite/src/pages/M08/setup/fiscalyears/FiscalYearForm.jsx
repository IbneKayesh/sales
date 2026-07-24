import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputCalendar from "@/components/InputCalendar";
import Dropdown from "@/components/Dropdown";
import Checkbox from "@/components/Checkbox";
import InputLabel from "@/components/InputLabel";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";
import { acprd_stats_Options } from "@/utils/vtable.js";

const FiscalYearForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
  dpart_Options,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-4">
          <Dropdown
            label="Department"
            options={dpart_Options}
            value={formData.fsyar_dpart}
            onChange={(e) => onChange("fsyar_dpart", e.target.value)}
            error={formErrors.fsyar_dpart}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="dpart_cname"
          />
        </div>
        <div className="col-span-8">
          <InputText
            label="Fiscal Year"
            placeholder="Enter fiscal year (e.g. 2025-2026)"
            value={formData.fsyar_cname}
            onChange={(e) => onChange("fsyar_cname", e.target.value)}
            error={formErrors.fsyar_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputCalendar
            label="Start Date"
            placeholder="Select start date"
            value={formData.fsyar_stdat}
            onChange={(e) => onChange("fsyar_stdat", e.target.value)}
            error={formErrors.fsyar_stdat}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputCalendar
            label="End Date"
            placeholder="Select end date"
            value={formData.fsyar_endat}
            onChange={(e) => onChange("fsyar_endat", e.target.value)}
            error={formErrors.fsyar_endat}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Status"
            options={acprd_stats_Options}
            value={formData.fsyar_stats}
            onChange={(e) => onChange("fsyar_stats", e.target.value)}
            error={formErrors.fsyar_stats}
            required
            placeholder="Select status..."
            disabled={readOnly}
          />
        </div>
        <div
          className="col-span-3"
          style={{
            display: "flex",
            alignItems: "flex-end",
            paddingBottom: "var(--sp-6)",
          }}
        >
          <Checkbox
            label="Is Current Year"
            checked={
              formData.fsyar_iscur === true || formData.fsyar_iscur === "true"
            }
            onChange={(e) => onChange("fsyar_iscur", e.target.checked)}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputLabel label="Opening Balance" value={formData.fsyar_opbal} />
        </div>
        <div className="col-span-6">
          <InputLabel label="Closing Balance" value={formData.fsyar_clbal} />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.fsyar_actve}
          cname={formData.crusr_cname}
          cdate={formData.fsyar_crdat}
          uname={formData.upusr_cname}
          udate={formData.fsyar_updat}
          rvnmr={formData.fsyar_rvnmr}
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
export default FiscalYearForm;
