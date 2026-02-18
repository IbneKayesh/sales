import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import tmcb_dlvan from "@/models/crm/tmcb_dlvan.json";
import RequiredText from "@/components/RequiredText";

const DeliveryVanFormComp = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
}) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-4">
        <label
          htmlFor="dlvan_vname"
          className="block font-bold mb-2 text-red-800"
        >
          {tmcb_dlvan.dlvan_vname.label}
        </label>
        <InputText
          name="dlvan_vname"
          value={formData.dlvan_vname}
          onChange={(e) => onChange("dlvan_vname", e.target.value)}
          className={`w-full ${errors.dlvan_vname ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmcb_dlvan.dlvan_vname.label}`}
        />
        <RequiredText text={errors.dlvan_vname} />
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

export default DeliveryVanFormComp;
