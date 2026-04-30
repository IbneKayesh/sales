import { InputText } from "primereact/inputtext";
import RequiredText from "@/components/RequiredText";

const CategoryFormComp = ({ formData, errors, onChange }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <label className="block font-bold mb-2 text-red-800">Category Name</label>
        <InputText
          name="itcg_name"
          value={formData.itcg_name}
          onChange={(e) => onChange("itcg_name", e.target.value)}
          className={`w-full ${errors.itcg_name ? "p-invalid" : ""}`}
          placeholder={`Enter category name`}
        />
        <RequiredText text={errors.itcg_name} />
      </div>
    </div>
  );
};
export default CategoryFormComp;
