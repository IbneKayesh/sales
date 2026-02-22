import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import tmcb_dzone from "@/models/crm/tmcb_dzone.json";
import RequiredText from "@/components/RequiredText";
import { Dropdown } from "primereact/dropdown";
import { countryOptions } from "@/utils/vtable";


const DZoneFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-8">
        <label
          htmlFor="dzone_dname"
          className="block font-bold mb-2 text-red-800"
        >
          {tmcb_dzone.dzone_dname.label}
        </label>
        <InputText
          name="dzone_dname"
          value={formData.dzone_dname}
          onChange={(e) => onChange("dzone_dname", e.target.value)}
          className={`w-full ${errors.dzone_dname ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmcb_dzone.dzone_dname.label}`}
        />
        <RequiredText text={errors.dzone_dname} />
      </div>
      <div className="col-12 md:col-4">
        <label
          htmlFor="dzone_cntry"
          className="block font-bold mb-2 text-red-800"
        >
          {tmcb_dzone.dzone_cntry.label}
        </label>
        <Dropdown
          name="dzone_cntry"
          value={formData.dzone_cntry}
          options={countryOptions}
          onChange={(e) => onChange("dzone_cntry", e.value)}
          className={`w-full ${errors.dzone_cntry ? "p-invalid" : ""}`}
          placeholder={`Select ${tmcb_dzone.dzone_cntry.label}`}
          optionLabel="label"
          optionValue="value"
        />
        <RequiredText text={errors.dzone_cntry} />
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

export default DZoneFormComp;
