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
  party_chtrc_Options,
  party_chtpy_Options,
  party_chtad_Options,
}) => {
  return (
    <div className="grid">
      {/* {JSON.stringify(party_chtrc_Options)} */}
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
      <div className="col-12 md:col-3">
        <label className="block font-bold mb-2 text-red-800">Vendor</label>
        <Dropdown
          name="party_vndor"
          value={formData.party_vndor}
          onChange={(e) => onChange("party_vndor", e.value)}
          options={party_vndor_Options}
          optionLabel="cntct_cntnm"
          optionValue="id"
          className={`w-full ${errors.party_vndor ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter vendor`}
          filter
          showClear
        />
        <RequiredText text={errors.party_vndor} />
      </div>
      <div className="col-12 md:col-7">
        <label className="block font-bold mb-2 text-red-800">
          Account Name
        </label>
        <InputText
          name="party_pname"
          value={formData.party_pname}
          onChange={(e) => onChange("party_pname", e.target.value)}
          className={`w-full ${errors.party_pname ? "p-invalid" : ""}`}
          placeholder={`Enter account name`}
          disabled={true}
        />
        <RequiredText text={errors.party_pname} />
      </div>
      <div className="col-12 md:col-3">
        <label className="block font-bold mb-2 text-red-800">Receivable</label>
        <Dropdown
          name="party_chtrc"
          value={formData.party_chtrc}
          onChange={(e) => onChange("party_chtrc", e.value)}
          options={party_chtrc_Options}
          optionLabel="chtac_cname"
          optionValue="id"
          className={`w-full ${errors.party_chtrc ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter receivable`}
          filter
          showClear
        />
        <RequiredText text={errors.party_chtrc} />
      </div>
      <div className="col-12 md:col-3">
        <label className="block font-bold mb-2 text-red-800">Payable</label>
        <Dropdown
          name="party_chtpy"
          value={formData.party_chtpy}
          onChange={(e) => onChange("party_chtpy", e.value)}
          options={party_chtpy_Options}
          optionLabel="chtac_cname"
          optionValue="id"
          className={`w-full ${errors.party_chtpy ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter payable`}
          filter
          showClear
        />
        <RequiredText text={errors.party_chtpy} />
      </div>
      <div className="col-12 md:col-3">
        <label className="block font-bold mb-2 text-red-800">Advance</label>
        <Dropdown
          name="party_chtad"
          value={formData.party_chtad}
          onChange={(e) => onChange("party_chtad", e.value)}
          options={party_chtad_Options}
          optionLabel="chtac_cname"
          optionValue="id"
          className={`w-full ${errors.party_chtad ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter advance`}
          filter
          showClear
        />
        <RequiredText text={errors.party_chtad} />
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