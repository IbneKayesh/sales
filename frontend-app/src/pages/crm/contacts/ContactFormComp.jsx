import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import tmcb_cntcs from "@/models/crm/tmcb_cntcs.json";

const ContactFormComp = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
  cntct_ctypeOptions,
  cntct_sorceOptions,
  cntct_cntryOptions,
}) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-2">
        <label
          htmlFor="cntct_ctype"
          className="block text-900 font-medium mb-2"
        >
          {tmcb_cntcs.cntct_ctype.label} <span className="text-red-500">*</span>
        </label>
        <Dropdown
          name="cntct_ctype"
          value={formData.cntct_ctype}
          options={cntct_ctypeOptions}
          onChange={(e) => onChange("cntct_ctype", e.value)}
          className={`w-full ${errors.cntct_ctype ? "p-invalid" : ""}`}
          placeholder={`Select ${tmcb_cntcs.cntct_ctype.label}`}
        />
        {errors.cntct_ctype && (
          <small className="mb-3 text-red-500">{errors.cntct_ctype}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="cntct_sorce"
          className="block text-900 font-medium mb-2"
        >
          {tmcb_cntcs.cntct_sorce.label} <span className="text-red-500">*</span>
        </label>
        <Dropdown
          name="cntctcntct_sorce_ctype"
          value={formData.cntct_sorce}
          options={cntct_sorceOptions}
          onChange={(e) => onChange("cntct_sorce", e.value)}
          className={`w-full ${errors.cntct_sorce ? "p-invalid" : ""}`}
          placeholder={`Select ${tmcb_cntcs.cntct_sorce.label}`}
        />
        {errors.cntct_sorce && (
          <small className="mb-3 text-red-500">{errors.cntct_sorce}</small>
        )}
      </div>
      <div className="col-12 md:col-8">
        <label
          htmlFor="cntct_cntnm"
          className="block text-900 font-medium mb-2"
        >
          {tmcb_cntcs.cntct_cntnm.label}{" "}
          <span className="text-red-500">*</span>
        </label>
        <InputText
          name="cntct_cntnm"
          value={formData.cntct_cntnm}
          onChange={(e) => onChange("cntct_cntnm", e.target.value)}
          className={`w-full ${errors.cntct_cntnm ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmcb_cntcs.cntct_cntnm.label}`}
        />
        {errors.cntct_cntnm && (
          <small className="mb-3 text-red-500">{errors.cntct_cntnm}</small>
        )}
      </div>


      <div className="col-12 md:col-3">
        <label
          htmlFor="cntct_cntps"
          className="block text-900 font-medium mb-2"
        >
          {tmcb_cntcs.cntct_cntps.label}
        </label>
        <InputText
          name="cntct_cntps"
          value={formData.cntct_cntps}
          onChange={(e) => onChange("cntct_cntps", e.target.value)}
          className={`w-full ${errors.cntct_cntps ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmcb_cntcs.cntct_cntps.label}`}
        />
        {errors.cntct_cntps && (
          <small className="mb-3 text-red-500">{errors.cntct_cntps}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="cntct_cntno"
          className="block text-900 font-medium mb-2"
        >
          {tmcb_cntcs.cntct_cntno.label}
        </label>
        <InputText
          name="cntct_cntno"
          value={formData.cntct_cntno}
          onChange={(e) => onChange("cntct_cntno", e.target.value)}
          className={`w-full ${errors.cntct_cntno ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmcb_cntcs.cntct_cntno.label}`}
        />
        {errors.cntct_cntno && (
          <small className="mb-3 text-red-500">{errors.cntct_cntno}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="cntct_email"
          className="block text-900 font-medium mb-2"
        >
          {tmcb_cntcs.cntct_email.label}
        </label>
        <InputText
          name="cntct_email"
          value={formData.cntct_email}
          onChange={(e) => onChange("cntct_email", e.target.value)}
          className={`w-full ${errors.cntct_email ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmcb_cntcs.cntct_email.label}`}
        />
        {errors.cntct_email && (
          <small className="mb-3 text-red-500">{errors.cntct_email}</small>
        )}
      </div>
      <div className="col-12 md:col-5">
        <label
          htmlFor="cntct_ofadr"
          className="block text-900 font-medium mb-2"
        >
          {tmcb_cntcs.cntct_ofadr.label}
        </label>
        <InputText
          name="cntct_ofadr"
          value={formData.cntct_ofadr}
          onChange={(e) => onChange("cntct_ofadr", e.target.value)}
          className={`w-full ${errors.cntct_ofadr ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmcb_cntcs.cntct_ofadr.label}`}
        />
        {errors.cntct_ofadr && (
          <small className="mb-3 text-red-500">{errors.cntct_ofadr}</small>
        )}
      </div>      
      <div className="col-12 md:col-8">
        <label
          htmlFor="cntct_fcadr"
          className="block text-900 font-medium mb-2"
        >
          {tmcb_cntcs.cntct_fcadr.label}
        </label>
        <InputText
          name="cntct_fcadr"
          value={formData.cntct_fcadr}
          onChange={(e) => onChange("cntct_fcadr", e.target.value)}
          className={`w-full ${errors.cntct_fcadr ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmcb_cntcs.cntct_fcadr.label}`}
        />
        {errors.cntct_fcadr && (
          <small className="mb-3 text-red-500">{errors.cntct_fcadr}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="cntct_cntry"
          className="block text-900 font-medium mb-2"
        >
          {tmcb_cntcs.cntct_cntry.label} <span className="text-red-500">*</span>
        </label>
        <Dropdown
          name="cntct_cntry"
          value={formData.cntct_cntry}
          options={cntct_cntryOptions}
          onChange={(e) => onChange("cntct_cntry", e.value)}
          className={`w-full ${errors.cntct_cntry ? "p-invalid" : ""}`}
          placeholder={`Select ${tmcb_cntcs.cntct_cntry.label}`}
        />
        {errors.cntct_cntry && (
          <small className="mb-3 text-red-500">{errors.cntct_cntry}</small>
        )}
      </div>


      <div className="col-12 md:col-2">
        <label
          htmlFor="cntct_crlmt"
          className="block text-900 font-medium mb-2"
        >
          {tmcb_cntcs.cntct_crlmt.label}{" "}
          <span className="text-red-500">*</span>
        </label>

        <InputNumber
          name="cntct_crlmt"
          value={formData.cntct_crlmt}
          onChange={(e) => onChange("cntct_crlmt", e.value)}
          className={`flex-1 ${errors.cntct_crlmt ? "p-invalid" : ""}`}
          placeholder="Credit Limit"
          style={{ width: "100%" }}
          inputStyle={{ width: "100%" }}
          minFractionDigits={2}
          maxFractionDigits={2}
        />
      </div>

      <div className="col-12">
        <div className="flex flex-row-reverse flex-wrap">
          <Button
            type="button"
            onClick={(e) => onSave(e)}
            label={formData.id ? "Update" : "Save"}
            icon={isBusy ? "pi pi-spin pi-spinner" : "pi pi-check"}
            severity="success"
            size="small"
            loading={isBusy}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactFormComp;
