import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import tmhb_atnlg from "@/models/hrms/tmhb_atnlg.json";
import RequiredText from "@/components/RequiredText";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";

const AttendLogFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSave(e);
    }
  };
  return (
    <div className="grid justify-content-center">
      <div className="col-12 md:col-3">
        <label htmlFor="atnlg_ecode" className="block font-bold mb-2">
          {tmhb_atnlg.atnlg_ecode.label}
        </label>
        <InputText
          name="atnlg_ecode"
          value={formData.atnlg_ecode}
          onChange={(e) => onChange("atnlg_ecode", e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full ${errors.atnlg_ecode ? "p-invalid" : ""}`}
          placeholder={tmhb_atnlg.atnlg_ecode.placeholder}
        />
        <RequiredText text={errors.atnlg_ecode} />
      </div>
      <div className="col-12 md:col-3">
        <label htmlFor="atnlg_crdno" className="block font-bold mb-2">
          {tmhb_atnlg.atnlg_crdno.label}
        </label>
        <InputText
          name="atnlg_crdno"
          value={formData.atnlg_crdno}
          onChange={(e) => onChange("atnlg_crdno", e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full ${errors.atnlg_crdno ? "p-invalid" : ""}`}
          placeholder={tmhb_atnlg.atnlg_crdno.placeholder}
        />
        <RequiredText text={errors.atnlg_crdno} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="atnlg_lgtim" className="block font-bold mb-2">
          {tmhb_atnlg.atnlg_lgtim.label}
        </label>
        <Calendar
          name="atnlg_lgtim"
          value={formData.atnlg_lgtim}
          onChange={(e) => onChange("atnlg_lgtim", e.target.value)}
          className={`w-full ${errors.atnlg_lgtim ? "p-invalid" : ""}`}
          placeholder={`Select ${tmhb_atnlg.atnlg_lgtim.label}`}
          showTime
          hourFormat="24"
        />
        <RequiredText text={errors.atnlg_lgtim} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="refresh_time" className="block font-bold mb-2">
          Refresh Time
        </label>
        <InputSwitch
          name="refresh_time"
          checked={formData.refresh_time === true}
          onChange={(e) => onChange("refresh_time", e.value ? true : false)}
          className={`${errors.refresh_time ? "p-invalid" : ""}`}
        />
        <RequiredText text={errors.refresh_time} />
      </div>

      <div className="col-12 flex justify-content-center mt-3">
        <Button
          type="button"
          onClick={(e) => onSave(e)}
          label={"Log Attendance"}
          icon={"pi pi-check"}
          severity="success"
          size="small"
          loading={isBusy}
        />
      </div>
    </div>
  );
};

export default AttendLogFormComp;
