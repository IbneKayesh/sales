import { ToggleButton } from "primereact/togglebutton";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import tmib_bitem from "@/models/inventory/tmib_bitem.json";

const BFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  return (
    <div className="grid mt-2 shadow-2">
      <div className="col-12 md:col-2">
        <label
          htmlFor="bitem_lprat"
          className="block text-900 font-medium mb-2"
        >
          {tmib_bitem.bitem_lprat.label}
        </label>
        <InputText
          name="bitem_lprat"
          value={formData.bitem_lprat}
          onChange={(e) => onChange("bitem_lprat", e.target.value)}
          className={`w-full ${errors.bitem_lprat ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmib_bitem.bitem_lprat.label}`}
        />
        {errors.bitem_lprat && (
          <small className="mb-3 text-red-500">{errors.bitem_lprat}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="bitem_dprat"
          className="block text-900 font-medium mb-2"
        >
          {tmib_bitem.bitem_dprat.label}
        </label>
        <InputText
          name="bitem_dprat"
          value={formData.bitem_dprat}
          onChange={(e) => onChange("bitem_dprat", e.target.value)}
          className={`w-full ${errors.bitem_dprat ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmib_bitem.bitem_dprat.label}`}
        />
        {errors.bitem_dprat && (
          <small className="mb-3 text-red-500">{errors.bitem_dprat}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="bitem_mcmrp"
          className="block text-900 font-medium mb-2"
        >
          {tmib_bitem.bitem_mcmrp.label}
        </label>
        <InputText
          name="bitem_mcmrp"
          value={formData.bitem_mcmrp}
          onChange={(e) => onChange("bitem_mcmrp", e.target.value)}
          className={`w-full ${errors.bitem_mcmrp ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmib_bitem.bitem_mcmrp.label}`}
        />
        {errors.bitem_mcmrp && (
          <small className="mb-3 text-red-500">{errors.bitem_mcmrp}</small>
        )}
      </div>

      <div className="col-12 md:col-2">
        <label
          htmlFor="bitem_sddsp"
          className="block text-900 font-medium mb-2"
        >
          {tmib_bitem.bitem_sddsp.label}
        </label>
        <InputText
          name="bitem_sddsp"
          value={formData.bitem_sddsp}
          onChange={(e) => onChange("bitem_sddsp", e.target.value)}
          className={`w-full ${errors.bitem_sddsp ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmib_bitem.bitem_sddsp.label}`}
        />
        {errors.bitem_sddsp && (
          <small className="mb-3 text-red-500">{errors.bitem_sddsp}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="bitem_snote"
          className="block text-900 font-medium mb-2"
        >
          {tmib_bitem.bitem_snote.label}
        </label>
        <InputText
          name="bitem_snote"
          value={formData.bitem_snote}
          onChange={(e) => onChange("bitem_snote", e.target.value)}
          className={`w-full ${errors.bitem_snote ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmib_bitem.bitem_snote.label}`}
        />
        {errors.bitem_snote && (
          <small className="mb-3 text-red-500">{errors.bitem_snote}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="bitem_gstkq"
          className="block text-900 font-medium mb-2"
        >
          {tmib_bitem.bitem_gstkq.label}
        </label>
        <InputText
          name="bitem_gstkq"
          value={formData.bitem_gstkq}
          onChange={(e) => onChange("bitem_gstkq", e.target.value)}
          className={`w-full ${errors.bitem_gstkq ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmib_bitem.bitem_gstkq.label}`}
          disabled
          variant="filled"
        />
        {errors.bitem_gstkq && (
          <small className="mb-3 text-red-500">{errors.bitem_gstkq}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="bitem_bstkq"
          className="block text-900 font-medium mb-2"
        >
          {tmib_bitem.bitem_bstkq.label}
        </label>
        <InputText
          name="bitem_bstkq"
          value={formData.bitem_bstkq}
          onChange={(e) => onChange("bitem_bstkq", e.target.value)}
          className={`w-full ${errors.bitem_bstkq ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmib_bitem.bitem_bstkq.label}`}
          disabled
          variant="filled"
        />
        {errors.bitem_bstkq && (
          <small className="mb-3 text-red-500">{errors.bitem_bstkq}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="bitem_mnqty"
          className="block text-900 font-medium mb-2"
        >
          {tmib_bitem.bitem_mnqty.label}
        </label>
        <InputText
          name="bitem_mnqty"
          value={formData.bitem_mnqty}
          onChange={(e) => onChange("bitem_mnqty", e.target.value)}
          className={`w-full ${errors.bitem_mnqty ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmib_bitem.bitem_mnqty.label}`}
        />
        {errors.bitem_mnqty && (
          <small className="mb-3 text-red-500">{errors.bitem_mnqty}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="bitem_mxqty"
          className="block text-900 font-medium mb-2"
        >
          {tmib_bitem.bitem_mxqty.label}
        </label>
        <InputText
          name="bitem_mxqty"
          value={formData.bitem_mxqty}
          onChange={(e) => onChange("bitem_mxqty", e.target.value)}
          className={`w-full ${errors.bitem_mxqty ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmib_bitem.bitem_mxqty.label}`}
        />
        {errors.bitem_mxqty && (
          <small className="mb-3 text-red-500">{errors.bitem_mxqty}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="bitem_pbqty"
          className="block text-900 font-medium mb-2"
        >
          {tmib_bitem.bitem_pbqty.label}
        </label>
        <InputText
          name="bitem_pbqty"
          value={formData.bitem_pbqty}
          onChange={(e) => onChange("bitem_pbqty", e.target.value)}
          className={`w-full ${errors.bitem_pbqty ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmib_bitem.bitem_pbqty.label}`}
          disabled
          variant="filled"
        />
        {errors.bitem_pbqty && (
          <small className="mb-3 text-red-500">{errors.bitem_pbqty}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="bitem_sbqty"
          className="block text-900 font-medium mb-2"
        >
          {tmib_bitem.bitem_sbqty.label}
        </label>
        <InputText
          name="bitem_sbqty"
          value={formData.bitem_sbqty}
          onChange={(e) => onChange("bitem_sbqty", e.target.value)}
          className={`w-full ${errors.bitem_sbqty ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmib_bitem.bitem_sbqty.label}`}
          disabled
          variant="filled"
        />
        {errors.bitem_sbqty && (
          <small className="mb-3 text-red-500">{errors.bitem_sbqty}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="bitem_mpric"
          className="block text-900 font-medium mb-2"
        >
          {tmib_bitem.bitem_mpric.label}
        </label>
        <InputText
          name="bitem_mpric"
          value={formData.bitem_mpric}
          onChange={(e) => onChange("bitem_mpric", e.target.value)}
          className={`w-full ${errors.bitem_mpric ? "p-invalid" : ""} ${
            formData.bitem_mpric < 0 ? "bg-red-200" : "bg-green-200"
          }`}
          placeholder={`Enter ${tmib_bitem.bitem_mpric.label}`}
          disabled
          variant="filled"
        />
        {errors.bitem_mpric && (
          <small className="mb-3 text-red-500">{errors.bitem_mpric}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="bitem_actve"
          className="block text-900 font-medium mb-2"
        >
          {tmib_bitem.bitem_actve.label} <span className="text-red-500">*</span>
        </label>
        <ToggleButton
          onLabel="Active"
          offLabel="Inactive"
          onIcon="pi pi-check"
          offIcon="pi pi-times"
          checked={formData.bitem_actve}
          onChange={(e) => onChange("bitem_actve", e.value)}
          size="small"
          className={
            formData.bitem_actve
              ? "bg-green-500 border-green-500 text-white"
              : "bg-red-500 border-red-500 text-white"
          }
        />
        {errors.bitem_actve && (
          <small className="mb-3 text-red-500">{errors.bitem_actve}</small>
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

export default BFormComp;
