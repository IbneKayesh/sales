import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import tmhb_atnlg from "@/models/hrms/tmhb_atnlg.json";
import RequiredText from "@/components/RequiredText";

const AttendLogFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSave(e);
    }
  };
  return (
    <div className="grid justify-content-center">
      <div className="col-12 md:col-3">
        <label
          htmlFor="atnlg_ecode"
          className="block font-bold mb-2"
        >
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
        <label
          htmlFor="atnlg_crdno"
          className="block font-bold mb-2"
        >
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
