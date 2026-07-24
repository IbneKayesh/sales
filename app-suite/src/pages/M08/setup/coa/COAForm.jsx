import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import Checkbox from "@/components/Checkbox";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";
import { chtac_ntype_Options, chtac_ctype_Options } from "@/utils/vtable.js";

const COAForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
  chtac_chtac_Options,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-8">
          <Dropdown
            label="Parent Account"
            options={chtac_chtac_Options}
            value={formData.chtac_chtac}
            onChange={(e) => onChange("chtac_chtac", e.target.value)}
            error={formErrors.chtac_chtac}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="name"
          />
        </div>
        <div className="col-span-4">
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
        <div className="col-span-4">
          <Dropdown
            label="Account Type"
            options={chtac_ctype_Options}
            value={formData.chtac_ctype}
            onChange={(e) => onChange("chtac_ctype", e.target.value)}
            error={formErrors.chtac_ctype}
            required
            placeholder="Select..."
            disabled={readOnly || stopEdit}
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
        <div
          className="col-span-4"
          style={{
            paddingTop: "var(--sp-6)",
          }}
        >
          <Checkbox
            label="Is Postable"
            checked={
              formData.chtac_ispst === true || formData.chtac_ispst === "true"
            }
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
