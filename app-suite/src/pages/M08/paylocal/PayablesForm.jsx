import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Dropdown from "@/components/Dropdown";
import { IconClose, IconSave } from "@/icons";
import InputLabel from "@/components/InputLabel";
import InputNumber from "@/components/InputNumber";
import { formatDate } from "@/utils/datetime.js";

const PayablesForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
  //others
  party_Options,
}) => {
  //mrrpy_party convert to dropdown
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-3">
          <InputLabel label="Department" value={formData.dpart_cname} />
        </div>
        <div className="col-span-3">
          <InputLabel label="Type" value={formData.mrrdm_ttype} />
        </div>
        <div className="col-span-3">
          <InputLabel label="Ref No" value={formData.mrrpy_refno} />
        </div>
        <div className="col-span-3">
          <InputLabel
            label="Due Date"
            value={formatDate(formData.mrrdm_trdat)}
          />
        </div>
        <div className="col-span-5">
          <InputLabel label="Name" value={formData.cntct_cname} />
        </div>
        <div className="col-span-7">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.mrrpy_notes}
            onChange={(e) => onChange("mrrpy_notes", e.target.value)}
            error={formErrors.mrrpy_notes}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <Dropdown
            label="Ledger"
            options={party_Options}
            value={formData.mrrpy_party}
            onChange={(e) => onChange("mrrpy_party", e.target.value)}
            error={formErrors.mrrpy_party}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="party_cname"
            optionGrid="party_cname:Name,chtac_chtno:COA,party_crbal:Balance"
          />
        </div>
        <div className="col-span-3">
          <InputLabel label="Due" value={formData.mrrpy_duamt} />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Amount"
            placeholder="0.00"
            value={formData.mrrpy_pdamt}
            onChange={(e) => onChange("mrrpy_pdamt", e.target.value)}
            error={formErrors.mrrpy_pdamt}
            step="0.01"
            disabled={readOnly}
          />
        </div>
      </div>
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
export default PayablesForm;
