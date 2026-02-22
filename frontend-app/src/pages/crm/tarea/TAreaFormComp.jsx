import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import tmcb_tarea from "@/models/crm/tmcb_tarea.json";
import RequiredText from "@/components/RequiredText";
import { Dropdown } from "primereact/dropdown";
import { useZoneSgd } from "@/hooks/crm/useZoneSgd";
import { useEffect } from "react";
import { countryOptions } from "@/utils/vtable";

const TAreaFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  const { dataList: dzoneOptions, handleLoadZones } = useZoneSgd();


  useEffect(() => {
    if (formData.dzone_cntry) {
      handleLoadZones(formData.dzone_cntry);
    }
  }, [formData.dzone_cntry]);


  
  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <label
          htmlFor="tarea_tname"
          className="block font-bold mb-2 text-red-800"
        >
          {tmcb_tarea.tarea_tname.label}
        </label>
        <InputText
          name="tarea_tname"
          value={formData.tarea_tname}
          onChange={(e) => onChange("tarea_tname", e.target.value)}
          className={`w-full ${errors.tarea_tname ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmcb_tarea.tarea_tname.label}`}
        />
        <RequiredText text={errors.tarea_tname} />
      </div>
      <div className="col-12 md:col-3">
        <label
          htmlFor="dzone_cntry"
          className="block font-bold mb-2 text-red-800"
        >
          {tmcb_tarea.dzone_cntry.label}
        </label>
        <Dropdown
          name="dzone_cntry"
          value={formData.dzone_cntry}
          options={countryOptions}
          onChange={(e) => onChange("dzone_cntry", e.value)}
          className={`w-full ${errors.dzone_cntry ? "p-invalid" : ""}`}
          placeholder={`Select ${tmcb_tarea.dzone_cntry.label}`}
          optionLabel="label"
          optionValue="value"
        />
        <RequiredText text={errors.dzone_cntry} />
      </div>

      <div className="col-12 md:col-3">
        <label
          htmlFor="tarea_dzone"
          className="block font-bold mb-2 text-red-800"
        >
          {tmcb_tarea.tarea_dzone.label}
        </label>
        <Dropdown
          name="tarea_dzone"
          value={formData.tarea_dzone}
          options={dzoneOptions}
          onChange={(e) => onChange("tarea_dzone", e.value)}
          className={`w-full ${errors.tarea_dzone ? "p-invalid" : ""}`}
          placeholder={`Select ${tmcb_tarea.tarea_dzone.label}`}
          optionLabel="dzone_dname"
          optionValue="id"
        />
        <RequiredText text={errors.tarea_dzone} />
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

export default TAreaFormComp;
