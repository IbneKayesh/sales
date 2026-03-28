import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ToggleButton } from "primereact/togglebutton";
import tmhb_atnst from "@/models/hrms/tmhb_atnst.json";
import RequiredText from "@/components/RequiredText";
import { InputSwitch } from "primereact/inputswitch";

const AttendStatusFormComp = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
}) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-4">
        <label
          htmlFor="atnst_sname"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_atnst.atnst_sname.label}
        </label>
        <InputText
          name="atnst_sname"
          value={formData.atnst_sname}
          onChange={(e) => onChange("atnst_sname", e.target.value)}
          className={`w-full ${errors.atnst_sname ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_atnst.atnst_sname.label}`}
        />
        <RequiredText text={errors.atnst_sname} />
      </div>

      <div className="col-12 md:col-2">
        <label htmlFor="atnst_color" className="block font-bold mb-2">
          {tmhb_atnst.atnst_color.label}
        </label>
        <InputText
          name="atnst_color"
          value={formData.atnst_color || ""}
          onChange={(e) => onChange("atnst_color", e.target.value)}
          className={`w-full ${errors.atnst_color ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_atnst.atnst_color.label}`}
        />
        <RequiredText text={errors.atnst_color} />
      </div>

      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">
          {tmhb_atnst.atnst_prsnt.label}
        </label>
        <InputSwitch
          name="atnst_prsnt"
          checked={formData.atnst_prsnt === true}
          onChange={(e) => onChange("atnst_prsnt", e.value ? true : false)}
          className={`${errors.atnst_prsnt ? "p-invalid" : ""}`}
        />
      </div>

      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">
          {tmhb_atnst.atnst_paybl.label}
        </label>
        <InputSwitch
          name="atnst_paybl"
          checked={formData.atnst_paybl === true}
          onChange={(e) => onChange("atnst_paybl", e.value ? true : false)}
          className={`${errors.atnst_paybl ? "p-invalid" : ""}`}
        />
      </div>

      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">
          {tmhb_atnst.atnst_nappl.label}
        </label>
        <InputText
          name="atnst_nappl"
          value={formData.atnst_nappl}
          onChange={(e) => onChange("atnst_nappl", e.target.value)}
          className={`w-full ${errors.atnst_nappl ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_atnst.atnst_nappl.label}`}
        />
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

export default AttendStatusFormComp;
