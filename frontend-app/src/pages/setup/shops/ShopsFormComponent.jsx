import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import t_shops from "@/models/setup/t_shops.json";

const ShopsFormComponent = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
}) => {
  return (
      <div className="grid">        
        <div className="col-12 md:col-5">
          <label htmlFor="shop_name" className="block text-900 font-medium mb-2">
            {t_shops.shop_name.name} <span className="text-red-500">*</span>
          </label>
          <InputText
            name="shop_name"
            value={formData.shop_name}
            onChange={(e) => onChange("shop_name", e.target.value)}
            className={`w-full ${errors.shop_name ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_shops.shop_name.name}`}
          />
          {errors.shop_name && (
            <small className="mb-3 text-red-500">{errors.shop_name}</small>
          )}
        </div>
        <div className="col-12 md:col-7">
          <label htmlFor="shop_address" className="block text-900 font-medium mb-2">
            {t_shops.shop_address.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <InputText
            name="shop_address"
            value={formData.shop_address}
            onChange={(e) => onChange("shop_address", e.target.value)}
            className={`w-full ${errors.shop_address ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_shops.shop_address.name}`}
          />
          {errors.shop_address && (
            <small className="mb-3 text-red-500">{errors.shop_address}</small>
          )}
        </div>
        <div className="col-12">
          <div className="flex flex-row-reverse flex-wrap">
            <Button
              type="button"
              onClick={(e) => onSave(e)}
              label={formData.user_id ? "Update" : "Save"}
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

export default ShopsFormComponent;