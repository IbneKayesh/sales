import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Dropdown from "@/components/Dropdown";
import InputNumber from "@/components/InputNumber";
import InputCalendar from "@/components/InputCalendar";
import InputLabel from "@/components/InputLabel";
import AuditData from "@/components/AuditData";
import { IconPlus, IconClose, IconSave } from "@/icons";

const MrrForm = ({
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
  //modal
  handleShowModal,
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
            options={cntct_Options}
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
          <InputLabel label="Total Amount" value={formData.mrrdm_tramt} />
        </div>
        <div className="col-span-2">
          <InputLabel label="Item Discount" value={formData.mrrdm_itmds} />
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
        <div className="col-span-2">
          <InputLabel label="iVAT Amount" value={formData.mrrdm_ivtmt} />
        </div>
        <div className="col-span-2">
          <InputLabel label="VAT Amount" value={formData.mrrdm_vtamt} />
        </div>
        <div className="col-span-2">
          <InputLabel label="TAX Amount" value={formData.mrrdm_txamt} />
        </div>
        <div className="col-span-2">
          <InputLabel label="Fix Amount" value={formData.mrrdm_fcamt} />
        </div>
        <div className="col-span-2">
          <InputLabel label="Include Cost" value={formData.mrrdm_icamt} />
        </div>
        <div className="col-span-2">
          <InputLabel label="Exclude Cost" value={formData.mrrdm_ecamt} />
        </div>
        <div className="col-span-2">
          <InputLabel label="Payable Amount" value={formData.mrrdm_pyamt} />
        </div>
        <div className="col-span-2">
          <InputLabel label="Paid Amount" value={formData.mrrdm_pdamt} />
        </div>
        <div className="col-span-2">
          <InputLabel label="Due Amount" value={formData.mrrdm_duamt} />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Exchange Rate"
            placeholder="0.00"
            value={formData.mrrdm_exrat}
            onChange={(e) => onChange("mrrdm_exrat", e.target.value)}
            error={formErrors.mrrdm_exrat}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputText
            label="Vehicle"
            placeholder="Enter vehicle"
            value={formData.mrrdm_vehid}
            onChange={(e) => onChange("mrrdm_vehid", e.target.value)}
            error={formErrors.mrrdm_vehid}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-5">
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
export default MrrForm;
