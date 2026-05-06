import { InputText } from "primereact/inputtext";
import RequiredText from "@/components/RequiredText";
import { Dropdown } from "primereact/dropdown";
import AuditFields from "@/components/AuditFields";

const UnitsFormComp = ({ formData, errors, onChange, units_untgr_Options }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <label className="block font-bold mb-2 text-red-800">Group</label>
        <Dropdown
          name="units_untgr"
          value={formData.units_untgr}
          onChange={(e) => onChange("units_untgr", e.value)}
          options={units_untgr_Options}
          optionLabel="label_text"
          optionValue="value_text"
          className={`w-full ${errors.units_untgr ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter group`}
          filter
          showClear
        />
        <RequiredText text={errors.units_untgr} />
      </div>
      <div className="col-12 md:col-6">
        <label className="block font-bold mb-2 text-red-800">Unit Name</label>
        <InputText
          name="units_uname"
          value={formData.units_uname}
          onChange={(e) => onChange("units_uname", e.target.value)}
          className={`w-full ${errors.units_uname ? "p-invalid" : ""}`}
          placeholder={`Enter D/Zone name`}
        />
        <RequiredText text={errors.units_uname} />
      </div>

      {formData.id && (
        <AuditFields
          active={formData.units_actve}
          createdBy={formData.crusr_cname}
          createdAt={formData.units_crdat}
          updatedBy={formData.upusr_cname}
          updatedAt={formData.units_updat}
          revNo={formData.units_rvnmr}
        />
      )}
    </div>
  );
};
export default UnitsFormComp;
