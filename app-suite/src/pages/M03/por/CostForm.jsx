import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import { IconPlus } from "@/icons";
import { csmod_Options, clmod_Options } from "@/utils/vtable";
import InputLabel from "@/components/InputLabel";
import { amountInWords } from "@/utils/ntw.js";

const CostForm = ({
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
        <div className="col-span-8">
          <Dropdown
            label="Cost Name"
            options={party_Options}
            value={formData.porcs_party}
            onChange={(e) => onChange("porcs_party", e.target.value)}
            error={formErrors.porcs_party}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="party_cname"
            optionGrid="party_cname:Name,chtac_chtno:COA,party_crbal:Balance"
          />
        </div>
        <div className="col-span-4">
          <Dropdown
            label="Cost Mode"
            options={csmod_Options}
            value={formData.porcs_csmod}
            onChange={(e) => onChange("porcs_csmod", e.target.value)}
            error={formErrors.porcs_csmod}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Calculation Mode"
            options={clmod_Options}
            value={formData.porcs_clmod}
            onChange={(e) => onChange("porcs_clmod", e.target.value)}
            error={formErrors.porcs_clmod}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Amount"
            placeholder="0.00"
            value={formData.porcs_value}
            onChange={(e) => onChange("porcs_value", e.target.value)}
            error={formErrors.porcs_value}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.porcs_notes}
            onChange={(e) => onChange("porcs_notes", e.target.value)}
            error={formErrors.porcs_notes}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-12">
          <InputLabel
            label="Amount in words"
            value={amountInWords(formData.porcs_value)}
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
export default CostForm;
