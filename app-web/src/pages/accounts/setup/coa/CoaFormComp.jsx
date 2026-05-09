import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import AuditFields from "@/components/AuditFields";
import RequiredText from "@/components/RequiredText";

const CoaFormComp = ({
  formData,
  errors,
  onChange,
  chtac_chtac_Options,
  chtac_ctype_Options,
}) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-3">
        <label className="block font-bold mb-2 text-red-800">Parent</label>
        <Dropdown
          name="chtac_chtac"
          value={formData.chtac_chtac}
          onChange={(e) => onChange("chtac_chtac", e.value)}
          options={chtac_chtac_Options}
          optionLabel="chtac_cname"
          optionValue="id"
          className={`w-full ${errors.chtac_chtac ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter parent`}
          filter
          showClear
        />
        <RequiredText text={errors.chtac_chtac} />
      </div>
      <div className="col-12 md:col-5">
        <label className="block font-bold mb-2 text-red-800">COA</label>
        <InputText
          name="chtac_cname"
          value={formData.chtac_cname}
          onChange={(e) => onChange("chtac_cname", e.target.value)}
          className={`w-full ${errors.chtac_cname ? "p-invalid" : ""}`}
          placeholder={`Enter name`}
        />
        <RequiredText text={errors.chtac_cname} />
      </div>

      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Type</label>
        <Dropdown
          name="chtac_ctype"
          value={formData.chtac_ctype}
          onChange={(e) => onChange("chtac_ctype", e.value)}
          options={chtac_ctype_Options}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.chtac_ctype ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter type`}
          filter
          showClear
        />
        <RequiredText text={errors.chtac_ctype} />
      </div>

      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">
          Allow Posting
        </label>
        <div className="checkbox-container">
          <Checkbox
            name="chtac_alpst"
            checked={formData.chtac_alpst}
            onChange={(e) => onChange("chtac_alpst", e.checked)}
            className={errors.chtac_alpst ? "p-invalid" : ""}
          />
        </div>
      </div>

      {formData.id && (
        <AuditFields
          active={formData.chtac_actve}
          createdBy={formData.crusr_cname}
          createdAt={formData.chtac_crdat}
          updatedBy={formData.upusr_cname}
          updatedAt={formData.chtac_updat}
          revNo={formData.chtac_rvnmr}
        />
      )}
    </div>
  );
};
export default CoaFormComp;
