import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import tmib_ctgry from "@/models/inventory/tmib_ctgry.json";
import RequiredText from "@/components/RequiredText";

const CategoryFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  return (
    <div className="grid">
      <div className="col-12">
        <label htmlFor="ctgry_ctgnm" className="block font-bold mb-2 text-red-800">
          {tmib_ctgry.ctgry_ctgnm.label}
        </label>
        <InputText
          name="ctgry_ctgnm"
          value={formData.ctgry_ctgnm}
          onChange={(e) => onChange("ctgry_ctgnm", e.target.value)}
          className={`w-full ${errors.ctgry_ctgnm ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmib_ctgry.ctgry_ctgnm.label}`}
        />
        <RequiredText text={errors.ctgry_ctgnm} />
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
