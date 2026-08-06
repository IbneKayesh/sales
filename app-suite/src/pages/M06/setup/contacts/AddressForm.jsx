import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Dropdown from "@/components/Dropdown";
import { IconPlus } from "@/icons";
import { cntad_ttype_Options } from "@/utils/vtable";

const AddressForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onSaveAddress,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-3">
          <Dropdown
            label="Type"
            options={cntad_ttype_Options}
            value={formData.cntad_ttype}
            onChange={(e) => onChange("cntad_ttype", e.target.value)}
            error={formErrors.cntad_ttype}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputText
            label="Person"
            placeholder="Enter person"
            value={formData.cntad_cntps}
            onChange={(e) => onChange("cntad_cntps", e.target.value)}
            error={formErrors.cntad_cntps}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputText
            label="Contact No"
            placeholder="Enter contact no"
            value={formData.cntad_cntno}
            onChange={(e) => onChange("cntad_cntno", e.target.value)}
            error={formErrors.cntad_cntno}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputText
            label="Email"
            placeholder="Enter email"
            value={formData.cntad_email}
            onChange={(e) => onChange("cntad_email", e.target.value)}
            error={formErrors.cntad_email}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputText
            label="Address"
            placeholder="Enter address"
            value={formData.cntad_ofadr}
            onChange={(e) => onChange("cntad_ofadr", e.target.value)}
            error={formErrors.cntad_ofadr}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.cntad_notes}
            onChange={(e) => onChange("cntad_notes", e.target.value)}
            error={formErrors.cntad_notes}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-12">
          <InputText
            label="Google Maps"
            placeholder="Enter google maps"
            value={formData.cntad_gmaps}
            onChange={(e) => onChange("cntad_gmaps", e.target.value)}
            error={formErrors.cntad_gmaps}
            disabled={readOnly}
          />
        </div>
      </div>
      <div className="form-actions">
        <Button
          variant="outline"
          onClick={() => onSaveAddress("CLOSE")}
          disabled={isBusy || readOnly}
        >
          <IconPlus size={16} className="icon-left" />
          {formData?.id ? "Update" : "Add"}
        </Button>
      </div>
    </div>
  );
};
export default AddressForm;
