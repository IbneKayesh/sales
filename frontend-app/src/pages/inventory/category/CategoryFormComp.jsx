import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import tmib_ctgry from "@/models/inventory/tmib_ctgry.json";

const CategoryFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  return (
    <div className="grid">
      <div className="col-12">
        <label htmlFor="ctgry_ctgnm" className="block text-900 font-medium mb-2">
          {tmib_ctgry.ctgry_ctgnm.label} <span className="text-red-500">*</span>
        </label>
        <InputText
          name="ctgry_ctgnm"
          value={formData.ctgry_ctgnm}
          onChange={(e) => onChange("ctgry_ctgnm", e.target.value)}
          className={`w-full ${errors.ctgry_ctgnm ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmib_ctgry.ctgry_ctgnm.label}`}
        />
        {errors.ctgry_ctgnm && (
          <small className="mb-3 text-red-500">{errors.ctgry_ctgnm}</small>
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

export default CategoryFormComp;
