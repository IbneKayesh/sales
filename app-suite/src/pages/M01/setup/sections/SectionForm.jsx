import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";

const SectionForm = ({
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
            value={formData.sectn_dpart}
            onChange={(e) => onChange("sectn_dpart", e.target.value)}
            error={formErrors.sectn_dpart}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="dpart_cname"
          />
        </div>
        <div className="col-span-5">
          <InputText
            label="Section Name"
            placeholder="Enter section name"
            value={formData.sectn_cname}
            onChange={(e) => onChange("sectn_cname", e.target.value)}
            error={formErrors.sectn_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Employee Capacity"
            placeholder="Enter capacity"
            value={formData.sectn_emcap}
            onChange={(e) => onChange("sectn_emcap", e.target.value)}
            min={1}
            error={formErrors.sectn_emcap}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-12">
          <InputText
            label="Office Address"
            placeholder="Enter office address"
            value={formData.sectn_ofadr}
            onChange={(e) => onChange("sectn_ofadr", e.target.value)}
            error={formErrors.sectn_ofadr}
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.sectn_actve}
          cname={formData.crusr_cname}
          cdate={formData.sectn_crdat}
          uname={formData.upusr_cname}
          udate={formData.sectn_updat}
          rvnmr={formData.sectn_rvnmr}
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
export default SectionForm;
