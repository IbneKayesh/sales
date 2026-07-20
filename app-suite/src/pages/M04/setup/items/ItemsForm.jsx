import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";
import { itype_Options, bool_Options} from "@/utils/vtable.js";

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
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-3">
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
        <div className="col-span-3">
          <InputText
            label="Barcode"
            placeholder="Enter barcode"
            value={formData.items_brcod}
            onChange={(e) => onChange("items_brcod", e.target.value)}
            error={formErrors.items_brcod}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputText
            label="HS Code"
            placeholder="Enter HS code"
            value={formData.items_hscod}
            onChange={(e) => onChange("items_hscod", e.target.value)}
            error={formErrors.items_hscod}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-9">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.items_notes}
            onChange={(e) => onChange("items_notes", e.target.value)}
            error={formErrors.items_notes}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
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
        <div className="col-span-3">
          <InputNumber
            label="Pack Qty"
            placeholder="Enter pack qty"
            value={formData.items_pkqty}
            onChange={(e) => onChange("items_pkqty", e.target.value)}
            error={formErrors.items_pkqty}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
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
        <div className="col-span-3">
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
          />
        </div>
        <div className="col-span-3">
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
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Item Type"
            options={itype_Options}
            value={formData.items_itype}
            onChange={(e) => onChange("items_itype", e.target.value)}
            error={formErrors.items_itype}
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Brand"
            options={brand_Options}
            value={formData.items_brand}
            onChange={(e) => onChange("items_brand", e.target.value)}
            error={formErrors.items_brand}
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="brand_cname"
          />
        </div>
        <div className="col-span-3">
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
        <div className="col-span-2">
          <InputNumber
            label="SD VAT (%)"
            placeholder="Enter SD VAT %"
            value={formData.items_sdvat}
            onChange={(e) => onChange("items_sdvat", e.target.value)}
            error={formErrors.items_sdvat}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
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
        <div className="col-span-2">
          <InputNumber
            label="Fixed Cost"
            placeholder="Enter fixed cost"
            value={formData.items_fxcst}
            onChange={(e) => onChange("items_fxcst", e.target.value)}
            error={formErrors.items_fxcst}
            step="0.01"
            disabled={readOnly}
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
      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel} disabled={isBusy}>
          <IconClose size={16} className="icon-left" />
          Cancel
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
