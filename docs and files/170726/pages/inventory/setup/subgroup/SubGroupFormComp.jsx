import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import RequiredText from "@/components/RequiredText";
import AuditFields from "@/components/AuditFields";

const SubGroupFormComp = ({
  formData,
  errors,
  onChange,
  sgrup_mgrup_Options,
}) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <label className="block font-bold mb-2 text-red-800">
          Group Name
        </label>
        <Dropdown
          name="sgrup_mgrup"
          value={formData.sgrup_mgrup}
          onChange={(e) => onChange("sgrup_mgrup", e.value)}
          options={sgrup_mgrup_Options}
          optionLabel="mgrup_mname"
          optionValue="id"
          className={`w-full ${errors.sgrup_mgrup ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter group`}
          filter
          showClear
        />
        <RequiredText text={errors.sgrup_mgrup} />
      </div>
      <div className="col-12 md:col-6">
        <label className="block font-bold mb-2 text-red-800">
          Sub Group Name
        </label>
        <InputText
          name="sgrup_sname"
          value={formData.sgrup_sname}
          onChange={(e) => onChange("sgrup_sname", e.target.value)}
          className={`w-full ${errors.sgrup_sname ? "p-invalid" : ""}`}
          placeholder={`Enter sub group name`}
        />
        <RequiredText text={errors.sgrup_sname} />
      </div>

      {formData.id && (
        <AuditFields
          active={formData.sgrup_actve}
          createdBy={formData.crusr_cname}
          createdAt={formData.sgrup_crdat}
          updatedBy={formData.upusr_cname}
          updatedAt={formData.sgrup_updat}
          revNo={formData.sgrup_rvnmr}
        />
      )}
    </div>
  );
};
export default SubGroupFormComp;
