import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import t_items from "@/models/inventory/t_items.json";
import { useUnits } from "@/hooks/inventory/useUnits";
import { useCategory } from "@/hooks/inventory/useCategory";

const ItemsFormComponent = ({ isBusy, errors, formData, onChange, onSave }) => {
  const { units } = useUnits();
  const { categories } = useCategory();

  return (
    <div className="p-1">
      <div className="grid">
        <div className="col-12 md:col-2">
          <label
            htmlFor="item_code"
            className="block text-900 font-medium mb-2"
          >
            {t_items.t_items.item_code.name}
          </label>
          <InputText
            name="item_code"
            value={formData.item_code}
            onChange={(e) => onChange("item_code", e.target.value)}
            className={`w-full ${errors.item_code ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_items.t_items.item_code.name}`}
          />
          {errors.item_code && (
            <small className="mb-3 text-red-500">{errors.item_code}</small>
          )}
        </div>
        <div className="col-12 md:col-4">
          <label
            htmlFor="item_name"
            className="block text-900 font-medium mb-2"
          >
            {t_items.t_items.item_name.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <InputText
            name="item_name"
            value={formData.item_name}
            onChange={(e) => onChange("item_name", e.target.value)}
            className={`w-full ${errors.item_name ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_items.t_items.item_name.name}`}
          />
          {errors.item_name && (
            <small className="mb-3 text-red-500">{errors.item_name}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="item_description"
            className="block text-900 font-medium mb-2"
          >
            {t_items.t_items.item_description.name}
          </label>
          <InputText
            name="item_description"
            value={formData.item_description}
            onChange={(e) => onChange("item_description", e.target.value)}
            className={`w-full ${errors.item_description ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_items.t_items.item_description.name}`}
          />
          {errors.item_description && (
            <small className="mb-3 text-red-500">
              {errors.item_description}
            </small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="category_id"
            className="block text-900 font-medium mb-2"
          >
            {t_items.t_items.category_id.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="category_id"
            value={formData.category_id}
            options={categories.map((category) => ({
              label: category.category_name,
              value: category.category_id,
            }))}
            onChange={(e) => onChange("category_id", e.value)}
            className={`w-full ${errors.category_id ? "p-invalid" : ""}`}
            placeholder={`Select ${t_items.t_items.category_id.name}`}
            optionLabel="label"
            optionValue="value"
          />
          {errors.category_id && (
            <small className="mb-3 text-red-500">{errors.category_id}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="small_unit_id"
            className="block text-900 font-medium mb-2"
          >
            {t_items.t_items.small_unit_id.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="small_unit_id"
            value={formData.small_unit_id}
            options={units.map((unit) => ({
              label: unit.unit_name,
              value: unit.unit_id,
            }))}
            onChange={(e) => onChange("small_unit_id", e.value)}
            className={`w-full ${errors.small_unit_id ? "p-invalid" : ""}`}
            placeholder={`Select ${t_items.t_items.small_unit_id.name}`}
            optionLabel="label"
            optionValue="value"
          />
          {errors.small_unit_id && (
            <small className="mb-3 text-red-500">{errors.small_unit_id}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="unit_difference_qty"
            className="block text-900 font-medium mb-2"
          >
            {t_items.t_items.unit_difference_qty.name}
          </label>
          <InputNumber
            name="unit_difference_qty"
            value={formData.unit_difference_qty}
            onValueChange={(e) => onChange("unit_difference_qty", e.value)}
            className={`w-full ${
              errors.unit_difference_qty ? "p-invalid" : ""
            }`}
            inputStyle={{ width: "100%" }}
            placeholder={`Enter ${t_items.t_items.unit_difference_qty.name}`}
          />
          {errors.unit_difference_qty && (
            <small className="mb-3 text-red-500">
              {errors.unit_difference_qty}
            </small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="big_unit_id"
            className="block text-900 font-medium mb-2"
          >
            {t_items.t_items.big_unit_id.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="big_unit_id"
            value={formData.big_unit_id}
            options={units.map((unit) => ({
              label: unit.unit_name,
              value: unit.unit_id,
            }))}
            onChange={(e) => onChange("big_unit_id", e.value)}
            className={`w-full ${errors.big_unit_id ? "p-invalid" : ""}`}
            placeholder={`Select ${t_items.t_items.big_unit_id.name}`}
            optionLabel="label"
            optionValue="value"
          />
          {errors.big_unit_id && (
            <small className="mb-3 text-red-500">{errors.big_unit_id}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="order_qty"
            className="block text-900 font-medium mb-2"
          >
            {t_items.t_items.order_qty.name}
          </label>
          <InputNumber
            name="order_qty"
            value={formData.order_qty}
            onValueChange={(e) => onChange("order_qty", e.value)}
            className={`w-full ${errors.order_qty ? "p-invalid" : ""}`}
            inputStyle={{ width: "100%" }}
            placeholder={`Enter ${t_items.t_items.order_qty.name}`}
            disabled
          />
          {errors.order_qty && (
            <small className="mb-3 text-red-500">{errors.order_qty}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="stock_qty"
            className="block text-900 font-medium mb-2"
          >
            {t_items.t_items.stock_qty.name}
          </label>
          <InputNumber
            name="stock_qty"
            value={formData.stock_qty}
            onValueChange={(e) => onChange("stock_qty", e.value)}
            className={`w-full ${errors.stock_qty ? "p-invalid" : ""}`}
            inputStyle={{ width: "100%" }}
            placeholder={`Enter ${t_items.t_items.stock_qty.name}`}
            disabled
          />
          {errors.stock_qty && (
            <small className="mb-3 text-red-500">{errors.stock_qty}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="purchase_rate"
            className="block text-900 font-medium mb-2"
          >
            {t_items.t_items.purchase_rate.name}
          </label>
          <InputNumber
            name="purchase_rate"
            value={formData.purchase_rate}
            onValueChange={(e) => onChange("purchase_rate", e.value)}
            mode="currency"
            currency="BDT"
            locale="en-US"
            className={`w-full ${errors.purchase_rate ? "p-invalid" : ""}`}
            inputStyle={{ width: "100%" }}
            placeholder={`Enter ${t_items.t_items.purchase_rate.name}`}
          />
          {errors.purchase_rate && (
            <small className="mb-3 text-red-500">{errors.purchase_rate}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="sales_rate"
            className="block text-900 font-medium mb-2"
          >
            {t_items.t_items.sales_rate.name}
          </label>
          <InputNumber
            name="sales_rate"
            value={formData.sales_rate}
            onValueChange={(e) => onChange("sales_rate", e.value)}
            mode="currency"
            currency="BDT"
            locale="en-US"
            className={`w-full ${errors.sales_rate ? "p-invalid" : ""}`}
            inputStyle={{ width: "100%" }}
            placeholder={`Enter ${t_items.t_items.sales_rate.name}`}
          />
          {errors.sales_rate && (
            <small className="mb-3 text-red-500">{errors.sales_rate}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="discount_percent"
            className="block text-900 font-medium mb-2"
          >
            {t_items.t_items.discount_percent.name}
          </label>
          <InputNumber
            name="discount_percent"
            value={formData.discount_percent}
            onValueChange={(e) => onChange("discount_percent", e.value)}
            suffix="%"
            min={0}
            max={100}
            className={`w-full ${errors.discount_percent ? "p-invalid" : ""}`}
            inputStyle={{ width: "100%" }}
            placeholder={`Enter ${t_items.t_items.discount_percent.name}`}
          />
          {errors.discount_percent && (
            <small className="mb-3 text-red-500">
              {errors.discount_percent}
            </small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="margin_rate"
            className="block text-900 font-medium mb-2"
          >
            {t_items.t_items.margin_rate.name}
          </label>
          <InputNumber
            name="margin_rate"
            value={formData.margin_rate}
            onValueChange={(e) => onChange("margin_rate", e.value)}
            mode="currency"
            currency="BDT"
            locale="en-US"
            className={`w-full ${errors.margin_rate ? "p-invalid" : ""}`}
            inputStyle={{ width: "100%" }}
            placeholder={`Enter ${t_items.t_items.margin_rate.name}`}
            disabled
          />
          {errors.margin_rate && (
            <small className="mb-3 text-red-500">{errors.margin_rate}</small>
          )}
        </div>
        <div className="col-12">
          <div className="flex flex-row-reverse flex-wrap">
            <Button
              type="button"
              onClick={(e) => onSave(e)}
              label={formData.item_id ? "Update" : "Save"}
              icon={isBusy ? "pi pi-spin pi-spinner" : "pi pi-check"}
              severity="success"
              size="small"
              loading={isBusy}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemsFormComponent;
