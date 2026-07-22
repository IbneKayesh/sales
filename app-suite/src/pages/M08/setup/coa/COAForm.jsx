import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import Checkbox from "@/components/Checkbox";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";
import { chtac_ntype_Options } from "@/utils/vtable.js";

const COAForm = ({
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
            label="Account Name"
            placeholder="Enter account name"
            value={formData.chtac_cname}
            onChange={(e) => onChange("chtac_cname", e.target.value)}
            error={formErrors.chtac_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputText
            label="Account Type"
            placeholder="Enter account type"
            value={formData.chtac_ctype}
            onChange={(e) => onChange("chtac_ctype", e.target.value)}
            error={formErrors.chtac_ctype}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Parent Account"
            placeholder="Select parent account"
            value={formData.chtac_chtac}
            onChange={(e) => onChange("chtac_chtac", e.target.value)}
            error={formErrors.chtac_chtac}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputNumber
            label="Chart Number"
            placeholder="Enter chart number"
            value={formData.chtac_chtno}
            onChange={(e) => onChange("chtac_chtno", e.target.value)}
            error={formErrors.chtac_chtno}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <Dropdown
            label="Nature Type"
            options={chtac_ntype_Options}
            value={formData.chtac_ntype}
            onChange={(e) => onChange("chtac_ntype", e.target.value)}
            error={formErrors.chtac_ntype}
            required
            placeholder="Dr/Cr"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4" style={{ display: "flex", alignItems: "flex-end", paddingBottom: "var(--sp-2)" }}>
          <Checkbox
            label="Is Child"
            checked={formData.chtac_child === true || formData.chtac_child === "true"}
            onChange={(e) => onChange("chtac_child", e.target.checked)}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4" style={{ display: "flex", alignItems: "flex-end", paddingBottom: "var(--sp-2)" }}>
          <Checkbox
            label="Is Postable"
            checked={formData.chtac_ispst === true || formData.chtac_ispst === "true"}
            onChange={(e) => onChange("chtac_ispst", e.target.checked)}
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.chtac_actve}
          cname={formData.crusr_cname}
          cdate={formData.chtac_crdat}
          uname={formData.upusr_cname}
          udate={formData.chtac_updat}
          rvnmr={formData.chtac_rvnmr}
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
export default COAForm;
