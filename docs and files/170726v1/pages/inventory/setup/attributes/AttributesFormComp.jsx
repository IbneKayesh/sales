import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import RequiredText from "@/components/RequiredText";
import AuditFields from "@/components/AuditFields";

const AttributesFormComp = ({
  formData,
  errors,
  onChange,
  attrb_mcatg_Options,
  attrb_dtype_Options,
}) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">
          Category Name
        </label>
        <Dropdown
          name="attrb_mcatg"
          value={formData.attrb_mcatg}
          onChange={(e) => onChange("attrb_mcatg", e.value)}
          options={attrb_mcatg_Options}
          optionLabel="mcatg_mname"
          optionValue="id"
          className={`w-full ${errors.attrb_mcatg ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter category`}
          filter
          showClear
        />
        <RequiredText text={errors.attrb_mcatg} />
      </div>
      <div className="col-12 md:col-6">
        <label className="block font-bold mb-2 text-red-800">
          Attributes Name
        </label>
        <InputText
          name="attrb_aname"
          value={formData.attrb_aname}
          onChange={(e) => onChange("attrb_aname", e.target.value)}
          className={`w-full ${errors.attrb_aname ? "p-invalid" : ""}`}
          placeholder={`Enter attributes name`}
        />
        <RequiredText text={errors.attrb_aname} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Type</label>
        <Dropdown
          name="attrb_dtype"
          value={formData.attrb_dtype}
          onChange={(e) => onChange("attrb_dtype", e.value)}
          options={attrb_dtype_Options}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.attrb_dtype ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter type`}
          filter
          showClear
        />
        <RequiredText text={errors.attrb_dtype} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Type Value</label>
        <InputText
          name="attrb_dvalu"
          value={formData.attrb_dvalu}
          onChange={(e) => onChange("attrb_dvalu", e.target.value)}
          className={`w-full ${errors.attrb_dvalu ? "p-invalid" : ""}`}
          placeholder={`Enter type value`}
        />
        <RequiredText text={errors.attrb_dvalu} />
      </div>
      {formData.id && (
        <AuditFields
          active={formData.attrb_actve}
          createdBy={formData.crusr_cname}
          createdAt={formData.attrb_crdat}
          updatedBy={formData.upusr_cname}
          updatedAt={formData.attrb_updat}
          revNo={formData.attrb_rvnmr}
        />
      )}
    </div>
  );
};
export default AttributesFormComp;
