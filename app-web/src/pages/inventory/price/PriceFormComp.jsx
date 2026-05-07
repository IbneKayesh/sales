import { InputText } from "primereact/inputtext";
import RequiredText from "@/components/RequiredText";
import AuditFields from "@/components/AuditFields";

const PriceFormComp = ({ formData, errors, onChange }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <label className="block font-bold mb-2 text-red-800">Price Name</label>
        <InputText
          name="price_mname"
          value={formData.price_mname}
          onChange={(e) => onChange("price_mname", e.target.value)}
          className={`w-full ${errors.price_mname ? "p-invalid" : ""}`}
          placeholder={`Enter price name`}
        />
        <RequiredText text={errors.price_mname} />
      </div>

      {formData.id && (
        <AuditFields
          active={formData.price_actve}
          createdBy={formData.crusr_cname}
          createdAt={formData.price_crdat}
          updatedBy={formData.upusr_cname}
          updatedAt={formData.price_updat}
          revNo={formData.price_rvnmr}
        />
      )}
    </div>
  );
};
export default PriceFormComp;
