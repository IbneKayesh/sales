import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import tmib_brand from "@/models/inventory/tmib_brand.json";
import RequiredText from "@/components/RequiredText";

const BrandFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <label
          htmlFor="brand_brnam"
          className="block font-bold mb-2 text-red-800"
        >
          {tmib_brand.brand_brnam.label}
        </label>
        <InputText
          name="brand_brnam"
          value={formData.brand_brnam}
          onChange={(e) => onChange("brand_brnam", e.target.value)}
          className={`w-full ${errors.brand_brnam ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmib_brand.brand_brnam.label}`}
        />
        <RequiredText text={errors.brand_brnam} />
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

export default BrandFormComp;
