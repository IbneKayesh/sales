import Button from "@/components/Button";
import InputLabel from "@/components/InputLabel";
import AuditData from "@/components/AuditData";
import { IconPlus, IconClose, IconSave } from "@/icons";
import { formatDate } from "@/utils/datetime";

const MrrForm = ({
  isBusy,
  readOnly,
  formData,
  onCancel,
  onSubmit,
  //modal
  onShowModal,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-3">
          <InputLabel label="Department" value={formData.dpart_cname} />
        </div>
        <div className="col-span-3">
          <InputLabel label="Supplier" value={formData.cntct_cname} />
        </div>
        <div className="col-span-3">
          <InputLabel label="Date" value={formatDate(formData.mrrdm_trdat)} />
        </div>
        <div className="col-span-3">
          <InputLabel label="Ref No" value={formData.mrrdm_refno} />
        </div>
        <div className="col-span-3">
          <InputLabel label="Total Amount" value={formData.mrrdm_tramt} />
        </div>
        <div className="col-span-2">
          <InputLabel label="Item Discount" value={formData.mrrdm_itmds} />
        </div>
        <div className="col-span-3">
          <InputLabel label="Invoice Discount" value={formData.mrrdm_invds} />
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
          <InputLabel label="Exchange Rate" value={formData.mrrdm_exrat} />
        </div>
        <div className="col-span-3">
          <InputLabel label="Vehicle" value={formData.mrrdm_vehid} />
        </div>
        <div className="col-span-5">
          <InputLabel label="Notes" value={formData.mrrdm_notes} />
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
        <Button variant="outline" size="sm" onClick={() => onShowModal("PAYMENT")}>
          <IconPlus size={14} className="icon-left" />
          Add Payment
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={isBusy}>
          <IconClose size={16} className="icon-left" />
          Cancel
        </Button>
        <Button variant="info" onClick={onSubmit} disabled={isBusy || readOnly}>
          <IconSave size={16} className="icon-left" />
          Create
        </Button>
      </div>
    </div>
  );
};
export default MrrForm;
