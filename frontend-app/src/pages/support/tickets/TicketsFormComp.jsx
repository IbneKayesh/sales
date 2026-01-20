import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { SelectButton } from "primereact/selectbutton";
import { Dropdown } from "primereact/dropdown";

const TicketsFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  const statusOptions = [
    { label: "Opened", value: "Opened" },
    { label: "Resolved", value: "Resolved" },
    { label: "Closed", value: "Closed" },
  ];

  const typeOptions = [
    { label: "Bug Report", value: "Bug Report" },
    { label: "Feature Request", value: "Feature Request" },
    { label: "Support Inquiry", value: "Support Inquiry" },
    { label: "Billing Issue", value: "Billing Issue" },
    { label: "General Feedback", value: "General Feedback" },
  ];

  return (
    <div className="bg-white p-6 border-round-xl border-1 border-200 shadow-lg">
      <div className="grid">
        <div className="col-12 md:col-6">
          <div className="flex flex-column gap-2 mb-4">
            <label
              htmlFor="tickt_cmsts"
              className="text-sm font-bold text-700 uppercase"
            >
              Status <span className="text-red-500">*</span>
            </label>
            <SelectButton
              value={formData.tickt_cmsts || "Opened"}
              options={statusOptions}
              onChange={(e) => onChange("tickt_cmsts", e.value)}
              className="text-sm"
            />
          </div>
        </div>

        <div className="col-12 md:col-6">
          <div className="flex flex-column gap-2 mb-4">
            <label
              htmlFor="tickt_types"
              className="text-sm font-bold text-700 uppercase"
            >
              Ticket Type <span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="tickt_types"
              value={formData.tickt_types || ""}
              options={typeOptions}
              onChange={(e) => onChange("tickt_types", e.value)}
              placeholder="Select Type"
              className={`w-full border-200 focus:border-pink-500 transition-all ${
                errors.tickt_types ? "p-invalid" : ""
              }`}
            />
            {errors.tickt_types && (
              <small className="p-error">{errors.tickt_types}</small>
            )}
          </div>
        </div>

        <div className="col-12">
          <div className="flex flex-column gap-2 mb-4">
            <label
              htmlFor="tickt_cmdat"
              className="text-sm font-bold text-700 uppercase"
            >
              Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="tickt_cmdat"
              value={formData.tickt_cmdat || ""}
              onChange={(e) => onChange("tickt_cmdat", e.target.value)}
              className={`p-inputtext p-inputtext-lg w-full border-1 border-200 border-round focus:border-pink-500 transition-all outline-none ${
                errors.tickt_cmdat ? "p-invalid" : ""
              }`}
              required
            />
            {errors.tickt_cmdat && (
              <small className="p-error">{errors.tickt_cmdat}</small>
            )}
          </div>
        </div>

        <div className="col-12">
          <div className="flex flex-column gap-2 mb-4">
            <label
              htmlFor="tickt_cmnte"
              className="text-sm font-bold text-700 uppercase"
            >
              Comment / Issue Description{" "}
              <span className="text-red-500">*</span>
            </label>
            <InputTextarea
              id="tickt_cmnte"
              value={formData.tickt_cmnte || ""}
              onChange={(e) => onChange("tickt_cmnte", e.target.value)}
              rows={4}
              className={`w-full text-lg border-200 focus:border-pink-500 transition-all ${
                errors.tickt_cmnte ? "p-invalid" : ""
              }`}
              autoResize
              placeholder="Describe the issue or feedback..."
            />
            {errors.tickt_cmnte && (
              <small className="p-error">{errors.tickt_cmnte}</small>
            )}
          </div>
        </div>

        {(formData.tickt_cmsts === "Resolved" ||
          formData.tickt_cmsts === "Closed") && (
          <>
            <div className="col-12">
              <div className="flex flex-column gap-2 mb-4">
                <label
                  htmlFor="tickt_rsnte"
                  className="text-sm font-bold text-700 uppercase"
                >
                  Resolution Note
                </label>
                <InputTextarea
                  id="tickt_rsnte"
                  value={formData.tickt_rsnte || ""}
                  onChange={(e) => onChange("tickt_rsnte", e.target.value)}
                  rows={3}
                  className="w-full border-200 focus:border-green-500 transition-all"
                  autoResize
                  placeholder="How was it resolved?"
                />
              </div>
            </div>

            <div className="col-12">
              <div className="flex flex-column gap-2 mb-4">
                <label
                  htmlFor="tickt_rsdat"
                  className="text-sm font-bold text-700 uppercase"
                >
                  Resolution Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="tickt_rsdat"
                  value={formData.tickt_rsdat || ""}
                  onChange={(e) => onChange("tickt_rsdat", e.target.value)}
                  className="p-inputtext p-inputtext-lg w-full border-1 border-200 border-round focus:border-green-500 transition-all outline-none"
                />
              </div>
            </div>
          </>
        )}

        <div className="col-12">
          <div className="flex justify-content-end gap-3 mt-4">
            <Button
              label={formData.id ? "Update Ticket" : "Submit Ticket"}
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

export default TicketsFormComp;
