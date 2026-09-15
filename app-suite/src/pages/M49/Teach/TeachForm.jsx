import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import InputTextArea from "@/components/InputTextArea";
import Dropdown from "@/components/Dropdown";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";

const subjectOptions = [
  { value: "English", label: "English" },
  { value: "Phonics", label: "Phonics & Reading" },
  { value: "Mathematics", label: "Mathematics & Numbers" },
  { value: "Science", label: "General Science & Nature" },
  { value: "General Knowledge", label: "General Knowledge" },
  { value: "Art & Crafts", label: "Art & Crafts" },
  { value: "Story Time", label: "Story Time" },
  { value: "Rhymes & Poems", label: "Rhymes & Poems" },
];

const gradeOptions = [
  { value: "Playgroup", label: "Playgroup (Age 2-3)" },
  { value: "Nursery", label: "Nursery (Age 3-4)" },
  { value: "Kindergarten", label: "Kindergarten / KG (Age 4-6)" },
  { value: "Grade 1", label: "Grade 1" },
  { value: "Grade 2", label: "Grade 2" },
  { value: "All Ages", label: "All Ages / General" },
];

const statusOptions = [
  { value: true, label: "Ready for Kids / Published" },
  { value: false, label: "Draft / In Progress" },
];

const TeachForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  parentOptions = [],
  onChange,
  onCancel,
  onSubmit,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-1">
          <InputText
            label="Serial"
            placeholder="e.g., 1"
            value={formData.teach_srial || ""}
            onChange={(e) => onChange("teach_srial", e.target.value)}
            error={formErrors.teach_srial}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <Dropdown
            label="Parent Topic (Optional)"
            options={[
              { value: "", label: "None (Standalone Lesson)" },
              ...parentOptions,
            ]}
            value={formData.teach_teach || ""}
            onChange={(e) => onChange("teach_teach", e.target.value)}
            error={formErrors.teach_teach}
            placeholder="Select parent lesson..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-7">
          <InputText
            label="Lesson Title"
            placeholder="Enter title"
            value={formData.teach_cname || ""}
            onChange={(e) => onChange("teach_cname", e.target.value)}
            error={formErrors.teach_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-12">
          <InputTextArea
            label="Lesson Content"
            placeholder="Write words, sentences, phonics examples, or short story for kids to read and practice..."
            value={formData.teach_descr || ""}
            onChange={(e) => onChange("teach_descr", e.target.value)}
            error={formErrors.teach_descr}
            rows={4}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-8">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.teach_notes || ""}
            onChange={(e) => onChange("teach_notes", e.target.value)}
            error={formErrors.teach_notes}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Practice Reads"
            placeholder="e.g., 1"
            value={formData.teach_reads ?? 1}
            onChange={(e) => onChange("teach_reads", e.target.value)}
            error={formErrors.teach_reads}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Reward Points"
            placeholder="e.g., 5"
            value={formData.teach_marks ?? 1}
            onChange={(e) => onChange("teach_marks", e.target.value)}
            error={formErrors.teach_marks}
            required
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
          {formData?.id ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default TeachForm;
