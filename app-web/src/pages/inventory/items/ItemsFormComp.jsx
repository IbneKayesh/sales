import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import RequiredText from "@/components/RequiredText";
import AuditFields from "@/components/AuditFields";

const ItemsFormComp = ({
  formData,
  errors,
  onChange,
  items_runit_Options,
  items_punit_Options,
  items_sgrup_Options,
  items_scatg_Options,
  items_itype_Options,
  items_brand_Options,
}) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">Code</label>
        <InputText
          name="items_icode"
          value={formData.items_icode}
          onChange={(e) => onChange("items_icode", e.target.value)}
          className={`w-full ${errors.items_icode ? "p-invalid" : ""}`}
          placeholder="Enter code"
        />
        <RequiredText text={errors.items_icode} />
      </div>
      <div className="col-12 md:col-6">
        <label className="block font-bold mb-2 text-red-800">Name</label>
        <InputText
          name="items_iname"
          value={formData.items_iname}
          onChange={(e) => onChange("items_iname", e.target.value)}
          className={`w-full ${errors.items_iname ? "p-invalid" : ""}`}
          placeholder="Enter name"
        />
        <RequiredText text={errors.items_iname} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">Barcode</label>
        <InputText
          name="items_brcod"
          value={formData.items_brcod}
          onChange={(e) => onChange("items_brcod", e.target.value)}
          className={`w-full ${errors.items_brcod ? "p-invalid" : ""}`}
          placeholder="Enter barcode"
        />
        <RequiredText text={errors.items_brcod} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">HS Code</label>
        <InputText
          name="items_hscod"
          value={formData.items_hscod}
          onChange={(e) => onChange("items_hscod", e.target.value)}
          className={`w-full ${errors.items_hscod ? "p-invalid" : ""}`}
          placeholder="Enter HS code"
        />
        <RequiredText text={errors.items_hscod} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Retail Unit</label>
        <Dropdown
          name="items_runit"
          value={formData.items_runit}
          onChange={(e) => onChange("items_runit", e.value)}
          options={items_runit_Options}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.items_runit ? "p-invalid" : ""}`}
          placeholder="Enter retail unit"
          filter
          showClear
        />
        <RequiredText text={errors.items_runit} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Pack Qty</label>
        <InputNumber
          name="items_pkqty"
          value={formData.items_pkqty}
          onValueChange={(e) => onChange("items_pkqty", e.value)}
          className={`w-full ${errors.items_pkqty ? "p-invalid" : ""}`}
          placeholder="Enter pack qty"
        />
        <RequiredText text={errors.items_pkqty} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Pack Unit</label>
        <Dropdown
          name="items_punit"
          value={formData.items_punit}
          onChange={(e) => onChange("items_punit", e.value)}
          options={items_punit_Options}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.items_punit ? "p-invalid" : ""}`}
          placeholder="Enter pack unit"
          filter
          showClear
        />
        <RequiredText text={errors.items_punit} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Sub Group</label>
        <Dropdown
          name="items_sgrup"
          value={formData.items_sgrup}
          onChange={(e) => onChange("items_sgrup", e.value)}
          options={items_sgrup_Options}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.items_sgrup ? "p-invalid" : ""}`}
          placeholder="Enter sub group"
          filter
          showClear
        />
        <RequiredText text={errors.items_sgrup} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">
          Sub Category
        </label>
        <Dropdown
          name="items_scatg"
          value={formData.items_scatg}
          onChange={(e) => onChange("items_scatg", e.value)}
          options={items_scatg_Options}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.items_scatg ? "p-invalid" : ""}`}
          placeholder="Enter sub category"
          filter
          showClear
        />
        <RequiredText text={errors.items_scatg} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Type</label>
        <Dropdown
          name="items_itype"
          value={formData.items_itype}
          onChange={(e) => onChange("items_itype", e.value)}
          options={items_itype_Options}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.items_itype ? "p-invalid" : ""}`}
          placeholder="Enter type"
          filter
          showClear
        />
        <RequiredText text={errors.items_itype} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Brand</label>
        <Dropdown
          name="items_brand"
          value={formData.items_brand}
          onChange={(e) => onChange("items_brand", e.value)}
          options={items_brand_Options}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.items_brand ? "p-invalid" : ""}`}
          placeholder="Enter brand"
          filter
          showClear
        />
        <RequiredText text={errors.items_brand} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">VAT %</label>
        <InputNumber
          name="items_sdvat"
          value={formData.items_sdvat}
          onValueChange={(e) => onChange("items_sdvat", e.value)}
          className={`w-full ${errors.items_sdvat ? "p-invalid" : ""}`}
          placeholder="Enter VAT percentage"
        />
        <RequiredText text={errors.items_sdvat} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">Margin %</label>
        <InputNumber
          name="items_smrgn"
          value={formData.items_smrgn}
          onValueChange={(e) => onChange("items_smrgn", e.value)}
          className={`w-full ${errors.items_smrgn ? "p-invalid" : ""}`}
          placeholder="Enter margin percentage"
        />
        <RequiredText text={errors.items_smrgn} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">Fix Cost %</label>
        <InputNumber
          name="items_fxcst"
          value={formData.items_fxcst}
          onValueChange={(e) => onChange("items_fxcst", e.value)}
          className={`w-full ${errors.items_fxcst ? "p-invalid" : ""}`}
          placeholder="Enter fix cost percentage"
        />
        <RequiredText text={errors.items_fxcst} />
      </div>
      <div className="col-12 md:col-4">
        <label className="block font-bold mb-2">Notes</label>
        <InputText
          name="items_notes"
          value={formData.items_notes}
          onChange={(e) => onChange("items_notes", e.target.value)}
          className={`w-full ${errors.items_notes ? "p-invalid" : ""}`}
          placeholder="Enter notes"
        />
        <RequiredText text={errors.items_notes} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">Image</label>
        <InputText
          name="items_image"
          value={formData.items_image}
          onChange={(e) => onChange("items_image", e.target.value)}
          className={`w-full ${errors.items_image ? "p-invalid" : ""}`}
          placeholder="Enter image path or URL"
        />
        <RequiredText text={errors.items_image} />
      </div>

      <div className="col-12 md:col-8 flex flex-wrap gap-4 mt-4">
        <div className="flex align-items-center">
          <Checkbox
            inputId="items_tstck"
            name="items_tstck"
            onChange={(e) => onChange("items_tstck", e.checked)}
            checked={formData.items_tstck}
          />
          <label htmlFor="items_tstck" className="ml-2 font-bold">
            Track Stock
          </label>
        </div>
        <div className="flex align-items-center">
          <Checkbox
            inputId="items_stpur"
            name="items_stpur"
            onChange={(e) => onChange("items_stpur", e.checked)}
            checked={formData.items_stpur}
          />
          <label htmlFor="items_stpur" className="ml-2 font-bold">
            Stop Purchase
          </label>
        </div>
        <div className="flex align-items-center">
          <Checkbox
            inputId="items_stsal"
            name="items_stsal"
            onChange={(e) => onChange("items_stsal", e.checked)}
            checked={formData.items_stsal}
          />
          <label htmlFor="items_stsal" className="ml-2 font-bold">
            Stop Sales
          </label>
        </div>
        <div className="flex align-items-center">
          <Checkbox
            inputId="items_stnsf"
            name="items_stnsf"
            onChange={(e) => onChange("items_stnsf", e.checked)}
            checked={formData.items_stnsf}
          />
          <label htmlFor="items_stnsf" className="ml-2 font-bold">
            Stop Transfer
          </label>
        </div>
      </div>

      {formData.id && (
        <div className="col-12 mt-3">
          <AuditFields
            active={formData.items_actve}
            createdBy={formData.crusr_cname}
            createdAt={formData.items_crdat}
            updatedBy={formData.upusr_cname}
            updatedAt={formData.items_updat}
            revNo={formData.items_rvnmr}
          />
        </div>
      )}
    </div>
  );
};
export default ItemsFormComp;
