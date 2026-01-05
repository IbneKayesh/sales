import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import t_products from "@/models/inventory/t_products.json";
import { useUnits } from "@/hooks/inventory/useUnits";
import { useCategories } from "@/hooks/inventory/useCategories";
import { useShops } from "@/hooks/setup/useShops";

const ProductFormComponent = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
}) => {
  const { unitList } = useUnits();
  const { categoryList } = useCategories();
  const { shopList } = useShops();

  return (
    <div className="grid">
      <div className="col-12 md:col-2">
        <label
          htmlFor="product_code"
          className="block text-900 font-medium mb-2"
        >
          {t_products.product_code.name}
        </label>
        <InputText
          name="product_code"
          value={formData.product_code}
          onChange={(e) => onChange("product_code", e.target.value)}
          className={`w-full ${errors.product_code ? "p-invalid" : ""}`}
          placeholder={`Enter ${t_products.product_code.name}`}
        />
        {errors.product_code && (
          <small className="mb-3 text-red-500">{errors.product_code}</small>
        )}
      </div>
      <div className="col-12 md:col-6">
        <label
          htmlFor="product_name"
          className="block text-900 font-medium mb-2"
        >
          {t_products.product_name.name} <span className="text-red-500">*</span>
        </label>
        <InputText
          name="product_name"
          value={formData.product_name}
          onChange={(e) => onChange("product_name", e.target.value)}
          className={`w-full ${errors.product_name ? "p-invalid" : ""}`}
          placeholder={`Enter ${t_products.product_name.name}`}
        />
        {errors.product_name && (
          <small className="mb-3 text-red-500">{errors.product_name}</small>
        )}
      </div>
      <div className="col-12 md:col-4">
        <label
          htmlFor="product_desc"
          className="block text-900 font-medium mb-2"
        >
          {t_products.product_desc.name}
        </label>
        <InputText
          name="product_desc"
          value={formData.product_desc}
          onChange={(e) => onChange("product_desc", e.target.value)}
          className={`w-full ${errors.product_desc ? "p-invalid" : ""}`}
          placeholder={`Enter ${t_products.product_desc.name}`}
        />
        {errors.product_desc && (
          <small className="mb-3 text-red-500">{errors.product_desc}</small>
        )}
      </div>
      <div className="col-12 md:col-4">
        <label
          htmlFor="category_id"
          className="block text-900 font-medium mb-2"
        >
          {t_products.category_id.name} <span className="text-red-500">*</span>
        </label>
        <Dropdown
          name="category_id"
          value={formData.category_id}
          options={categoryList.map((category) => ({
            label: category.category_name,
            value: category.category_id,
          }))}
          onChange={(e) => onChange("category_id", e.value)}
          className={`w-full ${errors.category_id ? "p-invalid" : ""}`}
          placeholder={`Select ${t_products.category_id.name}`}
          optionLabel="label"
          optionValue="value"
          filter
          showClear
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
          {t_products.small_unit_id.name}{" "}
          <span className="text-red-500">*</span>
        </label>
        <Dropdown
          name="small_unit_id"
          value={formData.small_unit_id}
          options={unitList.map((unit) => ({
            label: unit.unit_name,
            value: unit.unit_id,
          }))}
          onChange={(e) => onChange("small_unit_id", e.value)}
          className={`w-full ${errors.small_unit_id ? "p-invalid" : ""}`}
          placeholder={`Select ${t_products.small_unit_id.name}`}
          optionLabel="label"
          optionValue="value"
          filter
          showClear
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
          {t_products.unit_difference_qty.name}
        </label>
        <InputNumber
          name="unit_difference_qty"
          value={formData.unit_difference_qty}
          onValueChange={(e) => onChange("unit_difference_qty", e.value)}
          className={`w-full ${errors.unit_difference_qty ? "p-invalid" : ""}`}
          inputStyle={{ width: "100%" }}
          placeholder={`Enter ${t_products.unit_difference_qty.name}`}
        />
        {errors.unit_difference_qty && (
          <small className="mb-3 text-red-500">
            {errors.unit_difference_qty}
          </small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="large_unit_id"
          className="block text-900 font-medium mb-2"
        >
          {t_products.large_unit_id.name}{" "}
          <span className="text-red-500">*</span>
        </label>
        <Dropdown
          name="large_unit_id"
          value={formData.large_unit_id}
          options={unitList.map((unit) => ({
            label: unit.unit_name,
            value: unit.unit_id,
          }))}
          onChange={(e) => onChange("large_unit_id", e.value)}
          className={`w-full ${errors.large_unit_id ? "p-invalid" : ""}`}
          placeholder={`Select ${t_products.large_unit_id.name}`}
          optionLabel="label"
          optionValue="value"
          filter
          showClear
        />
        {errors.large_unit_id && (
          <small className="mb-3 text-red-500">{errors.large_unit_id}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="purchase_price"
          className="block text-900 font-medium mb-2"
        >
          {t_products.purchase_price.name}
        </label>
        <InputNumber
          name="purchase_price"
          value={formData.purchase_price}
          onValueChange={(e) => onChange("purchase_price", e.value)}
          mode="currency"
          currency="BDT"
          locale="en-US"
          className={`w-full ${errors.purchase_price ? "p-invalid" : ""}`}
          inputStyle={{ width: "100%" }}
          placeholder={`Enter ${t_products.purchase_price.name}`}
        />
        {errors.purchase_price && (
          <small className="mb-3 text-red-500">{errors.purchase_price}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="sales_price"
          className="block text-900 font-medium mb-2"
        >
          {t_products.sales_price.name}
        </label>
        <InputNumber
          name="sales_price"
          value={formData.sales_price}
          onValueChange={(e) => onChange("sales_price", e.value)}
          mode="currency"
          currency="BDT"
          locale="en-US"
          className={`w-full ${errors.sales_price ? "p-invalid" : ""}`}
          inputStyle={{ width: "100%" }}
          placeholder={`Enter ${t_products.sales_price.name}`}
        />
        {errors.sales_price && (
          <small className="mb-3 text-red-500">{errors.sales_price}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="discount_percent"
          className="block text-900 font-medium mb-2"
        >
          {t_products.discount_percent.name}
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
          placeholder={`Enter ${t_products.discount_percent.name}`}
        />
        {errors.discount_percent && (
          <small className="mb-3 text-red-500">{errors.discount_percent}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="vat_percent"
          className="block text-900 font-medium mb-2"
        >
          {t_products.vat_percent.name}
        </label>
        <InputNumber
          name="vat_percent"
          value={formData.vat_percent}
          onValueChange={(e) => onChange("vat_percent", e.value)}
          suffix="%"
          min={0}
          max={100}
          className={`w-full ${errors.vat_percent ? "p-invalid" : ""}`}
          inputStyle={{ width: "100%" }}
          placeholder={`Enter ${t_products.vat_percent.name}`}
        />
        {errors.vat_percent && (
          <small className="mb-3 text-red-500">{errors.vat_percent}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="cost_price_percent"
          className="block text-900 font-medium mb-2"
        >
          {t_products.cost_price_percent.name}
        </label>
        <InputNumber
          name="cost_price_percent"
          value={formData.cost_price_percent}
          onValueChange={(e) => onChange("cost_price_percent", e.value)}
          suffix="%"
          min={0}
          max={100}
          className={`w-full ${errors.cost_price_percent ? "p-invalid" : ""}`}
          inputStyle={{ width: "100%" }}
          placeholder={`Enter ${t_products.cost_price_percent.name}`}
        />
        {errors.cost_price_percent && (
          <small className="mb-3 text-red-500">
            {errors.cost_price_percent}
          </small>
        )}
      </div>      
      <div className="col-12 md:col-4">
        <label
          htmlFor="shop_id"
          className="block text-900 font-medium mb-2"
        >
          {t_products.shop_id.name}{" "}
          <span className="text-red-500">*</span>
        </label>
        <Dropdown
          name="shop_id"
          value={formData.shop_id}
          options={shopList.map((shop) => ({
            label: shop.shop_name,
            value: shop.shop_id,
          }))}
          onChange={(e) => onChange("shop_id", e.value)}
          className={`w-full ${errors.shop_id ? "p-invalid" : ""}`}
          placeholder={`Select ${t_products.shop_id.name}`}
          optionLabel="label"
          optionValue="value"
          filter
          showClear
        />
        {errors.shop_id && (
          <small className="mb-3 text-red-500">{errors.shop_id}</small>
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
  );
};

export default ProductFormComponent;
