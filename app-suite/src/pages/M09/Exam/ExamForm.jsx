import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import InputTextArea from "@/components/InputTextArea";
import Dropdown from "@/components/Dropdown";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";

const examStatusOptions = [
  { value: false, label: "Pending Evaluation / Active Question" },
  { value: true, label: "Evaluated / Completed" },
];

const ExamForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  teachOptions = [],
  onChange,
  onCancel,
  onSubmit,
}) => {
  return (
    <div className="form-wrap">
      {/* Row 1: Serial and Teaching Material dropdown */}
      <div className="grid">
        <div className="col-span-3">
          <InputText
            label="Question No / Serial"
            placeholder="e.g., 01"
            value={formData.exams_srial || ""}
            onChange={(e) => onChange("exams_srial", e.target.value)}
            error={formErrors.exams_srial}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-9">
          <Dropdown
            label="Lesson / Teaching Material"
            options={teachOptions}
            value={formData.exams_teach || ""}
            onChange={(e) => onChange("exams_teach", e.target.value)}
            error={formErrors.exams_teach}
            placeholder={
              teachOptions.length === 0
                ? "No lessons available. Please create a lesson first!"
                : "Select the lesson this question belongs to..."
            }
            required
            disabled={readOnly}
          />
        </div>
      </div>

      {/* Row 2: Question / Task & Marks */}
      <div className="grid">
        <div className="col-span-10">
          <InputText
            label="Question / Task for Kids"
            placeholder="e.g., What sound does 'B' make? Or: Circle all words starting with 'C'."
            value={formData.exams_cname || ""}
            onChange={(e) => onChange("exams_cname", e.target.value)}
            error={formErrors.exams_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Question Marks"
            placeholder="e.g., 1"
            value={formData.exams_marks ?? 1}
            onChange={(e) => onChange("exams_marks", e.target.value)}
            error={formErrors.exams_marks}
            required
            disabled={readOnly}
          />
        </div>
      </div>

      {/* Row 3: Expected Answer / Solution */}
      <div className="grid">
        <div className="col-span-12">
          <InputTextArea
            label="Expected Answer / Solution (Teacher's Rubric)"
            placeholder="Enter the correct answer or acceptable responses from kids..."
            value={formData.exams_answr || ""}
            onChange={(e) => onChange("exams_answr", e.target.value)}
            error={formErrors.exams_answr}
            rows={3}
            disabled={readOnly}
          />
        </div>
      </div>

      {/* Row 4: Teacher Guidance & Status */}
      <div className="grid">
        <div className="col-span-8">
          <InputText
            label="Teacher Guidance / Hint"
            placeholder="e.g., Prompt with picture card if needed"
            value={formData.exams_notes || ""}
            onChange={(e) => onChange("exams_notes", e.target.value)}
            error={formErrors.exams_notes}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <Dropdown
            label="Question Status"
            options={examStatusOptions}
            value={formData.exams_stats ?? false}
            onChange={(e) => onChange("exams_stats", e.target.value === "true" || e.target.value === true)}
            error={formErrors.exams_stats}
            placeholder="Select Status..."
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
          {formData?.id ? "Update Question" : "Save Question"}
        </Button>
      </div>
    </div>
  );
};

export default ExamForm;
