import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import { IconPlus } from "@/icons";
import { csmod_Options } from "@/utils/vtable";

const CostForm = ({
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
        <div className="col-span-6">
          <Dropdown
            label="Cost Name"
            options={party_Options}
            value={formData.invcs_party}
            onChange={(e) => onChange("invcs_party", e.target.value)}
            error={formErrors.invcs_party}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="party_cname"
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Cost Mode"
            options={csmod_Options}
            value={formData.invcs_csmod}
            onChange={(e) => onChange("invcs_csmod", e.target.value)}
            error={formErrors.invcs_csmod}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Amount"
            placeholder="0.00"
            value={formData.invcs_value}
            onChange={(e) => onChange("invcs_value", e.target.value)}
            error={formErrors.invcs_value}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-12">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.invcs_notes}
            onChange={(e) => onChange("invcs_notes", e.target.value)}
            error={formErrors.invcs_notes}
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
export default CostForm;
