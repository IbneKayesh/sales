import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import tmhb_hlday from "@/models/hrms/tmhb_hlday.json";
import RequiredText from "@/components/RequiredText";

const HolidaysFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <label htmlFor="hlday_yerid" className="block font-bold mb-2 text-red-800">
          {tmhb_hlday.hlday_yerid.label}
        </label>
        <InputNumber
          name="hlday_yerid"
          value={formData.hlday_yerid}
          onValueChange={(e) => onChange("hlday_yerid", e.value)}
          className={`w-full ${errors.hlday_yerid ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_hlday.hlday_yerid.label}`}
          useGrouping={false}
          min={2000}
          max={9999}
        />
        <RequiredText text={errors.hlday_yerid} />
      </div>

      <div className="col-12 md:col-6">
        <label htmlFor="hlday_hldat" className="block font-bold mb-2 text-red-800">
          {tmhb_hlday.hlday_hldat.label}
        </label>
        <Calendar
          name="hlday_hldat"
          value={formData.hlday_hldat ? new Date(formData.hlday_hldat) : null}
          onChange={(e) => onChange("hlday_hldat", e.value)}
          className={`w-full ${errors.hlday_hldat ? "p-invalid" : ""}`}
          placeholder={`Select ${tmhb_hlday.hlday_hldat.label}`}
          showIcon
          dateFormat="dd/mm/yy"
        />
        <RequiredText text={errors.hlday_hldat} />
      </div>

      <div className="col-12 md:col-6">
        <label htmlFor="hlday_hldnm" className="block font-bold mb-2 text-red-800">
          {tmhb_hlday.hlday_hldnm.label}
        </label>
        <InputText
          name="hlday_hldnm"
          value={formData.hlday_hldnm}
          onChange={(e) => onChange("hlday_hldnm", e.target.value)}
          className={`w-full ${errors.hlday_hldnm ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_hlday.hlday_hldnm.label}`}
        />
        <RequiredText text={errors.hlday_hldnm} />
      </div>

      <div className="col-12 md:col-6">
        <label htmlFor="hlday_notes" className="block font-bold mb-2">
          {tmhb_hlday.hlday_notes.label}
        </label>
        <InputText
          name="hlday_notes"
          value={formData.hlday_notes || ""}
          onChange={(e) => onChange("hlday_notes", e.target.value)}
          className={`w-full ${errors.hlday_notes ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_hlday.hlday_notes.label}`}
        />
        <RequiredText text={errors.hlday_notes} />
      </div>

      <div className="col-12">
        <div className="flex flex-row-reverse flex-wrap">
          <Button
            type="button"
            onClick={(e) => onSave(e)}
            label={formData.id ? "Update" : "Save"}
            icon={"pi pi-check"}
            severity="success"
            size="small"
            loading={isBusy}
          />
        </div>
      </div>
    </div>
  );
};

export default HolidaysFormComp;
