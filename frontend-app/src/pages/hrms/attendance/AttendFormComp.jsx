import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import RequiredText from "@/components/RequiredText";

const AttendFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-3">
        <label
          htmlFor="attnd_emply"
          className="block font-bold mb-2"
        >
          Employee Code
        </label>
        <InputText
          name="attnd_emply"
          value={formData.attnd_emply}
          onChange={(e) => onChange("attnd_emply", e.target.value)}
          className={`w-full ${errors.attnd_emply ? "p-invalid" : ""}`}
          placeholder="Enter Employee Code"
        />
        <RequiredText text={errors.attnd_emply} />
      </div>

      <div className="col-12 md:col-3">
        <label
          htmlFor="attnd_atdat"
          className="block font-bold mb-2 text-red-800"
        >
          Attendance Date
        </label>
        <Calendar
          name="attnd_atdat"
          value={formData.attnd_atdat ? new Date(formData.attnd_atdat) : null}
          onChange={(e) => onChange("attnd_atdat", e.value)}
          className={`w-full ${errors.attnd_atdat ? "p-invalid" : ""}`}
          dateFormat="yy-mm-dd"
          placeholder="Select Date"
          showIcon
        />
        <RequiredText text={errors.attnd_atdat} />
      </div>
      <div className="col-12">
        <div className="flex flex-row-reverse flex-wrap">
          <Button
            type="button"
            onClick={(e) => onSave(e)}
            label={"Process Now"}
            icon={"pi pi-ticket"}
            severity="success"
            size="small"
            loading={isBusy}
          />
        </div>
      </div>
    </div>
  );
};

export default AttendFormComp;
