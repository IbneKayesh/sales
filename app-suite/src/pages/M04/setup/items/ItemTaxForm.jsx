import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import { IconPlus } from "@/icons";

const ItemTaxForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
  //others
  txcod_Options,
  onSubmitCategory
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-6">
          <Dropdown
            label="TAX Code"
            options={txcod_Options}
            value={formData.itmtx_txcod}
            onChange={(e) => onChange("itmtx_txcod", e.target.value)}
            error={formErrors.itmtx_txcod}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="txcod_txtyp"
            optionGrid="txcod_txtyp:Type, txcod_txmod:Mode, txcod_txrat:Rate, txcod_trcod: Trnsaction"
          />
        </div>
        <div className="col-span-12 mt-5"></div>
        <div className="col-span-12 mt-5"></div>
        <div className="col-span-12 mt-5"></div>
      </div>
      <div className="form-actions">
        <Button
          variant="outline"
          onClick={onSubmitCategory}
          disabled={isBusy || readOnly}
        >
          <IconPlus size={16} className="icon-left" />
          Add to Category
        </Button>
        <Button
          variant="outline"
          onClick={onSubmit}
          disabled={isBusy || readOnly}
        >
          <IconPlus size={16} className="icon-left" />
          Add
        </Button>
      </div>
    </div>
  );
};
export default ItemTaxForm;
