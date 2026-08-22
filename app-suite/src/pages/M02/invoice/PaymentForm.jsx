import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import { IconPlus } from "@/icons";

const PaymentForm = ({
  isBusy,
  readOnly,
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
            value={formData.invpy_party}
            onChange={(e) => onChange("invpy_party", e.target.value)}
            error={formErrors.invpy_party}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="party_cname"
            optionGrid="party_cname:Name,prtyn_chtno:COA"
          />
        </div>
        <div className="col-span-4">
          <InputNumber
            label="Amount"
            placeholder="0.00"
            value={formData.invpy_pdamt}
            onChange={(e) => onChange("invpy_pdamt", e.target.value)}
            error={formErrors.invpy_pdamt}
            required
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputText
            label="Ref No"
            placeholder="Enter ref no"
            value={formData.invpy_refno}
            onChange={(e) => onChange("invpy_refno", e.target.value)}
            error={formErrors.invpy_refno}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-5">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.invpy_notes}
            onChange={(e) => onChange("invpy_notes", e.target.value)}
            error={formErrors.invpy_notes}
            disabled={readOnly}
          />
        </div>
      </div>
      <div className="form-actions">
        <Button variant="outline" onClick={onAddToList} disabled={isBusy || readOnly}>
          <IconPlus size={16} className="icon-left" />
          Add
        </Button>
      </div>
    </div>
  );
};
export default PaymentForm;
