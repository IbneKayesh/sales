import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";
import { bool_Options } from "@/utils/vtable.js";

const TeachForm = ({
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
            label="Serial"
            placeholder="Enter serial"
            value={formData.teach_srial}
            onChange={(e) => onChange("teach_srial", e.target.value)}
            error={formErrors.teach_srial}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Student Name"
            placeholder="Enter student name"
            value={formData.teach_cname}
            onChange={(e) => onChange("teach_cname", e.target.value)}
            error={formErrors.teach_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <Dropdown
            label="Subject"
            options={[]}
            value={formData.teach_ttype}
            onChange={(e) => onChange("teach_ttype", e.target.value)}
            error={formErrors.teach_ttype}
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
      </div>

      <div className="grid">
        <div className="col-span-6">
          <InputText
            label="Description"
            placeholder="Enter reading description"
            value={formData.teach_descr}
            onChange={(e) => onChange("teach_descr", e.target.value)}
            error={formErrors.teach_descr}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputNumber
            label="Total Marks"
            placeholder="Enter total marks"
            value={formData.teach_marks}
            onChange={(e) => onChange("teach_marks", e.target.value)}
            error={formErrors.teach_marks}
            required
            disabled={readOnly}
          />
        </div>
      </div>

      <div className="grid">
        <div className="col-span-4">
          <InputText
            label="Tag No"
            placeholder="Enter tag no"
            value={formData.teach_tagno}
            onChange={(e) => onChange("teach_tagno", e.target.value)}
            error={formErrors.teach_tagno}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.teach_notes}
            onChange={(e) => onChange("teach_notes", e.target.value)}
            error={formErrors.teach_notes}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <Dropdown
            label="Status"
            options={bool_Options}
            value={formData.teach_stats}
            onChange={(e) => onChange("teach_stats", e.target.value)}
            error={formErrors.teach_stats}
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
      </div>

      {formData?.id && (
        <AuditData
          actve={formData.teach_actve}
          cname={formData.crusr_cname}
          cdate={formData.teach_crdat}
          uname={formData.upusr_cname}
          udate={formData.teach_updat}
          rvnmr={formData.teach_rvnmr}
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

export default TeachForm;
