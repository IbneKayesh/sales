import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import t_categories from "@/models/inventory/t_categories.json";

const CategoryFormComponent = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
}) => {
  return (
    <div className="grid">
      <div className="col-12">
        <label
          htmlFor="category_name"
          className="block text-900 font-medium mb-2"
        >
          {t_categories.category_name.name}{" "}
          <span className="text-red-500">*</span>
        </label>
        <InputText
          name="category_name"
          value={formData.category_name}
          onChange={(e) => onChange("category_name", e.target.value)}
          className={`w-full ${errors.category_name ? "p-invalid" : ""}`}
          placeholder={`Enter ${t_categories.category_name.name}`}
        />
        {errors.category_name && (
          <small className="mb-3 text-red-500">{errors.category_name}</small>
        )}
      </div>
      <div className="col-12">
        <div className="flex flex-row-reverse flex-wrap">
          <Button
            type="button"
            onClick={(e) => onSave(e)}
            label={formData.category_id ? "Update" : "Save"}
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

export default CategoryFormComponent;
