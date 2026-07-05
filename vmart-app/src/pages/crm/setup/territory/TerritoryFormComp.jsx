import { InputText } from "primereact/inputtext";
import RequiredText from "@/components/RequiredText";
import { Dropdown } from "primereact/dropdown";
import AuditFields from "@/components/AuditFields";

const TerritoryFormComp = ({
  formData,
  errors,
  onChange,
  dzone_cntry_Options,
  tarea_dzone_Options,
  trtry_tarea_Options,
}) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Country</label>
        <Dropdown
          name="dzone_cntry"
          value={formData.dzone_cntry}
          onChange={(e) => onChange("dzone_cntry", e.value)}
          options={dzone_cntry_Options}
          optionLabel="label_text"
          optionValue="value_text"
          className={`w-full ${errors.dzone_cntry ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter country`}
          filter
          showClear
        />
        <RequiredText text={errors.dzone_cntry} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">D/Zone</label>
        <Dropdown
          name="tarea_dzone"
          value={formData.tarea_dzone}
          onChange={(e) => onChange("tarea_dzone", e.value)}
          options={tarea_dzone_Options}
          optionLabel="dzone_dname"
          optionValue="id"
          className={`w-full ${errors.tarea_dzone ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter d/zone`}
          filter
          showClear
        />
        <RequiredText text={errors.tarea_dzone} />
      </div>
      <div className="col-12 md:col-3">
        <label className="block font-bold mb-2 text-red-800">T/Area</label>
        <Dropdown
          name="trtry_tarea"
          value={formData.trtry_tarea}
          onChange={(e) => onChange("trtry_tarea", e.value)}
          options={trtry_tarea_Options}
          optionLabel="tarea_tname"
          optionValue="id"
          className={`w-full ${errors.trtry_tarea ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter t/area`}
          filter
          showClear
        />
        <RequiredText text={errors.trtry_tarea} />
      </div>
      <div className="col-12 md:col-5">
        <label className="block font-bold mb-2 text-red-800">Territory Name</label>
        <InputText
          name="trtry_wname"
          value={formData.trtry_wname}
          onChange={(e) => onChange("trtry_wname", e.target.value)}
          className={`w-full ${errors.trtry_wname ? "p-invalid" : ""}`}
          placeholder={`Enter territory name`}
        />
        <RequiredText text={errors.trtry_wname} />
      </div>

      {formData.id && (
        <AuditFields
          active={formData.trtry_actve}
          createdBy={formData.crusr_cname}
          createdAt={formData.trtry_crdat}
          updatedBy={formData.upusr_cname}
          updatedAt={formData.trtry_updat}
          revNo={formData.trtry_rvnmr}
        />
      )}
    </div>
  );
};
export default TerritoryFormComp;
