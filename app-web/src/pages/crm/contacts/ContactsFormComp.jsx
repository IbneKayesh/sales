import { InputText } from "primereact/inputtext";
import RequiredText from "@/components/RequiredText";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";

const ContactsFormComp = ({
  formData,
  errors,
  onChange,
  cntct_ctype_options,
  cntct_sorce_options,
  cntct_crncy_options,
}) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Name</label>
        <InputText
          name="cntct_cntnm"
          value={formData.cntct_cntnm}
          onChange={(e) => onChange("cntct_cntnm", e.target.value)}
          className={`w-full ${errors.cntct_cntnm ? "p-invalid" : ""}`}
          placeholder={`Enter name`}
        />
        <RequiredText text={errors.cntct_cntnm} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Person Name</label>
        <InputText
          name="cntct_cntps"
          value={formData.cntct_cntps}
          onChange={(e) => onChange("cntct_cntps", e.target.value)}
          className={`w-full ${errors.cntct_cntps ? "p-invalid" : ""}`}
          placeholder={`Enter person name`}
        />
        <RequiredText text={errors.cntct_cntps} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Contact No</label>
        <InputText
          name="cntct_cntno"
          value={formData.cntct_cntno}
          onChange={(e) => onChange("cntct_cntno", e.target.value)}
          className={`w-full ${errors.cntct_cntno ? "p-invalid" : ""}`}
          placeholder={`Enter contact no`}
        />
        <RequiredText text={errors.cntct_cntno} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Email</label>
        <InputText
          name="cntct_email"
          value={formData.cntct_email}
          onChange={(e) => onChange("cntct_email", e.target.value)}
          className={`w-full ${errors.cntct_email ? "p-invalid" : ""}`}
          placeholder={`Enter Email`}
        />
        <RequiredText text={errors.cntct_email} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">TIN</label>
        <InputText
          name="cntct_tinno"
          value={formData.cntct_tinno}
          onChange={(e) => onChange("cntct_tinno", e.target.value)}
          className={`w-full ${errors.cntct_tinno ? "p-invalid" : ""}`}
          placeholder={`Enter TIN`}
        />
        <RequiredText text={errors.cntct_tinno} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Trade</label>
        <InputText
          name="cntct_trade"
          value={formData.cntct_trade}
          onChange={(e) => onChange("cntct_trade", e.target.value)}
          className={`w-full ${errors.cntct_trade ? "p-invalid" : ""}`}
          placeholder={`Enter Trade`}
        />
        <RequiredText text={errors.cntct_trade} />
      </div>
      <div className="col-12 md:col-6">
        <label className="block font-bold mb-2 text-red-800">
          Office Address
        </label>
        <InputTextarea
          name="cntct_ofadr"
          value={formData.cntct_ofadr}
          onChange={(e) => onChange("cntct_ofadr", e.target.value)}
          rows={5}
          cols={30}
          className={`w-full ${errors.cntct_ofadr ? "p-invalid" : ""}`}
          placeholder={`Enter office address`}
        />
        <RequiredText text={errors.cntct_ofadr} />
      </div>
      <div className="col-12 md:col-6">
        <label className="block font-bold mb-2 text-red-800">
          Factory Address
        </label>
        <InputTextarea
          name="cntct_fcadr"
          value={formData.cntct_fcadr}
          onChange={(e) => onChange("cntct_fcadr", e.target.value)}
          rows={5}
          cols={30}
          className={`w-full ${errors.cntct_fcadr ? "p-invalid" : ""}`}
          placeholder={`Enter factory address`}
        />
        <RequiredText text={errors.cntct_fcadr} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Type</label>
        <Dropdown
          name="cntct_ctype"
          value={formData.cntct_ctype}
          onChange={(e) => onChange("cntct_ctype", e.value)}
          options={cntct_ctype_options}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.cntct_ctype ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter type`}
          filter
          showClear
        />
        <RequiredText text={errors.cntct_ctype} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Type</label>
        <Dropdown
          name="cntct_sorce"
          value={formData.cntct_sorce}
          onChange={(e) => onChange("cntct_sorce", e.value)}
          options={cntct_sorce_options}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.cntct_sorce ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter source`}
          filter
          showClear
        />
        <RequiredText text={errors.cntct_sorce} />
      </div>

      <div className="col-12 md:col-12">
        read only field cntct_crbal - balance
      </div>

      <div className="col-12 md:col-12">
        another read only field row cntct_actve - active cntct_crusr - created
        by cntct_crdat - created date cntct_upusr - updated by cntct_updat -
        updated date cntct_rvnmr - revision no
      </div>
    </div>
  );
};
export default ContactsFormComp;
