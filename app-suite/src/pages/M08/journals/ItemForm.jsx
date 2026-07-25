import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import { IconPlus } from "@/icons";

const ItemForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onAddToList,
  chtac_Options,
  party_Options,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-12">
          <Dropdown
            label="Ledger"
            options={chtac_Options}
            value={formData.jrnlc_chtac}
            onChange={(e) => onChange("jrnlc_chtac", e.target.value)}
            error={formErrors.jrnlc_chtac}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="name"
          />
        </div>
        <div className="col-span-6">
          <Dropdown
            label="Sub Ledger"
            options={party_Options}
            value={formData.jrnlc_party}
            onChange={(e) => onChange("jrnlc_party", e.target.value)}
            error={formErrors.jrnlc_party}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="name"
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Dr"
            placeholder="Enter Dr"
            value={formData.jrnlc_drval}
            onChange={(e) => onChange("jrnlc_drval", e.target.value)}
            error={formErrors.jrnlc_drval}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Cr"
            placeholder="Enter Cr"
            value={formData.jrnlc_crval}
            onChange={(e) => onChange("jrnlc_crval", e.target.value)}
            error={formErrors.jrnlc_crval}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-12">
          <InputText
            label="Description"
            placeholder="Enter description"
            value={formData.jrnlc_descr}
            onChange={(e) => onChange("jrnlc_descr", e.target.value)}
            error={formErrors.jrnlc_descr}
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
export default ItemForm;
