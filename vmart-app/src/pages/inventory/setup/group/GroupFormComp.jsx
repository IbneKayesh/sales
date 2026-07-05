import { InputText } from "primereact/inputtext";
import RequiredText from "@/components/RequiredText";
import AuditFields from "@/components/AuditFields";

const GroupFormComp = ({ formData, errors, onChange }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <label className="block font-bold mb-2 text-red-800">Group Name</label>
        <InputText
          name="mgrup_mname"
          value={formData.mgrup_mname}
          onChange={(e) => onChange("mgrup_mname", e.target.value)}
          className={`w-full ${errors.mgrup_mname ? "p-invalid" : ""}`}
          placeholder={`Enter group name`}
        />
        <RequiredText text={errors.mgrup_mname} />
      </div>

      {formData.id && (
        <AuditFields
          active={formData.mgrup_actve}
          createdBy={formData.crusr_cname}
          createdAt={formData.mgrup_crdat}
          updatedBy={formData.upusr_cname}
          updatedAt={formData.mgrup_updat}
          revNo={formData.mgrup_rvnmr}
        />
      )}
    </div>
  );
};
export default GroupFormComp;
