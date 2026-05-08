import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import AuditFields from "@/components/AuditFields";
import RequiredText from "@/components/RequiredText";

const HeadsFormComp = ({
  formData,
  errors,
  onChange,
  ached_ached_Options,
  ached_htype_Options,
}) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-3">
        <label className="block font-bold mb-2 text-red-800">Parent</label>
        <Dropdown
          name="ached_ached"
          value={formData.ached_ached}
          onChange={(e) => onChange("ached_ached", e.value)}
          options={ached_ached_Options}
          optionLabel="ached_hname"
          optionValue="id"
          className={`w-full ${errors.ached_ached ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter parent`}
          filter
          showClear
        />
        <RequiredText text={errors.ached_ached} />
      </div>
      <div className="col-12 md:col-5">
        <label className="block font-bold mb-2 text-red-800">Head Name</label>
        <InputText
          name="ached_hname"
          value={formData.ached_hname}
          onChange={(e) => onChange("ached_hname", e.target.value)}
          className={`w-full ${errors.ached_hname ? "p-invalid" : ""}`}
          placeholder={`Enter name`}
        />
        <RequiredText text={errors.ached_hname} />
      </div>

      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Type</label>
        <Dropdown
          name="ached_htype"
          value={formData.ached_htype}
          onChange={(e) => onChange("ached_htype", e.value)}
          options={ached_htype_Options}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.ached_htype ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter type`}
          filter
          showClear
        />
        <RequiredText text={errors.ached_htype} />
      </div>

      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">
          Allow Posting
        </label>
        <div className="checkbox-container">
          <Checkbox
            name="ached_alpst"
            checked={formData.ached_alpst}
            onChange={(e) => onChange("ached_alpst", e.checked)}
            className={errors.ached_alpst ? "p-invalid" : ""}
          />
        </div>
      </div>

      {formData.id && (
        <AuditFields
          active={formData.ached_actve}
          createdBy={formData.crusr_cname}
          createdAt={formData.ached_crdat}
          updatedBy={formData.upusr_cname}
          updatedAt={formData.ached_updat}
          revNo={formData.ached_rvnmr}
        />
      )}
    </div>
  );
};
export default HeadsFormComp;
