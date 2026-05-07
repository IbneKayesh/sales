import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import RequiredText from "@/components/RequiredText";
import AuditFields from "@/components/AuditFields";

const SubCategoryFormComp = ({
  formData,
  errors,
  onChange,
  scatg_mcatg_Options,
}) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <label className="block font-bold mb-2 text-red-800">
          Category Name
        </label>
        <Dropdown
          name="scatg_mcatg"
          value={formData.scatg_mcatg}
          onChange={(e) => onChange("scatg_mcatg", e.value)}
          options={scatg_mcatg_Options}
          optionLabel="mcatg_mname"
          optionValue="id"
          className={`w-full ${errors.scatg_mcatg ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter category`}
          filter
          showClear
        />
        <RequiredText text={errors.scatg_mcatg} />
      </div>
      <div className="col-12 md:col-6">
        <label className="block font-bold mb-2 text-red-800">
          Sub Category Name
        </label>
        <InputText
          name="scatg_sname"
          value={formData.scatg_sname}
          onChange={(e) => onChange("scatg_sname", e.target.value)}
          className={`w-full ${errors.scatg_sname ? "p-invalid" : ""}`}
          placeholder={`Enter sub category name`}
        />
        <RequiredText text={errors.scatg_sname} />
      </div>

      {formData.id && (
        <AuditFields
          active={formData.scatg_actve}
          createdBy={formData.crusr_cname}
          createdAt={formData.scatg_crdat}
          updatedBy={formData.upusr_cname}
          updatedAt={formData.scatg_updat}
          revNo={formData.scatg_rvnmr}
        />
      )}
    </div>
  );
};
export default SubCategoryFormComp;
