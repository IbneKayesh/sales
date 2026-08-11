import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Dropdown from "@/components/Dropdown";
import InputNumber from "@/components/InputNumber";
import InputCalendar from "@/components/InputCalendar";
import InputLabel from "@/components/InputLabel";
import AuditData from "@/components/AuditData";
import { IconPlus, IconClose, IconSave } from "@/icons";

const InvoiceForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
  dpart_Options,
  cntct_Options,
}) => {
  return (
    <div className="form-wrap">
      adding items stop edit master invoice + mrr
      <div className="grid">
        <div className="col-span-3">
          <Dropdown
            label="Department"
            options={dpart_Options}
            value={formData.invcm_dpart}
            onChange={(e) => onChange("invcm_dpart", e.target.value)}
            error={formErrors.invcm_dpart}
            required
            placeholder="Select..."
            disabled={readOnly || stopEdit}
            optionValue="id"
            optionLabel="dpart_cname"
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Customer"
            options={cntct_Options}
            value={formData.invcm_cntct}
            onChange={(e) => onChange("invcm_cntct", e.target.value)}
            error={formErrors.invcm_cntct}
            required
            placeholder="Select..."
            disabled={readOnly || stopEdit}
            optionValue="id"
            optionLabel="cntct_cname"
          />
        </div>
        <div className="col-span-3">
          <InputCalendar
            label="Date"
            value={formData.invcm_trdat}
            onChange={(e) => onChange("invcm_trdat", e.target.value)}
            placeholder="Select..."
            error={formErrors.invcm_trdat}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputText
            label="Ref No"
            placeholder="Enter reference no"
            value={formData.invcm_refno}
            onChange={(e) => onChange("invcm_refno", e.target.value)}
            error={formErrors.invcm_refno}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputLabel label="Total Amount" value={formData.invcm_tramt} />
        </div>
        <div className="col-span-2">
          <InputLabel label="Item Discount" value={formData.invcm_itmds} />
        </div>
        <div className="col-span-2">
          <InputLabel label="Invoice Discount %" value={formData.invcm_dspct} />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Invoice Discount"
            placeholder="0.00"
            value={formData.invcm_invds}
            onChange={(e) => onChange("invcm_invds", e.target.value)}
            error={formErrors.invcm_invds}
            step="0.01"
            disabled={readOnly || Number(formData.invcm_dspct) > 0}
          />
        </div>
        <div className="col-span-2">
          <InputLabel label="Loyalty Discount" value={formData.invcm_lylds} />
        </div>
        <div className="col-span-2">
          <InputLabel label="VAT Amount" value={formData.invcm_vtamt} />
        </div>
        <div className="col-span-2">
          <InputLabel label="Include Cost" value={formData.invcm_icamt} />
        </div>
        <div className="col-span-2">
          <InputLabel label="Exclude Cost" value={formData.invcm_ecamt} />
        </div>
        <div className="col-span-2">
          <InputLabel label="Payable Amount" value={formData.invcm_pyamt} />
        </div>
        <div className="col-span-2">
          <InputLabel label="Paid Amount" value={formData.invcm_pdamt} />
        </div>
        <div className="col-span-2">
          <InputLabel label="Due Amount" value={formData.invcm_duamt} />
        </div>
        <div className="col-span-2">
          <InputLabel label="Exchange Rate" value={formData.invcm_exrat} />
        </div>
        <div className="col-span-12">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.invcm_notes}
            onChange={(e) => onChange("invcm_notes", e.target.value)}
            error={formErrors.invcm_notes}
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.invcm_actve}
          cname={formData.crusr_cname}
          cdate={formData.invcm_crdat}
          uname={formData.upusr_cname}
          udate={formData.invcm_updat}
          rvnmr={formData.invcm_rvnmr}
        />
      )}
      <div className="form-actions">
        {!readOnly && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel("PAYMENT")}
            >
              <IconPlus size={14} className="icon-left" />
              Add Payment
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel("COSTING")}
            >
              <IconPlus size={14} className="icon-left" />
              Add Costing
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel("ITEM")}
            >
              <IconPlus size={14} className="icon-left" />
              Add Item
            </Button>
          </>
        )}
        <Button variant="secondary" onClick={onCancel} disabled={isBusy}>
          <IconClose size={16} className="icon-left" />
          Cancel
        </Button>
        <Button variant="info" onClick={onSubmit} disabled={isBusy || readOnly}>
          <IconSave size={16} className="icon-left" />
          {formData?.id ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );
};
export default InvoiceForm;
