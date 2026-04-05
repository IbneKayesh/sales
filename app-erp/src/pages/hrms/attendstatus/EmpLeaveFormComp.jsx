import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ToggleButton } from "primereact/togglebutton";
import tmhb_atnst from "@/models/hrms/tmhb_atnst.json";
import RequiredText from "@/components/RequiredText";
import { InputSwitch } from "primereact/inputswitch";

const EmpLeaveFormComp = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
}) => {
  return (
    <div className="grid">

      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">
          Year
        </label>
        <InputText
          name="lvemp_yerid"
          value={formData.lvemp_yerid}
          onChange={(e) => onChange("lvemp_yerid", e.target.value)}
          className={`w-full ${errors.lvemp_yerid ? "p-invalid" : ""}`}
          placeholder={`Enter year`}
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

export default EmpLeaveFormComp;