import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import tmab_bsins from "@/models/auth/tmab_bsins.json";

const BusinessFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-3">
        <label
          htmlFor="bsins_bname"
          className="block text-900 font-medium mb-2"
        >
          {tmab_bsins.bsins_bname.label} <span className="text-red-500">*</span>
        </label>
        <InputText
          name="bsins_bname"
          value={formData.bsins_bname}
          onChange={(e) => onChange("bsins_bname", e.target.value)}
          className={`w-full ${errors.bsins_bname ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmab_bsins.bsins_bname.label}`}
        />
        {errors.bsins_bname && (
          <small className="mb-3 text-red-500">{errors.bsins_bname}</small>
        )}
      </div>
      <div className="col-12 md:col-6">
        <label
          htmlFor="bsins_addrs"
          className="block text-900 font-medium mb-2"
        >
          {tmab_bsins.bsins_addrs.label} <span className="text-red-500">*</span>
        </label>
        <InputText
          name="bsins_addrs"
          value={formData.bsins_addrs}
          onChange={(e) => onChange("bsins_addrs", e.target.value)}
          className={`w-full ${errors.bsins_addrs ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmab_bsins.bsins_addrs.label}`}
        />
        {errors.bsins_addrs && (
          <small className="mb-3 text-red-500">{errors.bsins_addrs}</small>
        )}
      </div>
      <div className="col-12 md:col-3">
        <label
          htmlFor="bsins_email"
          className="block text-900 font-medium mb-2"
        >
          {tmab_bsins.bsins_email.label} <span className="text-red-500">*</span>
        </label>
        <InputText
          name="bsins_email"
          value={formData.bsins_email}
          onChange={(e) => onChange("bsins_email", e.target.value)}
          className={`w-full ${errors.bsins_email ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmab_bsins.bsins_email.label}`}
        />
        {errors.bsins_email && (
          <small className="mb-3 text-red-500">{errors.bsins_email}</small>
        )}
      </div>
      <div className="col-12 md:col-3">
        <label
          htmlFor="bsins_cntct"
          className="block text-900 font-medium mb-2"
        >
          {tmab_bsins.bsins_cntct.label} <span className="text-red-500">*</span>
        </label>
        <InputText
          name="bsins_cntct"
          value={formData.bsins_cntct}
          onChange={(e) => onChange("bsins_cntct", e.target.value)}
          className={`w-full ${errors.bsins_cntct ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmab_bsins.bsins_cntct.label}`}
        />
        {errors.bsins_cntct && (
          <small className="mb-3 text-red-500">{errors.bsins_cntct}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="bsins_binno"
          className="block text-900 font-medium mb-2"
        >
          {tmab_bsins.bsins_binno.label}
        </label>
        <InputText
          name="bsins_binno"
          value={formData.bsins_binno}
          onChange={(e) => onChange("bsins_binno", e.target.value)}
          className={`w-full ${errors.bsins_binno ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmab_bsins.bsins_binno.label}`}
        />
        {errors.bsins_binno && (
          <small className="mb-3 text-red-500">{errors.bsins_binno}</small>
        )}
      </div>
      <div className="col-12 md:col-3">
        <label
          htmlFor="bsins_btags"
          className="block text-900 font-medium mb-2"
        >
          {tmab_bsins.bsins_btags.label} <span className="text-red-500">*</span>
        </label>
        <InputText
          name="bsins_btags"
          value={formData.bsins_btags}
          onChange={(e) => onChange("bsins_btags", e.target.value)}
          className={`w-full ${errors.bsins_btags ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmab_bsins.bsins_btags.label}`}
        />
        {errors.bsins_btags && (
          <small className="mb-3 text-red-500">{errors.bsins_btags}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="bsins_cntry"
          className="block text-900 font-medium mb-2"
        >
          {tmab_bsins.bsins_cntry.label} <span className="text-red-500">*</span>
        </label>
        <InputText
          name="bsins_cntry"
          value={formData.bsins_cntry}
          onChange={(e) => onChange("bsins_cntry", e.target.value)}
          className={`w-full ${errors.bsins_cntry ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmab_bsins.bsins_cntry.label}`}
        />
        {errors.bsins_cntry && (
          <small className="mb-3 text-red-500">{errors.bsins_cntry}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="bsins_stdat"
          className="block text-900 font-medium mb-2"
        >
          {tmab_bsins.bsins_stdat.label} <span className="text-red-500">*</span>
        </label>
        <Calendar
          name="bsins_stdat"
          value={
            formData.bsins_stdat
              ? typeof formData.bsins_stdat === "string" &&
                !formData.bsins_stdat.includes("T")
                ? new Date(formData.bsins_stdat + "T00:00:00")
                : new Date(formData.bsins_stdat)
              : null
          }
          onChange={(e) => onChange("bsins_stdat", e.target.value)}
          className={`w-full ${errors.bsins_stdat ? "p-invalid" : ""}`}
          dateFormat="yy-mm-dd"
          placeholder={`Select ${tmab_bsins.bsins_stdat.label}`}
        />
        {errors.bsins_stdat && (
          <small className="mb-3 text-red-500">{errors.bsins_stdat}</small>
        )}
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

export default BusinessFormComp;
