import { InputText } from "primereact/inputtext";
import RequiredText from "@/components/RequiredText";
import AuditFields from "@/components/AuditFields";

const BrandsFormComp = ({ formData, errors, onChange }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <label className="block font-bold mb-2 text-red-800">Brand Name</label>
        <InputText
          name="brand_bname"
          value={formData.brand_bname}
          onChange={(e) => onChange("brand_bname", e.target.value)}
          className={`w-full ${errors.brand_bname ? "p-invalid" : ""}`}
          placeholder={`Enter brand name`}
        />
        <RequiredText text={errors.brand_bname} />
      </div>

      {formData.id && (
        <AuditFields
          active={formData.brand_actve}
          createdBy={formData.crusr_cname}
          createdAt={formData.brand_crdat}
          updatedBy={formData.upusr_cname}
          updatedAt={formData.brand_updat}
          revNo={formData.brand_rvnmr}
        />
      )}
    </div>
  );
};
export default BrandsFormComp;
