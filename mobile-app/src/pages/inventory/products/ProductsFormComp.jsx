import { ToggleButton } from "primereact/togglebutton";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import tmib_items from "@/models/inventory/tmib_items.json";
import { productTypeOptions } from "@/utils/vtable";
import { useCategory } from "@/hooks/inventory/useCategory";
import { useUnits } from "@/hooks/inventory/useUnits";
import { useBusiness } from "@/hooks/setup/useBusiness";
import BFormComp from "./BFormComp";
import { Chip } from "primereact/chip";

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
  onFetchBItem,
}) => {
  const { dataList: categoryOptions } = useCategory();
  const { dataList: unitOptions } = useUnits();
  const { dataList: businessOptions } = useBusiness();

  const handleBItemChange = (key, value) => {
    onChangeBItem(key, value);
    onFetchBItem(formData.id, value);
  };

  return (
    <>
      <div className="grid">
        <div className="col-12 md:col-2">
          <label
            htmlFor="items_icode"
            className="block text-900 font-medium mb-2"
          >
            {tmib_items.items_icode.label}
          </label>
          <InputText
            name="items_icode"
            value={formData.items_icode}
            onChange={(e) => onChange("items_icode", e.target.value)}
            className={`w-full ${errors.items_icode ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmib_items.items_icode.label}`}
          />
          {errors.items_icode && (
            <small className="mb-3 text-red-500">{errors.items_icode}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="items_bcode"
            className="block text-900 font-medium mb-2"
          >
            {tmib_items.items_bcode.label}
          </label>
          <InputText
            name="items_bcode"
            value={formData.items_bcode}
            onChange={(e) => onChange("items_bcode", e.target.value)}
            className={`w-full ${errors.items_bcode ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmib_items.items_bcode.label}`}
          />
          {errors.items_bcode && (
            <small className="mb-3 text-red-500">{errors.items_bcode}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="items_hscod"
            className="block text-900 font-medium mb-2"
          >
            {tmib_items.items_hscod.label}
          </label>
          <InputText
            name="items_hscod"
            value={formData.items_hscod}
            onChange={(e) => onChange("items_hscod", e.target.value)}
            className={`w-full ${errors.items_hscod ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmib_items.items_hscod.label}`}
          />
          {errors.items_hscod && (
            <small className="mb-3 text-red-500">{errors.items_hscod}</small>
          )}
        </div>
        <div className="col-12 md:col-4">
          <label
            htmlFor="items_iname"
            className="block text-900 font-medium mb-2 text-red-800"
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
          {errors.items_iname && (
            <small className="mb-3 text-red-500">{errors.items_iname}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="items_idesc"
            className="block text-900 font-medium mb-2"
          >
            {tmib_items.items_idesc.label}
          </label>
          <InputText
            name="items_idesc"
            value={formData.items_idesc}
            onChange={(e) => onChange("items_idesc", e.target.value)}
            className={`w-full ${errors.items_idesc ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmib_items.items_idesc.label}`}
          />
          {errors.items_idesc && (
            <small className="mb-3 text-red-500">{errors.items_idesc}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="items_puofm"
            className="block text-900 font-medium mb-2 text-red-800"
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

          {errors.items_puofm && (
            <small className="mb-3 text-red-500">{errors.items_puofm}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="items_dfqty"
            className="block text-900 font-medium mb-2 text-red-800"
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
            className="block text-900 font-medium mb-2 text-red-800"
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
          {errors.items_suofm && (
            <small className="mb-3 text-red-500">{errors.items_suofm}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="items_ctgry"
            className="block text-900 font-medium mb-2 text-red-800"
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
          {errors.items_ctgry && (
            <small className="mb-3 text-red-500">{errors.items_ctgry}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="items_itype"
            className="block text-900 font-medium mb-2 text-red-800"
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
          {errors.items_itype && (
            <small className="mb-3 text-red-500">{errors.items_itype}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="items_trcks"
            className="block text-900 font-medium mb-2 text-red-800"
          >
            {tmib_items.items_trcks.label}
          </label>
          <ToggleButton
            onLabel="Tracking"
            offLabel="No Tracking"
            onIcon="pi pi-check"
            offIcon="pi pi-times"
            checked={formData.items_trcks}
            onChange={(e) => onChange("items_trcks", e.value)}
            size="small"
          />
          {errors.items_trcks && (
            <small className="mb-3 text-red-500">{errors.items_trcks}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="items_sdvat"
            className="block text-900 font-medium mb-2 text-red-800"
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
          {errors.items_sdvat && (
            <small className="mb-3 text-red-500">{errors.items_sdvat}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="items_costp"
            className="block text-900 font-medium mb-2 text-red-800"
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
          {errors.items_costp && (
            <small className="mb-3 text-red-500">{errors.items_costp}</small>
          )}
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
              onClick={() => handleBItemChange("bitem_bsins", business.id)}
            />
          ))}

          {errors.bitem_bsins && (
            <small className="mb-3 text-red-500">{errors.bitem_bsins}</small>
          )}

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
