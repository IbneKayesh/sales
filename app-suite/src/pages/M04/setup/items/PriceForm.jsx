import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";

const PriceForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
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
        <div className="col-span-2">
          <InputNumber
            label="Last Purchase Rate"
            placeholder="Enter last purchase rate"
            value={formData.price_lprat}
            onChange={(e) => onChange("price_lprat", e.target.value)}
            error={formErrors.price_lprat}
            step="0.01"
            disabled={readOnly}
          />
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
          <InputNumber
            label="Good Stock"
            placeholder="Enter good stock"
            value={formData.price_gdstk}
            onChange={(e) => onChange("price_gdstk", e.target.value)}
            error={formErrors.price_gdstk}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Bad Stock"
            placeholder="Enter bad stock"
            value={formData.price_bdstk}
            onChange={(e) => onChange("price_bdstk", e.target.value)}
            error={formErrors.price_bdstk}
            step="0.01"
            disabled={readOnly}
          />
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
          <InputNumber
            label="Purchase Booking Qty"
            placeholder="Enter purchase booking qty"
            value={formData.price_pbqty}
            onChange={(e) => onChange("price_pbqty", e.target.value)}
            error={formErrors.price_pbqty}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Sales Booking Qty"
            placeholder="Enter sales booking qty"
            value={formData.price_sbqty}
            onChange={(e) => onChange("price_sbqty", e.target.value)}
            error={formErrors.price_sbqty}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.price_notes}
            onChange={(e) => onChange("price_notes", e.target.value)}
            error={formErrors.price_notes}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-5">
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
        <Button variant="info" onClick={onSubmit} disabled={isBusy}>
          <IconSave size={16} className="icon-left" />
          {formData?.id ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );
};
export default PriceForm;
