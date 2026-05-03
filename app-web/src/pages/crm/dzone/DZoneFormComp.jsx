import { InputText } from "primereact/inputtext";
import RequiredText from "@/components/RequiredText";
import AuditFields from "@/components/AuditFields";

const DZoneFormComp = ({ formData, errors, onChange }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <label className="block font-bold mb-2 text-red-800">Country</label>
        <InputText
          name="dzone_cntry"
          value={formData.dzone_cntry}
          onChange={(e) => onChange("dzone_cntry", e.target.value)}
          className={`w-full ${errors.dzone_cntry ? "p-invalid" : ""}`}
          placeholder={`Enter country`}
        />
        <RequiredText text={errors.dzone_cntry} />
      </div>
      <div className="col-12 md:col-6">
        <label className="block font-bold mb-2 text-red-800">D/Zone Name</label>
        <InputText
          name="dzone_dname"
          value={formData.dzone_dname}
          onChange={(e) => onChange("dzone_dname", e.target.value)}
          className={`w-full ${errors.dzone_dname ? "p-invalid" : ""}`}
          placeholder={`Enter D/Zone name`}
        />
        <RequiredText text={errors.dzone_dname} />
      </div>

      {formData.id && (
        <AuditFields
          active={formData.dzone_actve}
          createdBy={formData.crusr_cname}
          createdAt={formData.dzone_crdat}
          updatedBy={formData.upusr_cname}
          updatedAt={formData.dzone_updat}
          revNo={formData.dzone_rvnmr}
        />
      )}
    </div>
  );
};
export default DZoneFormComp;
