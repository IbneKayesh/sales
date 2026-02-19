import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import tmcb_rutes from "@/models/crm/tmcb_rutes.json";
import RequiredText from "@/components/RequiredText";
import { Dropdown } from "primereact/dropdown";
import { useTerritorySgd } from "@/hooks/crm/useTerritorySgd";
import { useEffect } from "react";
import { dayNameOptions } from "@/utils/vtable";


const RouteFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  const { dataList: territoryOptions, handleLoadTerritories } = useTerritorySgd();
  useEffect(() => {
    handleLoadTerritories();
  }, []);
  return (
    <div className="grid">
      <div className="col-12 md:col-4">
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
      <div className="col-12 md:col-4">
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
      <div className="col-12 md:col-4">
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

export default RouteFormComp;
