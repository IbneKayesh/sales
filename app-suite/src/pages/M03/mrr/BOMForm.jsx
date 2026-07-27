import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Dropdown from "@/components/Dropdown";
import InputNumber from "@/components/InputNumber";
import InputCalendar from "@/components/InputCalendar";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";

const BOMForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
  dpart_Options,
  contact_Options,
  units_Options,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-3">
          <Dropdown
            label="Department"
            options={dpart_Options}
            value={formData.mrrdm_dpart}
            onChange={(e) => onChange("mrrdm_dpart", e.target.value)}
            error={formErrors.mrrdm_dpart}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="dpart_cname"
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Supplier"
            options={contact_Options}
            value={formData.mrrdm_cntct}
            onChange={(e) => onChange("mrrdm_cntct", e.target.value)}
            error={formErrors.mrrdm_cntct}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="cntct_cname"
          />
        </div>
        <div className="col-span-3">
          <InputText
            label="MRR No / GRN No"
            placeholder="Enter MRR/GRN no"
            value={formData.mrrdm_trnno}
            onChange={(e) => onChange("mrrdm_trnno", e.target.value)}
            error={formErrors.mrrdm_trnno}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputCalendar
            label="Date"
            value={formData.mrrdm_trdat}
            onChange={(e) => onChange("mrrdm_trdat", e.target.value)}
            placeholder="Select..."
            error={formErrors.mrrdm_trdat}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputText
            label="Ref No"
            placeholder="Enter reference no"
            value={formData.mrrdm_refno}
            onChange={(e) => onChange("mrrdm_refno", e.target.value)}
            error={formErrors.mrrdm_refno}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Total Amount"
            placeholder="0.00"
            value={formData.mrrdm_tramt}
            onChange={(e) => onChange("mrrdm_tramt", e.target.value)}
            error={formErrors.mrrdm_tramt}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Item Discount"
            placeholder="0.00"
            value={formData.mrrdm_itmds}
            onChange={(e) => onChange("mrrdm_itmds", e.target.value)}
            error={formErrors.mrrdm_itmds}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Invoice Discount"
            placeholder="0.00"
            value={formData.mrrdm_invds}
            onChange={(e) => onChange("mrrdm_invds", e.target.value)}
            error={formErrors.mrrdm_invds}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="VAT Amount"
            placeholder="0.00"
            value={formData.mrrdm_vtamt}
            onChange={(e) => onChange("mrrdm_vtamt", e.target.value)}
            error={formErrors.mrrdm_vtamt}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="TAX Amount"
            placeholder="0.00"
            value={formData.mrrdm_txamt}
            onChange={(e) => onChange("mrrdm_txamt", e.target.value)}
            error={formErrors.mrrdm_txamt}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Payable Amount"
            placeholder="0.00"
            value={formData.mrrdm_pyamt}
            onChange={(e) => onChange("mrrdm_pyamt", e.target.value)}
            error={formErrors.mrrdm_pyamt}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Paid Amount"
            placeholder="0.00"
            value={formData.mrrdm_pdamt}
            onChange={(e) => onChange("mrrdm_pdamt", e.target.value)}
            error={formErrors.mrrdm_pdamt}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Due Amount"
            placeholder="0.00"
            value={formData.mrrdm_duamt}
            onChange={(e) => onChange("mrrdm_duamt", e.target.value)}
            error={formErrors.mrrdm_duamt}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-12">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.mrrdm_notes}
            onChange={(e) => onChange("mrrdm_notes", e.target.value)}
            error={formErrors.mrrdm_notes}
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.mrrdm_actve}
          cname={formData.crusr_cname}
          cdate={formData.mrrdm_crdat}
          uname={formData.upusr_cname}
          udate={formData.mrrdm_updat}
          rvnmr={formData.mrrdm_rvnmr}
        />
      )}
      <div className="form-actions">
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
export default BOMForm;
