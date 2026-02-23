import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import tmcb_rutes from "@/models/crm/tmcb_rutes.json";
import RequiredText from "@/components/RequiredText";
import { Dropdown } from "primereact/dropdown";
import { useZoneSgd } from "@/hooks/crm/useZoneSgd";
import { useAreasSgd } from "@/hooks/crm/useAreasSgd";
import { useTerritorySgd } from "@/hooks/crm/useTerritorySgd";
import { useEffect } from "react";
import { dayNameOptions, countryOptions } from "@/utils/vtable";

const OrderRouteFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  const { dataList: dzoneOptions, handleLoadZones } = useZoneSgd();
  const { dataList: tareaOptions, handleLoadAreas } = useAreasSgd();
  const { dataList: territoryOptions, handleLoadTerritories } =
    useTerritorySgd();

    
  useEffect(() => {
    if (formData.dzone_cntry) {
      handleLoadZones(formData.dzone_cntry);
    }

    if (formData.tarea_dzone) {
      handleLoadAreas(formData.tarea_dzone);
    }
    if (formData.trtry_tarea) {
      handleLoadTerritories(formData.trtry_tarea);
    }
  }, [formData.dzone_cntry, formData.tarea_dzone, formData.trtry_tarea]);

  return (
    <div className="grid">
      <div className="col-12 md:col-2">
        <label
          htmlFor="rutes_rname"
          className="block font-bold mb-2 text-red-800"
        >
          {tmcb_rutes.rutes_rname.label}
        </label>
        <InputText
          name="rutes_rname"
          value={formData.rutes_rname}
          onChange={(e) => onChange("rutes_rname", e.target.value)}
          className={`w-full ${errors.rutes_rname ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmcb_rutes.rutes_rname.label}`}
        />
        <RequiredText text={errors.rutes_rname} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="rutes_dname"
          className="block font-bold mb-2 text-red-800"
        >
          {tmcb_rutes.rutes_dname.label}
        </label>
        <Dropdown
          name="rutes_dname"
          value={formData.rutes_dname}
          options={dayNameOptions}
          onChange={(e) => onChange("rutes_dname", e.value)}
          className={`w-full ${errors.rutes_dname ? "p-invalid" : ""}`}
          placeholder={`Select ${tmcb_rutes.rutes_dname.label}`}
          optionLabel="label"
          optionValue="value"
        />
        <RequiredText text={errors.rutes_dname} />
      </div>

      <div className="col-12 md:col-2">
        <label
          htmlFor="dzone_cntry"
          className="block font-bold mb-2 text-red-800"
        >
          {tmcb_rutes.dzone_cntry.label}
        </label>
        <Dropdown
          name="dzone_cntry"
          value={formData.dzone_cntry}
          options={countryOptions}
          onChange={(e) => onChange("dzone_cntry", e.value)}
          className={`w-full ${errors.dzone_cntry ? "p-invalid" : ""}`}
          placeholder={`Select ${tmcb_rutes.dzone_cntry.label}`}
          optionLabel="label"
          optionValue="value"
        />
        <RequiredText text={errors.dzone_cntry} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="tarea_dzone"
          className="block font-bold mb-2 text-red-800"
        >
          {tmcb_rutes.tarea_dzone.label}
        </label>
        <Dropdown
          name="tarea_dzone"
          value={formData.tarea_dzone}
          options={dzoneOptions}
          onChange={(e) => onChange("tarea_dzone", e.value)}
          className={`w-full ${errors.tarea_dzone ? "p-invalid" : ""}`}
          placeholder={`Select ${tmcb_rutes.tarea_dzone.label}`}
          optionLabel="dzone_dname"
          optionValue="id"
        />
        <RequiredText text={errors.tarea_dzone} />
      </div>

      <div className="col-12 md:col-2">
        <label
          htmlFor="trtry_tarea"
          className="block font-bold mb-2 text-red-800"
        >
          {tmcb_rutes.trtry_tarea.label}
        </label>
        <Dropdown
          name="trtry_tarea"
          value={formData.trtry_tarea}
          options={tareaOptions}
          onChange={(e) => onChange("trtry_tarea", e.value)}
          className={`w-full ${errors.trtry_tarea ? "p-invalid" : ""}`}
          placeholder={`Select ${tmcb_rutes.trtry_tarea.label}`}
          optionLabel="tarea_tname"
          optionValue="id"
        />
        <RequiredText text={errors.trtry_tarea} />
      </div>

      <div className="col-12 md:col-2">
        <label
          htmlFor="rutes_trtry"
          className="block font-bold mb-2 text-red-800"
        >
          {tmcb_rutes.rutes_trtry.label}
        </label>
        <Dropdown
          name="rutes_trtry"
          value={formData.rutes_trtry}
          options={territoryOptions}
          onChange={(e) => onChange("rutes_trtry", e.value)}
          className={`w-full ${errors.rutes_trtry ? "p-invalid" : ""}`}
          placeholder={`Select ${tmcb_rutes.rutes_trtry.label}`}
          optionLabel="trtry_wname"
          optionValue="id"
        />
        <RequiredText text={errors.rutes_trtry} />
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

export default OrderRouteFormComp;
