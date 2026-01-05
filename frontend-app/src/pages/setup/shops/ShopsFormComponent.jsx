import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import t_shops from "@/models/setup/t_shops.json";

const ShopsFormComponent = ({ isBusy, errors, formData, onChange, onSave }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-3">
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
      <div className="col-12 md:col-5">
        <label
          htmlFor="shop_address"
          className="block text-900 font-medium mb-2"
        >
          {t_shops.shop_address.name} <span className="text-red-500">*</span>
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
      <div className="col-12 md:col-2">
        <label htmlFor="bin_no" className="block text-900 font-medium mb-2">
          {t_shops.bin_no.name}
        </label>
        <InputText
          name="bin_no"
          value={formData.bin_no}
          onChange={(e) => onChange("bin_no", e.target.value)}
          className={`w-full ${errors.bin_no ? "p-invalid" : ""}`}
          placeholder={`Enter ${t_shops.bin_no.name}`}
        />
        {errors.bin_no && (
          <small className="mb-3 text-red-500">{errors.bin_no}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="open_date" className="block text-900 font-medium mb-2">
          {t_shops.open_date.name}
        </label>
        <Calendar
          name="open_date"
          value={
            formData.open_date
              ? typeof formData.open_date === "string" &&
                !formData.open_date.includes("T")
                ? new Date(formData.open_date + "T00:00:00")
                : new Date(formData.open_date)
              : null
          }
          onChange={(e) => onChange("open_date", e.target.value)}
          className={`w-full ${errors.open_date ? "p-invalid" : ""}`}
          dateFormat="yy-mm-dd"
          placeholder={`Select ${t_shops.open_date.name}`}
        />
        {errors.open_date && (
          <small className="mb-3 text-red-500">{errors.open_date}</small>
        )}
      </div>
      <div className="col-12">
        <div className="flex flex-row-reverse flex-wrap">
          <Button
            type="button"
            onClick={(e) => onSave(e)}
            label={formData.shop_id ? "Update" : "Save"}
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
