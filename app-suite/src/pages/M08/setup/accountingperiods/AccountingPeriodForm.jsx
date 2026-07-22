import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import InputCalendar from "@/components/InputCalendar";
import Dropdown from "@/components/Dropdown";
import Checkbox from "@/components/Checkbox";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";
import { acprd_stats_Options } from "@/utils/vtable.js";

const AccountingPeriodForm = ({
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
            label="Period Name"
            placeholder="Enter period name"
            value={formData.acprd_cname}
            onChange={(e) => onChange("acprd_cname", e.target.value)}
            error={formErrors.acprd_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Transaction No"
            placeholder="Enter transaction number"
            value={formData.acprd_trnno}
            onChange={(e) => onChange("acprd_trnno", e.target.value)}
            error={formErrors.acprd_trnno}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <Dropdown
            label="Status"
            options={acprd_stats_Options}
            value={formData.acprd_stats}
            onChange={(e) => onChange("acprd_stats", e.target.value)}
            error={formErrors.acprd_stats}
            required
            placeholder="Select status..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputCalendar
            label="Start Date"
            placeholder="Select start date"
            value={formData.acprd_stdat}
            onChange={(e) => onChange("acprd_stdat", e.target.value)}
            error={formErrors.acprd_stdat}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputCalendar
            label="End Date"
            placeholder="Select end date"
            value={formData.acprd_endat}
            onChange={(e) => onChange("acprd_endat", e.target.value)}
            error={formErrors.acprd_endat}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4" style={{ display: "flex", alignItems: "flex-end", paddingBottom: "var(--sp-2)" }}>
          <Checkbox
            label="Is Current Period"
            checked={formData.acprd_iscur === true || formData.acprd_iscur === "true"}
            onChange={(e) => onChange("acprd_iscur", e.target.checked)}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputNumber
            label="Opening Balance"
            placeholder="Enter opening balance"
            value={formData.acprd_opbal}
            onChange={(e) => onChange("acprd_opbal", e.target.value)}
            error={formErrors.acprd_opbal}
            step="0.01"
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputNumber
            label="Closing Balance"
            placeholder="Enter closing balance"
            value={formData.acprd_clbal}
            onChange={(e) => onChange("acprd_clbal", e.target.value)}
            error={formErrors.acprd_clbal}
            step="0.01"
            required
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.acprd_actve}
          cname={formData.crusr_cname}
          cdate={formData.acprd_crdat}
          uname={formData.upusr_cname}
          udate={formData.acprd_updat}
          rvnmr={formData.acprd_rvnmr}
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
export default AccountingPeriodForm;
