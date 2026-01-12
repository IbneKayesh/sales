import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { SelectButton } from "primereact/selectbutton";

const NotesFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  const statusOptions = [
    { label: "In Progress", value: "In Progress" },
    { label: "Scheduled", value: "Scheduled" },
    { label: "Completed", value: "Completed" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  return (
    <div className="bg-white p-6 border-round-xl border-1 border-200 shadow-lg">
      <div className="grid">
        <div className="col-12">
          <div className="flex flex-column gap-2 mb-4">
            <label
              htmlFor="notes_stat"
              className="text-sm font-bold text-700 uppercase"
            >
              Status <span className="text-red-500">*</span>
            </label>
            <SelectButton
              value={formData.notes_stat || "In Progress"}
              options={statusOptions}
              onChange={(e) => onChange("notes_stat", e.value)}
              className="text-sm"
            />
          </div>
        </div>

        <div className="col-12">
          <div className="flex flex-column gap-2 mb-4">
            <label
              htmlFor="notes_title"
              className="text-sm font-bold text-700 uppercase"
            >
              Note Title <span className="text-red-500">*</span>
            </label>
            <InputText
              id="notes_title"
              value={formData.notes_title || ""}
              onChange={(e) => onChange("notes_title", e.target.value)}
              className={`p-inputtext-lg border-200 focus:border-indigo-500 transition-all ${
                errors.notes_title ? "p-invalid" : ""
              }`}
              placeholder="What needs to be done?"
            />
            {errors.notes_title && (
              <small className="p-error">{errors.notes_title}</small>
            )}
          </div>
        </div>

        <div className="col-12">
          <div className="flex flex-column gap-2 mb-4">
            <label
              htmlFor="notes_dudat"
              className="text-sm font-bold text-700 uppercase"
            >
              Due Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="notes_dudat"
              value={formData.notes_dudat || ""}
              onChange={(e) => onChange("notes_dudat", e.target.value)}
              className={`p-inputtext p-inputtext-lg w-full border-1 border-200 border-round focus:border-indigo-500 transition-all outline-none ${
                errors.notes_dudat ? "p-invalid" : ""
              }`}
              required
            />
            {errors.notes_dudat && (
              <small className="p-error">{errors.notes_dudat}</small>
            )}
          </div>
        </div>

        <div className="col-12">
          <div className="flex flex-column gap-2 mb-4">
            <label
              htmlFor="notes_descr"
              className="text-sm font-bold text-700 uppercase"
            >
              Description / Details
            </label>
            <InputTextarea
              id="notes_descr"
              value={formData.notes_descr || ""}
              onChange={(e) => onChange("notes_descr", e.target.value)}
              rows={5}
              className="w-full text-lg border-200 focus:border-indigo-500 transition-all"
              autoResize
              placeholder="Add more details here..."
            />
          </div>
        </div>

        <div className="col-12">
          <div className="flex justify-content-end gap-3 mt-4">
            <Button
              label={formData.id ? "Update Task" : "Save Note"}
              icon={isBusy ? "pi pi-spin pi-spinner" : "pi pi-check"}
              className="action-btn-primary px-6"
              onClick={onSave}
              disabled={isBusy}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesFormComp;
