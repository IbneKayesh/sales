import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import tmib_iuofm from "@/models/inventory/tmib_iuofm.json";
import { unitGroupOptions } from "@/utils/vtable";
import { Dropdown } from "primereact/dropdown";

const UnitFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <label
          htmlFor="iuofm_untnm"
          className="block text-900 font-medium mb-2"
        >
          {tmib_iuofm.iuofm_untnm.label} <span className="text-red-500">*</span>
        </label>
        <InputText
          name="iuofm_untnm"
          value={formData.iuofm_untnm}
          onChange={(e) => onChange("iuofm_untnm", e.target.value)}
          className={`w-full ${errors.iuofm_untnm ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmib_iuofm.iuofm_untnm.label}`}
        />
        {errors.iuofm_untnm && (
          <small className="mb-3 text-red-500">{errors.iuofm_untnm}</small>
        )}
      </div>
      <div className="col-12 md:col-6">
        <label
          htmlFor="iuofm_untgr"
          className="block text-900 font-medium mb-2"
        >
          {tmib_iuofm.iuofm_untgr.label} <span className="text-red-500">*</span>
        </label>
        <Dropdown
          name="iuofm_untgr"
          value={formData.iuofm_untgr}
          onChange={(e) => onChange("iuofm_untgr", e.value)}
          options={unitGroupOptions}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.iuofm_untgr ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmib_iuofm.iuofm_untgr.label}`}
        />
        {errors.iuofm_untgr && (
          <small className="mb-3 text-red-500">{errors.iuofm_untgr}</small>
        )}
      </div>
      <div className="col-12">
        <div className="flex flex-row-reverse flex-wrap">
          <Button
            type="button"
            onClick={(e) => onSave(e)}
            label={formData.id ? "Update" : "Save"}
            icon={isBusy ? "pi pi-spin pi-spinner" : "pi pi-check"}
            severity="success"
            size="small"
            loading={isBusy}
          />
        </div>
      </div>
    </div>
  );
};

export default UnitFormComp;
