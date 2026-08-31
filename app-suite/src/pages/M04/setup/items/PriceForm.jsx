import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import InputLabel from "@/components/InputLabel";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave, IconInfo } from "@/icons";
import Dropdown from "@/components/Dropdown";

const PriceForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
  dpart_Options,
  onPriceCheck,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-6">
          <InputText
            label="Price Name"
            placeholder="Enter price name"
            value={formData.price_cname}
            onChange={(e) => onChange("price_cname", e.target.value)}
            error={formErrors.price_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <Dropdown
            label="Department"
            options={dpart_Options}
            value={formData.price_dpart}
            onChange={(e) => onChange("price_dpart", e.target.value)}
            error={formErrors.price_dpart}
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="dpart_cname"
          />
        </div>
        <div className="col-span-2">
          <InputLabel label="Last Purchase Rate" value={formData.price_lprat} />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Distributor Rate"
            placeholder="Enter distributor rate"
            value={formData.price_dprat}
            onChange={(e) => onChange("price_dprat", e.target.value)}
            error={formErrors.price_dprat}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Trade Rate"
            placeholder="Enter trade rate"
            value={formData.price_tprat}
            onChange={(e) => onChange("price_tprat", e.target.value)}
            error={formErrors.price_tprat}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="MRP Rate"
            placeholder="Enter MRP rate"
            value={formData.price_mrrat}
            onChange={(e) => onChange("price_mrrat", e.target.value)}
            error={formErrors.price_mrrat}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Discount (%)"
            placeholder="Enter discount %"
            value={formData.price_dspct}
            onChange={(e) => onChange("price_dspct", e.target.value)}
            error={formErrors.price_dspct}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputLabel label="Good Stock" value={formData.price_gdstk} />
        </div>
        <div className="col-span-2">
          <InputLabel label="Bad Stock" value={formData.price_bdstk} />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Min Quantity"
            placeholder="Enter min quantity"
            value={formData.price_mnqty}
            onChange={(e) => onChange("price_mnqty", e.target.value)}
            error={formErrors.price_mnqty}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Max Quantity"
            placeholder="Enter max quantity"
            value={formData.price_mxqty}
            onChange={(e) => onChange("price_mxqty", e.target.value)}
            error={formErrors.price_mxqty}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputLabel
            label="Purchase Booking Qty"
            value={formData.price_pbqty}
          />
        </div>
        <div className="col-span-2">
          <InputLabel label="Sales Booking Qty" value={formData.price_sbqty} />
        </div>
        <div className="col-span-2">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.price_notes}
            onChange={(e) => onChange("price_notes", e.target.value)}
            error={formErrors.price_notes}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-12">
          <InputText
            label="JSON Note"
            placeholder="Enter json note"
            value={formData.price_jnote}
            onChange={(e) => onChange("price_jnote", e.target.value)}
            error={formErrors.price_jnote}
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.price_actve}
          cname={formData.crusr_cname}
          cdate={formData.price_crdat}
          uname={formData.upusr_cname}
          udate={formData.price_updat}
          rvnmr={formData.price_rvnmr}
        />
      )}
      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel} disabled={isBusy}>
          <IconClose size={16} className="icon-left" />
          Cancel
        </Button>
        <Button
          variant="help"
          onClick={onPriceCheck}
          disabled={isBusy || !formData.id}
        >
          <IconInfo size={16} className="icon-left" />
          Price Check
        </Button>
        <Button variant="info" onClick={onSubmit} disabled={isBusy}>
          <IconSave size={16} className="icon-left" />
          {formData?.id ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );
};
export default PriceForm;
