import { Dropdown } from "primereact/dropdown";
import RequiredText from "@/components/RequiredText";

const ItemsComp = ({ formData, errors, onChange, price_items_Options }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <label className="block font-bold mb-2 text-red-800">Products</label>
        <Dropdown
          name="price_items"
          value={formData.price_items}
          onChange={(e) => onChange("price_items", e.value)}
          options={price_items_Options}
          optionLabel="items_iname"
          optionValue="id"
          className={`w-full ${errors.price_items ? "p-invalid" : ""}`}
          placeholder="Select item"
          filter
          showClear
          disabled={formData.id}
        />
        <RequiredText text={errors.price_items} />
      </div>
      <div className="col-12">

      </div>
    </div>
  );
};
export default ItemsComp;
