import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import tmhb_lvntl from "@/models/hrms/tmhb_lvntl.json";
import RequiredText from "@/components/RequiredText";

const LeaveEntitleFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-2">
        <label htmlFor="lvntl_yerid" className="block font-bold mb-2 text-red-800">
          {tmhb_lvntl.lvntl_yerid.label}
        </label>
        <InputNumber
          name="lvntl_yerid"
          value={formData.lvntl_yerid}
          onValueChange={(e) => onChange("lvntl_yerid", e.value)}
          className={`w-full ${errors.lvntl_yerid ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_lvntl.lvntl_yerid.label}`}
          useGrouping={false}
          min={2000}
          max={9999}
        />
        <RequiredText text={errors.lvntl_yerid} />
      </div>

      <div className="col-12 md:col-3">
        <label htmlFor="lvntl_atnst" className="block font-bold mb-2 text-red-800">
          {tmhb_lvntl.lvntl_atnst.label}
        </label>
        <InputText
          name="lvntl_atnst"
          value={formData.lvntl_atnst}
          onChange={(e) => onChange("lvntl_atnst", e.target.value)}
          className={`w-full ${errors.lvntl_atnst ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_lvntl.lvntl_atnst.label}`}
        />
        <RequiredText text={errors.lvntl_atnst} />
      </div>

      <div className="col-12 md:col-3">
        <label htmlFor="lvntl_nmbol" className="block font-bold mb-2 text-red-800">
          {tmhb_lvntl.lvntl_nmbol.label}
        </label>
        <InputNumber
          name="lvntl_nmbol"
          value={formData.lvntl_nmbol}
          onValueChange={(e) => onChange("lvntl_nmbol", e.value)}
          className={`w-full ${errors.lvntl_nmbol ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_lvntl.lvntl_nmbol.label}`}
          min={1}
          max={365}
        />
        <RequiredText text={errors.lvntl_nmbol} />
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

export default LeaveEntitleFormComp;
