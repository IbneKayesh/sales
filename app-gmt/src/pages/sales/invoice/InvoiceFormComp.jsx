import { InputText } from "primereact/inputtext";
import RequiredText from "@/components/RequiredText";

const InvoiceFormComp = ({ formData, errors, onChange }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <label className="block font-bold mb-2 text-red-800">Role Name</label>
        <InputText
          name="role_name"
          value={formData.role_name}
          onChange={(e) => onChange("role_name", e.target.value)}
          className={`w-full ${errors.role_name ? "p-invalid" : ""}`}
          placeholder={`Enter role name`}
        />
        <RequiredText text={errors.role_name} />
      </div>
    </div>
  );
};
export default InvoiceFormComp;
