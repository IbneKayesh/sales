import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import { InputNumber } from "primereact/inputnumber";
import RequiredText from "@/components/RequiredText";

const AttendFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-3">
        <label htmlFor="attnd_emply" className="block font-bold mb-2 text-red-800">
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
        <label htmlFor="attnd_wksft" className="block font-bold mb-2 text-red-800">
          Work Shift
        </label>
        <InputText
          name="attnd_wksft"
          value={formData.attnd_wksft}
          onChange={(e) => onChange("attnd_wksft", e.target.value)}
          className={`w-full ${errors.attnd_wksft ? "p-invalid" : ""}`}
          placeholder="Enter Work Shift"
        />
        <RequiredText text={errors.attnd_wksft} />
      </div>

      <div className="col-12 md:col-3">
        <label htmlFor="attnd_atdat" className="block font-bold mb-2 text-red-800">
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

      <div className="col-12 md:col-3">
        <label htmlFor="attnd_dname" className="block font-bold mb-2 text-red-800">
          Day Name
        </label>
        <InputText
          name="attnd_dname"
          value={formData.attnd_dname}
          onChange={(e) => onChange("attnd_dname", e.target.value)}
          className={`w-full ${errors.attnd_dname ? "p-invalid" : ""}`}
          placeholder="Enter Day Name"
        />
        <RequiredText text={errors.attnd_dname} />
      </div>

      <div className="col-12 md:col-2">
        <label htmlFor="attnd_sname" className="block font-bold mb-2">
          Status Name
        </label>
        <InputText
          name="attnd_sname"
          value={formData.attnd_sname}
          onChange={(e) => onChange("attnd_sname", e.target.value)}
          className={`w-full ${errors.attnd_sname ? "p-invalid" : ""}`}
          placeholder="Enter Status"
        />
        <RequiredText text={errors.attnd_sname} />
      </div>

      <div className="col-12 md:col-2">
        <label htmlFor="attnd_prsnt" className="block font-bold mb-2">
          Present
        </label>
        <InputSwitch
          name="attnd_prsnt"
          checked={formData.attnd_prsnt === true}
          onChange={(e) => onChange("attnd_prsnt", e.value ? true : false)}
          className={`${errors.attnd_prsnt ? "p-invalid" : ""}`}
        />
      </div>

      <div className="col-12 md:col-2">
        <label htmlFor="attnd_paybl" className="block font-bold mb-2">
          Payable
        </label>
        <InputSwitch
          name="attnd_paybl"
          checked={formData.attnd_paybl === true}
          onChange={(e) => onChange("attnd_paybl", e.value ? true : false)}
          className={`${errors.attnd_paybl ? "p-invalid" : ""}`}
        />
      </div>

      <div className="col-12 md:col-3">
        <label htmlFor="attnd_notes" className="block font-bold mb-2">
          Notes
        </label>
        <InputText
          name="attnd_notes"
          value={formData.attnd_notes}
          onChange={(e) => onChange("attnd_notes", e.target.value)}
          className={`w-full ${errors.attnd_notes ? "p-invalid" : ""}`}
          placeholder="Optional notes"
        />
        <RequiredText text={errors.attnd_notes} />
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

export default AttendFormComp;
