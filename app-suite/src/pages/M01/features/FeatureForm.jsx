import InputText from "@/components/InputText";
import InputSwitch from "@/components/InputSwitch";
import Dropdown from "@/components/Dropdown";
import AuditData from "@/components/AuditData";
import Button from "@/components/Button";
import { IconClose, IconSave } from "@/icons";

const FeatureForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
  fetur_Options,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-2">
          <InputText
            label="Serial"
            placeholder="Enter serial"
            value={formData.fetur_srial}
            onChange={(e) => onChange("fetur_srial", e.target.value)}
            error={formErrors.fetur_srial}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputText
            label="Name"
            placeholder="Enter name"
            value={formData.fetur_cname}
            onChange={(e) => onChange("fetur_cname", e.target.value)}
            error={formErrors.fetur_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <Dropdown
            label="Parent"
            options={fetur_Options}
            value={formData.fetur_fetur}
            onChange={(e) => onChange("fetur_fetur", e.target.value)}
            error={formErrors.fetur_fetur}
            required
            placeholder="Select parent..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="fetur_cname"
          />
        </div>
        <div className="col-span-6">
          <InputText
            label="Description"
            placeholder="Enter description"
            value={formData.fetur_descr}
            onChange={(e) => onChange("fetur_descr", e.target.value)}
            error={formErrors.fetur_descr}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.fetur_notes}
            onChange={(e) => onChange("fetur_notes", e.target.value)}
            error={formErrors.fetur_notes}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputSwitch
            label="Status"
            checked={formData.fetur_stats}
            onChange={(e) => onChange("fetur_stats", e.target.checked)}
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.fetur_actve}
          cname={formData.crusr_cname}
          cdate={formData.fetur_crdat}
          uname={formData.upusr_cname}
          udate={formData.fetur_updat}
          rvnmr={formData.fetur_rvnmr}
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
export default FeatureForm;
