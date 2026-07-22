import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import InputCalendar from "@/components/InputCalendar";
import Dropdown from "@/components/Dropdown";
import Checkbox from "@/components/Checkbox";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";
import { fsyar_stats_Options } from "@/utils/vtable.js";

const FiscalYearForm = ({
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
            label="Fiscal Year"
            placeholder="Enter fiscal year (e.g. 2025-2026)"
            value={formData.fsyar_cname}
            onChange={(e) => onChange("fsyar_cname", e.target.value)}
            error={formErrors.fsyar_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <Dropdown
            label="Status"
            options={fsyar_stats_Options}
            value={formData.fsyar_stats}
            onChange={(e) => onChange("fsyar_stats", e.target.value)}
            error={formErrors.fsyar_stats}
            required
            placeholder="Select status..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
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
        <div className="col-span-4">
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
        <div className="col-span-4" style={{ display: "flex", alignItems: "flex-end", paddingBottom: "var(--sp-2)" }}>
          <Checkbox
            label="Is Current Year"
            checked={formData.fsyar_iscur === true || formData.fsyar_iscur === "true"}
            onChange={(e) => onChange("fsyar_iscur", e.target.checked)}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputNumber
            label="Opening Balance"
            placeholder="Enter opening balance"
            value={formData.fsyar_opbal}
            onChange={(e) => onChange("fsyar_opbal", e.target.value)}
            error={formErrors.fsyar_opbal}
            step="0.01"
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputNumber
            label="Closing Balance"
            placeholder="Enter closing balance"
            value={formData.fsyar_clbal}
            onChange={(e) => onChange("fsyar_clbal", e.target.value)}
            error={formErrors.fsyar_clbal}
            step="0.01"
            required
            disabled={readOnly}
          />
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
