import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import { IconPlus } from "@/icons";
import InputLabel from "@/components/InputLabel";
import { amountInWords } from "@/utils/ntw.js";

const PaymentForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onAddToList,
  party_Options,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-12">
          <Dropdown
            label="Payment"
            options={party_Options}
            value={formData.porpy_party}
            onChange={(e) => onChange("porpy_party", e.target.value)}
            error={formErrors.porpy_party}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="party_cname"
            optionGrid="party_cname:Name,chtac_chtno:COA,party_crbal:Balance"
          />
        </div>
        <div className="col-span-4">
          <InputNumber
            label="Amount"
            placeholder="0.00"
            value={formData.porpy_pdamt}
            onChange={(e) => onChange("porpy_pdamt", e.target.value)}
            error={formErrors.porpy_pdamt}
            required
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputText
            label="Ref No"
            placeholder="Enter ref no"
            value={formData.porpy_refno}
            onChange={(e) => onChange("porpy_refno", e.target.value)}
            error={formErrors.porpy_refno}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-5">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.porpy_notes}
            onChange={(e) => onChange("porpy_notes", e.target.value)}
            error={formErrors.porpy_notes}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-12">
          <InputLabel
            label="Amount in words"
            value={amountInWords(formData.porpy_pdamt)}
          />
        </div>
      </div>
      <div className="form-actions">
        <Button
          variant="outline"
          onClick={onAddToList}
          disabled={isBusy || readOnly}
        >
          <IconPlus size={16} className="icon-left" />
          Add
        </Button>
      </div>
    </div>
  );
};
export default PaymentForm;
