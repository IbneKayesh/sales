import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import { IconPlus } from "@/icons";
import { csmod_Options, clmod_Options } from "@/utils/vtable";

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
            label="Cost Party"
            options={party_Options}
            value={formData.mrrcs_party}
            onChange={(e) => onChange("mrrcs_party", e.target.value)}
            error={formErrors.mrrcs_party}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="items_iname"
          />
        </div>
        <div className="col-span-4">
          <Dropdown
            label="Cost Mode"
            options={csmod_Options}
            value={formData.mrrcs_csmod}
            onChange={(e) => onChange("mrrcs_csmod", e.target.value)}
            error={formErrors.mrrcs_csmod}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Calculation Mode"
            options={clmod_Options}
            value={formData.mrrcs_clmod}
            onChange={(e) => onChange("mrrcs_clmod", e.target.value)}
            error={formErrors.mrrcs_clmod}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Amount"
            placeholder="0.00"
            value={formData.mrrcs_value}
            onChange={(e) => onChange("mrrcs_value", e.target.value)}
            error={formErrors.mrrcs_value}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.mrrcs_notes}
            onChange={(e) => onChange("mrrcs_notes", e.target.value)}
            error={formErrors.mrrcs_notes}
            disabled={readOnly}
          />
        </div>
      </div>
      <div className="form-actions">
        <Button variant="outline" onClick={onAddToList} disabled={isBusy}>
          <IconPlus size={16} className="icon-left" />
          Add
        </Button>
      </div>
    </div>
  );
};
export default CostForm;
