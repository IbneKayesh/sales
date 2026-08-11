import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Dropdown from "@/components/Dropdown";
import InputNumber from "@/components/InputNumber";
import InputCalendar from "@/components/InputCalendar";
import AuditData from "@/components/AuditData";
import { IconPlus, IconClose, IconSave } from "@/icons";

// Invoice header form — invoice entry style.
// Only the entry fields live here; the computed/split values are rendered
// as the Bill Summary panel at the bottom of ItemList.
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
  //modal
  onShowModal,
}) => {
  return (
    <div className="form-wrap">
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
        <div className="col-span-3">
          <InputNumber
            label="Exchange Rate"
            placeholder="0.00"
            value={formData.invcm_exrat}
            onChange={(e) => onChange("invcm_exrat", e.target.value)}
            error={formErrors.invcm_exrat}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-9">
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
              onClick={() => onShowModal("PAYMENT")}
            >
              <IconPlus size={14} className="icon-left" />
              Add Payment
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShowModal("COSTING")}
            >
              <IconPlus size={14} className="icon-left" />
              Add Costing
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShowModal("ITEM")}
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
