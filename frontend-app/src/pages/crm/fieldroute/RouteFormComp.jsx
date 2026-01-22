import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import tmcb_rutes from "@/models/crm/tmcb_rutes.json";

const RouteFormComp = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
}) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <label
          htmlFor="rutes_rname"
          className="block text-900 font-medium mb-2"
        >
          {tmcb_rutes.rutes_rname.label}
          <span className="text-red-500">*</span>
        </label>
        <InputText
          name="rutes_rname"
          value={formData.rutes_rname}
          onChange={(e) => onChange("rutes_rname", e.target.value)}
          className={`w-full ${errors.rutes_rname ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmcb_rutes.rutes_rname.label}`}
        />
        {errors.rutes_rname && (
          <small className="mb-3 text-red-500">{errors.rutes_rname}</small>
        )}
      </div>
      <div className="col-12 md:col-6">
        <label
          htmlFor="rutes_dname"
          className="block text-900 font-medium mb-2"
        >
          {tmcb_rutes.rutes_dname.label}
          <span className="text-red-500">*</span>
        </label>
        <InputText
          name="rutes_dname"
          value={formData.rutes_dname}
          onChange={(e) => onChange("rutes_dname", e.target.value)}
          className={`w-full ${errors.rutes_dname ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmcb_rutes.rutes_dname.label}`}
        />
        {errors.rutes_dname && (
          <small className="mb-3 text-red-500">{errors.rutes_dname}</small>
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

export default RouteFormComp;