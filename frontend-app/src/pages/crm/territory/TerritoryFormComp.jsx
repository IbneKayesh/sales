import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import tmcb_trtry from "@/models/crm/tmcb_trtry.json";
import RequiredText from "@/components/RequiredText";
import { Dropdown } from "primereact/dropdown";
import { useZoneSgd } from "@/hooks/crm/useZoneSgd";
import { useAreasSgd } from "@/hooks/crm/useAreasSgd";
import { useEffect } from "react";
import { countryOptions } from "@/utils/vtable";

const TerritoryFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  const { dataList: dzoneOptions, handleLoadZones } = useZoneSgd();
  const { dataList: tareaOptions, handleLoadAreas } = useAreasSgd();
  useEffect(() => {
    if (formData.dzone_cntry) {
      handleLoadZones(formData.dzone_cntry);
    }

    if (formData.tarea_dzone) {
      handleLoadAreas(formData.tarea_dzone);
    }
  }, [formData.dzone_cntry, formData.tarea_dzone]);
  return (
    <div className="grid">
      <div className="col-12 md:col-4">
        <label
          htmlFor="trtry_wname"
          className="block font-bold mb-2 text-red-800"
        >
          {tmcb_trtry.trtry_wname.label}
        </label>
        <InputText
          name="trtry_wname"
          value={formData.trtry_wname}
          onChange={(e) => onChange("trtry_wname", e.target.value)}
          className={`w-full ${errors.trtry_wname ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmcb_trtry.trtry_wname.label}`}
        />
        <RequiredText text={errors.trtry_wname} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="dzone_cntry"
          className="block font-bold mb-2 text-red-800"
        >
          {tmcb_trtry.dzone_cntry.label}
        </label>
        <Dropdown
          name="dzone_cntry"
          value={formData.dzone_cntry}
          options={countryOptions}
          onChange={(e) => onChange("dzone_cntry", e.value)}
          className={`w-full ${errors.dzone_cntry ? "p-invalid" : ""}`}
          placeholder={`Select ${tmcb_trtry.dzone_cntry.label}`}
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
          {tmcb_trtry.tarea_dzone.label}
        </label>
        <Dropdown
          name="tarea_dzone"
          value={formData.tarea_dzone}
          options={dzoneOptions}
          onChange={(e) => onChange("tarea_dzone", e.value)}
          className={`w-full ${errors.tarea_dzone ? "p-invalid" : ""}`}
          placeholder={`Select ${tmcb_trtry.tarea_dzone.label}`}
          optionLabel="dzone_dname"
          optionValue="id"
        />
        <RequiredText text={errors.tarea_dzone} />
      </div>
      <div className="col-12 md:col-3">
        <label
          htmlFor="trtry_tarea"
          className="block font-bold mb-2 text-red-800"
        >
          {tmcb_trtry.trtry_tarea.label}
        </label>
        <Dropdown
          name="trtry_tarea"
          value={formData.trtry_tarea}
          options={tareaOptions}
          onChange={(e) => onChange("trtry_tarea", e.value)}
          className={`w-full ${errors.trtry_tarea ? "p-invalid" : ""}`}
          placeholder={`Select ${tmcb_trtry.trtry_tarea.label}`}
          optionLabel="tarea_tname"
          optionValue="id"
        />
        <RequiredText text={errors.trtry_tarea} />
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

export default TerritoryFormComp;
