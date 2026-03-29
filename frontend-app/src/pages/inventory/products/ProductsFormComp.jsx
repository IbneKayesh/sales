import { ToggleButton } from "primereact/togglebutton";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import tmib_items from "@/models/inventory/tmib_items.json";
import { productTypeOptions, stockTypeOptions } from "@/utils/vtable";
import { useCategorySgd } from "@/hooks/inventory/useCategorySgd";
import { useUnitsSgd } from "@/hooks/inventory/useUnitsSgd";
import { useBrandsSgd } from "@/hooks/inventory/useBrandsSgd";
import { useBusinessSgd } from "@/hooks/setup/useBusinessSgd";
import BFormComp from "./BFormComp";
import { Chip } from "primereact/chip";
import { useEffect } from "react";
import RequiredText from "@/components/RequiredText";
import { InputSwitch } from "primereact/inputswitch";

const ProductsFormComp = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
  // BItem
  formDataBItem,
  onChangeBItem,
  onSaveBItem,
  onFetchBItemSelectShop,
}) => {
  const { dataList: unitOptions, handleGetAllActiveUnits } = useUnitsSgd();
  const { dataList: categoryOptions, handleGetAllActiveCategory } =
    useCategorySgd();
  const { dataList: brandOptions, handleGetAllActiveBrands } = useBrandsSgd();
  const { dataList: businessOptions, handleGetAllActiveBusiness } =
    useBusinessSgd();

  useEffect(() => {
    handleGetAllActiveUnits();
    handleGetAllActiveCategory();
    handleGetAllActiveBrands();
    handleGetAllActiveBusiness();
  }, []);

  const handleBItemSelectShop = (key, value) => {
    onChangeBItem(key, value);
    onFetchBItemSelectShop(formData.id, value);
  };

  return (
    <>
      <div className="grid">
        <div className="col-12 md:col-2">
          <label htmlFor="items_icode" className="block font-bold mb-2">
            {tmib_items.items_icode.label}
          </label>
          <InputText
            name="items_icode"
            value={formData.items_icode}
            onChange={(e) => onChange("items_icode", e.target.value)}
            className={`w-full ${errors.items_icode ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmib_items.items_icode.label}`}
          />
          <RequiredText text={errors.items_icode} />
        </div>
        <div className="col-12 md:col-2">
          <label htmlFor="items_bcode" className="block font-bold mb-2">
            {tmib_items.items_bcode.label}
          </label>
          <InputText
            name="items_bcode"
            value={formData.items_bcode}
            onChange={(e) => onChange("items_bcode", e.target.value)}
            className={`w-full ${errors.items_bcode ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmib_items.items_bcode.label}`}
          />
          <RequiredText text={errors.items_bcode} />
        </div>
        <div className="col-12 md:col-2">
          <label htmlFor="items_hscod" className="block font-bold mb-2">
            {tmib_items.items_hscod.label}
          </label>
          <InputText
            name="items_hscod"
            value={formData.items_hscod}
            onChange={(e) => onChange("items_hscod", e.target.value)}
            className={`w-full ${errors.items_hscod ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmib_items.items_hscod.label}`}
          />
          <RequiredText text={errors.items_hscod} />
        </div>
        <div className="col-12 md:col-4">
          <label
            htmlFor="items_iname"
            className="block font-bold mb-2 text-red-800"
          >
            {tmib_items.items_iname.label}
          </label>
          <InputText
            name="items_iname"
            value={formData.items_iname}
            onChange={(e) => onChange("items_iname", e.target.value)}
            className={`w-full ${errors.items_iname ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmib_items.items_iname.label}`}
          />
          <RequiredText text={errors.items_iname} />
        </div>
        <div className="col-12 md:col-2">
          <label htmlFor="items_idesc" className="block font-bold mb-2">
            {tmib_items.items_idesc.label}
          </label>
          <InputText
            name="items_idesc"
            value={formData.items_idesc}
            onChange={(e) => onChange("items_idesc", e.target.value)}
            className={`w-full ${errors.items_idesc ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmib_items.items_idesc.label}`}
          />
          <RequiredText text={errors.items_idesc} />
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="items_puofm"
            className="block font-bold mb-2 text-red-800"
          >
            {tmib_items.items_puofm.label}
          </label>
          <Dropdown
            name="items_puofm"
            value={formData.items_puofm}
            onChange={(e) => onChange("items_puofm", e.value)}
            options={unitOptions}
            optionLabel="iuofm_untnm"
            optionValue="id"
            className={`w-full ${errors.items_puofm ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmib_items.items_puofm.label}`}
            filter
            showClear
          />
          <RequiredText text={errors.items_puofm} />
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="items_dfqty"
            className="block font-bold mb-2 text-red-800"
          >
            {tmib_items.items_dfqty.label}
          </label>
          <InputText
            name="items_dfqty"
            value={formData.items_dfqty}
            onChange={(e) => onChange("items_dfqty", e.target.value)}
            className={`w-full ${errors.items_dfqty ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmib_items.items_dfqty.label}`}
          />
          {errors.items_dfqty && (
            <small className="mb-3 text-red-500">{errors.items_dfqty}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="items_suofm"
            className="block font-bold mb-2 text-red-800"
          >
            {tmib_items.items_suofm.label}
          </label>
          <Dropdown
            name="items_suofm"
            value={formData.items_suofm}
            onChange={(e) => onChange("items_suofm", e.value)}
            options={unitOptions}
            optionLabel="iuofm_untnm"
            optionValue="id"
            className={`w-full ${errors.items_suofm ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmib_items.items_suofm.label}`}
            filter
            showClear
          />
          <RequiredText text={errors.items_suofm} />
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="items_ctgry"
            className="block font-bold mb-2 text-red-800"
          >
            {tmib_items.items_ctgry.label}
          </label>
          <Dropdown
            name="items_ctgry"
            value={formData.items_ctgry}
            onChange={(e) => onChange("items_ctgry", e.value)}
            options={categoryOptions}
            optionLabel="ctgry_ctgnm"
            optionValue="id"
            className={`w-full ${errors.items_ctgry ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmib_items.items_ctgry.label}`}
            filter
            showClear
          />
          <RequiredText text={errors.items_ctgry} />
        </div>

        <div className="col-12 md:col-2">
          <label
            htmlFor="items_brand"
            className="block font-bold mb-2 text-red-800"
          >
            {tmib_items.items_brand.label}
          </label>
          <Dropdown
            name="items_brand"
            value={formData.items_brand}
            onChange={(e) => onChange("items_brand", e.value)}
            options={brandOptions}
            optionLabel="brand_brnam"
            optionValue="id"
            className={`w-full ${errors.items_brand ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmib_items.items_brand.label}`}
            filter
            showClear
          />
          <RequiredText text={errors.items_brand} />
        </div>

        <div className="col-12 md:col-2">
          <label
            htmlFor="items_itype"
            className="block font-bold mb-2 text-red-800"
          >
            {tmib_items.items_itype.label}
          </label>
          <Dropdown
            name="items_itype"
            value={formData.items_itype}
            onChange={(e) => onChange("items_itype", e.value)}
            options={productTypeOptions}
            optionLabel="label"
            optionValue="value"
            className={`w-full ${errors.items_itype ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmib_items.items_itype.label}`}
          />
          <RequiredText text={errors.items_itype} />
        </div>

        <div className="col-12 md:col-2">
          <label
            htmlFor="items_trcks"
            className="block font-bold mb-2 text-red-800"
          >
            {tmib_items.items_trcks.label}
          </label>
          <Dropdown
            name="items_trcks"
            value={formData.items_trcks}
            onChange={(e) => onChange("items_trcks", e.value)}
            options={stockTypeOptions}
            optionLabel="label"
            optionValue="value"
            className={`w-full ${errors.items_trcks ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmib_items.items_trcks.label}`}
          />
          <RequiredText text={errors.items_trcks} />
        </div>

        <div className="col-12 md:col-2">
          <label
            htmlFor="items_sdvat"
            className="block font-bold mb-2 text-red-800"
          >
            {tmib_items.items_sdvat.label}
          </label>
          <InputText
            name="items_sdvat"
            value={formData.items_sdvat}
            onChange={(e) => onChange("items_sdvat", e.target.value)}
            className={`w-full ${errors.items_sdvat ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmib_items.items_sdvat.label}`}
          />
          <RequiredText text={errors.items_sdvat} />
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="items_costp"
            className="block font-bold mb-2 text-red-800"
          >
            {tmib_items.items_costp.label}
          </label>
          <InputText
            name="items_costp"
            value={formData.items_costp}
            onChange={(e) => onChange("items_costp", e.target.value)}
            className={`w-full ${errors.items_costp ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmib_items.items_costp.label}`}
          />
          <RequiredText text={errors.items_costp} />
        </div>
        <div className="col-12 md:col-2">
          <label htmlFor="items_alpur" className="block font-bold mb-2">
            {tmib_items.items_alpur.label}
          </label>
          <InputSwitch
            name="items_alpur"
            checked={formData.items_alpur === true}
            onChange={(e) => onChange("items_alpur", e.value ? true : false)}
            className={`${errors.items_alpur ? "p-invalid" : ""}`}
          />
          <RequiredText text={errors.items_alpur} />
        </div>
        <div className="col-12 md:col-2">
          <label htmlFor="items_alsal" className="block font-bold mb-2">
            {tmib_items.items_alsal.label}
          </label>
          <InputSwitch
            name="items_alsal"
            checked={formData.items_alsal === true}
            onChange={(e) => onChange("items_alsal", e.value ? true : false)}
            className={`${errors.items_alsal ? "p-invalid" : ""}`}
          />
          <RequiredText text={errors.items_alsal} />
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
              disabled={formDataBItem.bitem_bsins}
            />
          </div>
        </div>
      </div>
      {formData.id && (
        <>
          <hr />
          {businessOptions.map((business) => (
            <Chip
              key={business.id}
              label={business.bsins_bname}
              icon="pi pi-home"
              className={
                formDataBItem.bitem_bsins === business.id
                  ? "bg-gray-800 text-white mr-2"
                  : "bg-gray-300 text-gray-600 mr-2"
              }
              value={business.bsins_bname}
              style={{ cursor: "pointer" }}
              onClick={() => handleBItemSelectShop("bitem_bsins", business.id)}
            />
          ))}

          <RequiredText text={errors.bitem_bsins} />

          <BFormComp
            isBusy={isBusy}
            errors={errors}
            formData={formDataBItem}
            onChange={onChangeBItem}
            onSave={onSaveBItem}
          />
        </>
      )}
    </>
  );
};

export default ProductsFormComp;
