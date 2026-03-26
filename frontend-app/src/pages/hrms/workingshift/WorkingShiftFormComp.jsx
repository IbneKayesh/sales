import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import tmhb_wksft from "@/models/hrms/tmhb_wksft.json";
import RequiredText from "@/components/RequiredText";
import { InputSwitch } from "primereact/inputswitch";

const WorkingShiftFormComp = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
}) => {
  return (
    <div className="grid">
      {/* {JSON.stringify(formData)} */}
      <div className="col-12 md:col-12">
        <label
          htmlFor="wksft_sftnm"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_wksft.wksft_sftnm.label}
        </label>
        <InputText
          name="wksft_sftnm"
          value={formData.wksft_sftnm}
          onChange={(e) => onChange("wksft_sftnm", e.target.value)}
          className={`w-full ${errors.wksft_sftnm ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_wksft.wksft_sftnm.label}`}
        />
        <RequiredText text={errors.wksft_sftnm} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="wksft_btbst"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_wksft.wksft_btbst.label}
        </label>
        <InputText
          name="wksft_btbst"
          value={formData.wksft_btbst}
          onChange={(e) => onChange("wksft_btbst", e.target.value)}
          className={`w-full ${errors.wksft_btbst ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_wksft.wksft_btbst.label}`}
        />
        <RequiredText text={errors.wksft_btbst} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="wksft_satim"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_wksft.wksft_satim.label}
        </label>
        <InputText
          name="wksft_satim"
          value={formData.wksft_satim}
          onChange={(e) => onChange("wksft_satim", e.target.value)}
          className={`w-full ${errors.wksft_satim ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_wksft.wksft_satim.label}`}
        />
        <RequiredText text={errors.wksft_satim} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="wksft_gsmin"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_wksft.wksft_gsmin.label}
        </label>
        <InputText
          name="wksft_gsmin"
          value={formData.wksft_gsmin}
          onChange={(e) => onChange("wksft_gsmin", e.target.value)}
          className={`w-full ${errors.wksft_gsmin ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_wksft.wksft_gsmin.label}`}
        />
        <RequiredText text={errors.wksft_gsmin} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="wksft_gemin"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_wksft.wksft_gemin.label}
        </label>
        <InputText
          name="wksft_gemin"
          value={formData.wksft_gemin}
          onChange={(e) => onChange("wksft_gemin", e.target.value)}
          className={`w-full ${errors.wksft_gemin ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_wksft.wksft_gemin.label}`}
        />
        <RequiredText text={errors.wksft_gemin} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="wksft_entim"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_wksft.wksft_entim.label}
        </label>
        <InputText
          name="wksft_entim"
          value={formData.wksft_entim}
          onChange={(e) => onChange("wksft_entim", e.target.value)}
          className={`w-full ${errors.wksft_entim ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_wksft.wksft_entim.label}`}
        />
        <RequiredText text={errors.wksft_entim} />
      </div>

      <div className="col-12 md:col-2">
        <label
          htmlFor="wksft_btand"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_wksft.wksft_btand.label}
        </label>
        <InputText
          name="wksft_btand"
          value={formData.wksft_btand}
          onChange={(e) => onChange("wksft_btand", e.target.value)}
          className={`w-full ${errors.wksft_btand ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_wksft.wksft_btand.label}`}
        />
        <RequiredText text={errors.wksft_btand} />
      </div>

      <div className="col-12 md:col-2">
        <label
          htmlFor="wksft_wrhrs"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_wksft.wksft_wrhrs.label}
        </label>
        <InputText
          name="wksft_wrhrs"
          value={formData.wksft_wrhrs}
          onChange={(e) => onChange("wksft_wrhrs", e.target.value)}
          className={`w-full ${errors.wksft_wrhrs ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_wksft.wksft_wrhrs.label}`}
        />
        <RequiredText text={errors.wksft_wrhrs} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="wksft_mnhrs"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_wksft.wksft_mnhrs.label}
        </label>
        <InputText
          name="wksft_mnhrs"
          value={formData.wksft_mnhrs}
          onChange={(e) => onChange("wksft_mnhrs", e.target.value)}
          className={`w-full ${errors.wksft_mnhrs ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_wksft.wksft_mnhrs.label}`}
        />
        <RequiredText text={errors.wksft_mnhrs} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="wksft_crday"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_wksft.wksft_crday.label}
        </label>
        <InputSwitch
          name="wksft_crday"
          checked={formData.wksft_crday === true}
          onChange={(e) => onChange("wksft_crday", e.value ? true : false)}
          className={`${errors.wksft_crday ? "p-invalid" : ""}`}
        />
        <RequiredText text={errors.wksft_crday} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="wksft_sgpnc"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_wksft.wksft_sgpnc.label}
        </label>
        <InputSwitch
          name="wksft_sgpnc"
          checked={formData.wksft_sgpnc === true}
          onChange={(e) => onChange("wksft_sgpnc", e.value ? true : false)}
          className={`${errors.wksft_sgpnc ? "p-invalid" : ""}`}
        />
        <RequiredText text={errors.wksft_sgpnc} />
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

export default WorkingShiftFormComp;
