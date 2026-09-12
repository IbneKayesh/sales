import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";
import { bool_Options } from "@/utils/vtable.js";

const ExamForm = ({
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
            value={formData.exams_srial}
            onChange={(e) => onChange("exams_srial", e.target.value)}
            error={formErrors.exams_srial}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Teaching Ref"
            placeholder="Enter teaching reference"
            value={formData.exams_teach}
            onChange={(e) => onChange("exams_teach", e.target.value)}
            error={formErrors.exams_teach}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Question Name"
            placeholder="Enter question name"
            value={formData.exams_cname}
            onChange={(e) => onChange("exams_cname", e.target.value)}
            error={formErrors.exams_cname}
            required
            disabled={readOnly}
          />
        </div>
      </div>

      <div className="grid">
        <div className="col-span-6">
          <InputText
            label="Answer"
            placeholder="Enter expected answer"
            value={formData.exams_answr}
            onChange={(e) => onChange("exams_answr", e.target.value)}
            error={formErrors.exams_answr}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputNumber
            label="Marks"
            placeholder="Enter marks"
            value={formData.exams_marks}
            onChange={(e) => onChange("exams_marks", e.target.value)}
            error={formErrors.exams_marks}
            required
            disabled={readOnly}
          />
        </div>
      </div>

      <div className="grid">
        <div className="col-span-6">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.exams_notes}
            onChange={(e) => onChange("exams_notes", e.target.value)}
            error={formErrors.exams_notes}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <Dropdown
            label="Pass/Fail"
            options={bool_Options}
            value={formData.exams_stats}
            onChange={(e) => onChange("exams_stats", e.target.value)}
            error={formErrors.exams_stats}
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
      </div>

      {formData?.id && (
        <AuditData
          actve={formData.exams_actve}
          cname={formData.crusr_cname}
          cdate={formData.exams_crdat}
          uname={formData.upusr_cname}
          udate={formData.exams_updat}
          rvnmr={formData.exams_rvnmr}
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

export default ExamForm;
