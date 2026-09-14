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
      {/* Row 1: Serial, Lesson Title, Subject */}
      <div className="grid">
        <div className="col-span-3">
          <InputText
            label="Serial"
            placeholder="e.g., 01"
            value={formData.teach_srial || ""}
            onChange={(e) => onChange("teach_srial", e.target.value)}
            error={formErrors.teach_srial}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-5">
          <InputText
            label="Lesson / Topic Title"
            placeholder="e.g., Alphabet Fun - Letter A"
            value={formData.teach_cname || ""}
            onChange={(e) => onChange("teach_cname", e.target.value)}
            error={formErrors.teach_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <Dropdown
            label="Subject"
            options={subjectOptions}
            value={formData.teach_ttype || ""}
            onChange={(e) => onChange("teach_ttype", e.target.value)}
            error={formErrors.teach_ttype}
            placeholder="Select Subject..."
            disabled={readOnly}
          />
        </div>
      </div>

      {/* Row 2: Parent Topic, Grade/Level, Practice Reads, Reward Marks */}
      <div className="grid">
        <div className="col-span-4">
          <Dropdown
            label="Parent Lesson / Unit (Optional)"
            options={[{ value: "", label: "None (Standalone Lesson)" }, ...parentOptions]}
            value={formData.teach_teach || ""}
            onChange={(e) => onChange("teach_teach", e.target.value)}
            error={formErrors.teach_teach}
            placeholder="Select parent lesson if nested..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <Dropdown
            label="Grade / Target Age"
            options={gradeOptions}
            value={formData.teach_tagno || ""}
            onChange={(e) => onChange("teach_tagno", e.target.value)}
            error={formErrors.teach_tagno}
            placeholder="Select Grade/Age..."
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

      {/* Row 3: Reading Material / Lesson Content */}
      <div className="grid">
        <div className="col-span-12">
          <InputTextArea
            label="Lesson Content / Reading Material for Kids"
            placeholder="Write words, sentences, phonics examples, or short story for kids to read and practice..."
            value={formData.teach_descr || ""}
            onChange={(e) => onChange("teach_descr", e.target.value)}
            error={formErrors.teach_descr}
            rows={4}
            disabled={readOnly}
          />
        </div>
      </div>

      {/* Row 4: Teacher Guidance / Notes & Status */}
      <div className="grid">
        <div className="col-span-8">
          <InputText
            label="Teacher's Guidance / Notes"
            placeholder="Tips for class (e.g., Use picture flashcards, practice vowel sounds aloud)"
            value={formData.teach_notes || ""}
            onChange={(e) => onChange("teach_notes", e.target.value)}
            error={formErrors.teach_notes}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <Dropdown
            label="Status"
            options={statusOptions}
            value={formData.teach_stats ?? true}
            onChange={(e) => onChange("teach_stats", e.target.value === "true" || e.target.value === true)}
            error={formErrors.teach_stats}
            placeholder="Select Status..."
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
          {formData?.id ? "Update Lesson" : "Save Lesson"}
        </Button>
      </div>
    </div>
  );
};

export default TeachForm;
