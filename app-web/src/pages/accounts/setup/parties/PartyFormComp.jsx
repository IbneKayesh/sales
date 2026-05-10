import { InputText } from "primereact/inputtext";
import RequiredText from "@/components/RequiredText";
import { Dropdown } from "primereact/dropdown";
import AuditFields from "@/components/AuditFields";

const PartyFormComp = ({
  formData,
  errors,
  onChange,
  party_ptype_Options,
  party_vndor_Options,
  party_chtac_Options,
}) => {
  return (
    <div className="grid">
      {/* {JSON.stringify(party_chtac_Options)} */}
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Type</label>
        <Dropdown
          name="party_ptype"
          value={formData.party_ptype}
          onChange={(e) => onChange("party_ptype", e.value)}
          options={party_ptype_Options}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.party_ptype ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter type`}
          filter
          showClear
        />
        <RequiredText text={errors.party_ptype} />
      </div>
      <div className="col-12 md:col-5">
        <label className="block font-bold mb-2 text-red-800">Vendor</label>
        <Dropdown
          name="party_vndor"
          value={formData.party_vndor}
          onChange={(e) => onChange("party_vndor", e.value)}
          options={party_vndor_Options}
          optionLabel="label_text"
          optionValue="value_text"
          className={`w-full ${errors.party_vndor ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter vendor`}
          filter
          showClear
        />
        <RequiredText text={errors.party_vndor} />
      </div>
      <div className="col-12 md:col-5">
        <label className="block font-bold mb-2 text-red-800">
          Account Name
        </label>
        <InputText
          name="party_pname"
          value={formData.party_pname}
          onChange={(e) => onChange("party_pname", e.target.value)}
          className={`w-full ${errors.party_pname ? "p-invalid" : ""}`}
          placeholder={`Enter account name`}
        />
        <RequiredText text={errors.party_pname} />
      </div>
      <div className="col-12 md:col-9">
        <label className="block font-bold mb-2 text-red-800">COA</label>
        <Dropdown
          name="party_chtac"
          value={formData.party_chtac}
          onChange={(e) => onChange("party_chtac", e.value)}
          options={party_chtac_Options}
          optionLabel="chtac_cname"
          optionValue="id"
          className={`w-full ${errors.party_chtac ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter coa`}
          filter
          showClear
        />
        <RequiredText text={errors.party_chtac} />
      </div>
      <div className="col-12 md:col-3">
        <label className="block font-bold mb-2 text-red-800">
          Opening Balance
        </label>
        <InputText
          name="party_opbal"
          value={formData.party_opbal}
          onChange={(e) => onChange("party_opbal", e.target.value)}
          className={`w-full ${errors.party_opbal ? "p-invalid" : ""}`}
          placeholder={`Enter opening balance`}
        />
        <RequiredText text={errors.party_opbal} />
      </div>

      {formData.id && (
        <AuditFields
          active={formData.party_actve}
          createdBy={formData.crusr_cname}
          createdAt={formData.party_crdat}
          updatedBy={formData.upusr_cname}
          updatedAt={formData.party_updat}
          revNo={formData.party_rvnmr}
        />
      )}
    </div>
  );
};
export default PartyFormComp;