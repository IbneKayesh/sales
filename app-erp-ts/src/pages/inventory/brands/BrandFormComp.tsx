import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import tmib_brand from "@/models/inventory/tmib_brand.json";
import RequiredText from "@/components/RequiredText";
import type { Brand } from "@/models/inventory/tmib_brand";

interface BrandFormCompProps {
  isBusy: boolean;
  errors: Record<string, string>;
  formData: Brand;
  onChange: (field: string, value: any) => void;
  onSave: (e: React.FormEvent) => void;
}

const BrandFormComp: React.FC<BrandFormCompProps> = ({
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
          htmlFor="brand_brnam"
          className="block font-bold mb-2 text-red-800"
        >
          {(tmib_brand as any).brand_brnam.label}
        </label>
        <InputText
            id="brand_brnam"
          name="brand_brnam"
          value={formData.brand_brnam}
          onChange={(e) => onChange("brand_brnam", (e.target as HTMLInputElement).value)}
          className={`w-full ${errors.brand_brnam ? "p-invalid" : ""}`}
          placeholder={`Enter ${(tmib_brand as any).brand_brnam.label}`}
        />
        <RequiredText text={errors.brand_brnam} />
      </div>
      <div className="col-12">
        <div className="flex flex-row-reverse flex-wrap">
          <Button
            type="button"
            onClick={(e) => onSave(e)}
            label={formData.id ? "Update" : "Save"}
            icon={"pi pi-check"}
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
