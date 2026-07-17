import { InputText } from "primereact/inputtext";
import RequiredText from "@/components/RequiredText";
import AuditFields from "@/components/AuditFields";

const CategoryFormComp = ({ formData, errors, onChange }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <label className="block font-bold mb-2 text-red-800">Category Name</label>
        <InputText
          name="mcatg_mname"
          value={formData.mcatg_mname}
          onChange={(e) => onChange("mcatg_mname", e.target.value)}
          className={`w-full ${errors.mcatg_mname ? "p-invalid" : ""}`}
          placeholder={`Enter category name`}
        />
        <RequiredText text={errors.mcatg_mname} />
      </div>

      {formData.id && (
        <AuditFields
          active={formData.mcatg_actve}
          createdBy={formData.crusr_cname}
          createdAt={formData.mcatg_crdat}
          updatedBy={formData.upusr_cname}
          updatedAt={formData.mcatg_updat}
          revNo={formData.mcatg_rvnmr}
        />
      )}
    </div>
  );
};
export default CategoryFormComp;
