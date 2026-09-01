import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave, IconCopy } from "@/icons";
import { itype_Options, bool_Options, txmod_Options } from "@/utils/vtable.js";
import ItemContactList from "./ItemContactList";

const ItemsForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
  //others
  units_Options,
  sgrup_Options,
  scatg_Options,
  brand_Options,
  onCopyProduct,
  //item contact
  listDataCntct,
  onDeleteCntct,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-2">
          <InputText
            label="Item Code"
            placeholder="Enter item code"
            value={formData.items_icode}
            onChange={(e) => onChange("items_icode", e.target.value)}
            error={formErrors.items_icode}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputText
            label="Item Name"
            placeholder="Enter item name"
            value={formData.items_iname}
            onChange={(e) => onChange("items_iname", e.target.value)}
            error={formErrors.items_iname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputText
            label="Barcode"
            placeholder="Enter barcode"
            value={formData.items_brcod}
            onChange={(e) => onChange("items_brcod", e.target.value)}
            error={formErrors.items_brcod}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputText
            label="HS Code"
            placeholder="Enter HS code"
            value={formData.items_hscod}
            onChange={(e) => onChange("items_hscod", e.target.value)}
            error={formErrors.items_hscod}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Retail Unit"
            options={units_Options}
            value={formData.items_runit}
            onChange={(e) => onChange("items_runit", e.target.value)}
            error={formErrors.items_runit}
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="units_cname"
          />
        </div>
        <div className="col-span-1">
          <InputNumber
            label="Pack Qty"
            placeholder="Enter pack qty"
            value={formData.items_pkqty}
            onChange={(e) => onChange("items_pkqty", e.target.value)}
            error={formErrors.items_pkqty}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Packing Unit"
            options={units_Options}
            value={formData.items_punit}
            onChange={(e) => onChange("items_punit", e.target.value)}
            error={formErrors.items_punit}
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="units_cname"
          />
        </div>
        <div className="col-span-1">
          <InputNumber
            label="Size Qty"
            placeholder="Enter size qty"
            value={formData.items_szqty}
            onChange={(e) => onChange("items_szqty", e.target.value)}
            error={formErrors.items_szqty}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Size Unit"
            options={units_Options}
            value={formData.items_sunit}
            onChange={(e) => onChange("items_sunit", e.target.value)}
            error={formErrors.items_sunit}
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="units_cname"
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Sub Group"
            options={sgrup_Options}
            value={formData.items_sgrup}
            onChange={(e) => onChange("items_sgrup", e.target.value)}
            error={formErrors.items_sgrup}
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="sgrup_cname"
            optionGrid="sgrup_cname:Name,mgrup_cname:Group"
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Sub Category"
            options={scatg_Options}
            value={formData.items_scatg}
            onChange={(e) => onChange("items_scatg", e.target.value)}
            error={formErrors.items_scatg}
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="scatg_cname"
            optionGrid="scatg_cname:Name,mcatg_cname:Category"
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Item Type"
            options={itype_Options}
            value={formData.items_itype}
            onChange={(e) => onChange("items_itype", e.target.value)}
            error={formErrors.items_itype}
            placeholder="Select..."
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Brand"
            options={brand_Options}
            value={formData.items_brand}
            onChange={(e) => onChange("items_brand", e.target.value)}
            error={formErrors.items_brand}
            placeholder="Select..."
            required
            disabled={readOnly}
            optionValue="id"
            optionLabel="brand_cname"
          />
        </div>
        <div className="col-span-1">
          <Dropdown
            label="Track Stock"
            options={bool_Options}
            value={formData.items_tstck}
            onChange={(e) => onChange("items_tstck", e.target.value)}
            error={formErrors.items_tstck}
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-1">
          <InputNumber
            label="Margin (%)"
            placeholder="Enter margin %"
            value={formData.items_smrgn}
            onChange={(e) => onChange("items_smrgn", e.target.value)}
            error={formErrors.items_smrgn}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-1">
          <InputNumber
            label="Purchase VAT (%)"
            placeholder="Enter vat %"
            value={formData.items_prvat}
            onChange={(e) => onChange("items_prvat", e.target.value)}
            error={formErrors.items_prvat}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Purchase VAT Type"
            options={txmod_Options}
            value={formData.items_ptvat}
            onChange={(e) => onChange("items_ptvat", e.target.value)}
            error={formErrors.items_ptvat}
            placeholder="Select..."
            disabled={readOnly}
            required
          />
        </div>
        <div className="col-span-1">
          <InputNumber
            label="Sales VAT (%)"
            placeholder="Enter vat %"
            value={formData.items_slvat}
            onChange={(e) => onChange("items_slvat", e.target.value)}
            error={formErrors.items_slvat}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Sales VAT Type"
            options={txmod_Options}
            value={formData.items_stvat}
            onChange={(e) => onChange("items_stvat", e.target.value)}
            error={formErrors.items_stvat}
            placeholder="Select..."
            disabled={readOnly}
            required
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Stop Purchase"
            options={bool_Options}
            value={formData.items_stpur}
            onChange={(e) => onChange("items_stpur", e.target.value)}
            error={formErrors.items_stpur}
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Stop Sale"
            options={bool_Options}
            value={formData.items_stsal}
            onChange={(e) => onChange("items_stsal", e.target.value)}
            error={formErrors.items_stsal}
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Stop Transfer"
            options={bool_Options}
            value={formData.items_stnsf}
            onChange={(e) => onChange("items_stnsf", e.target.value)}
            error={formErrors.items_stnsf}
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Stop Process"
            options={bool_Options}
            value={formData.items_stprc}
            onChange={(e) => onChange("items_stprc", e.target.value)}
            error={formErrors.items_stprc}
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.items_notes}
            onChange={(e) => onChange("items_notes", e.target.value)}
            error={formErrors.items_notes}
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.items_actve}
          cname={formData.crusr_cname}
          cdate={formData.items_crdat}
          uname={formData.upusr_cname}
          udate={formData.items_updat}
          rvnmr={formData.items_rvnmr}
        />
      )}
      {formData?.id && (
        <ItemContactList
          readOnly={readOnly}
          listData={listDataCntct}
          onDelete={onDeleteCntct}
        />
      )}
      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel} disabled={isBusy}>
          <IconClose size={16} className="icon-left" />
          Cancel
        </Button>
        <Button
          variant="help"
          onClick={onCopyProduct}
          disabled={isBusy || !formData.id}
        >
          <IconCopy size={16} className="icon-left" />
          Copy
        </Button>
        <Button variant="info" onClick={onSubmit} disabled={isBusy}>
          <IconSave size={16} className="icon-left" />
          {formData?.id ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );
};
export default ItemsForm;
