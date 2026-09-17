import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Dropdown from "@/components/Dropdown";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";
import { cntry_Options } from "@/utils/vtable.js";

const DeliveryTripsForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
  dpart_Options,
  party_Options,
  refid_Options,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-3">
          <Dropdown
            label="Department"
            options={dpart_Options}
            value={formData.tripm_dpart}
            onChange={(e) => onChange("tripm_dpart", e.target.value)}
            error={formErrors.tripm_dpart}
            required
            placeholder="Select..."
            disabled={readOnly || stopEdit}
            optionValue="id"
            optionLabel="dpart_cname"
          />
        </div>
        <div className="col-span-4">
          <Dropdown
            label="Party"
            options={party_Options}
            value={formData.tripm_party}
            onChange={(e) => onChange("tripm_party", e.target.value)}
            error={formErrors.tripm_party}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="party_cname"
          />
        </div>
        <div className="col-span-3">
          <InputText
            label="Vehicle"
            placeholder="Enter vehicle"
            value={formData.tripm_trpmv}
            onChange={(e) => onChange("tripm_trpmv", e.target.value)}
            error={formErrors.tripm_trpmv}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputText
            label="Trip Man 1"
            placeholder="Enter trip man 1"
            value={formData.tripm_trpma}
            onChange={(e) => onChange("tripm_trpma", e.target.value)}
            error={formErrors.tripm_trpma}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputText
            label="Trip Man 2"
            placeholder="Enter trip man 2"
            value={formData.tripm_trpmb}
            onChange={(e) => onChange("tripm_trpmb", e.target.value)}
            error={formErrors.tripm_trpmb}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputText
            label="Bill Amount"
            placeholder="Enter bill amount"
            value={formData.tripm_blamt}
            onChange={(e) => onChange("tripm_blamt", e.target.value)}
            error={formErrors.tripm_blamt}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-8">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.tripm_notes}
            onChange={(e) => onChange("tripm_notes", e.target.value)}
            error={formErrors.tripm_notes}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-12">
          <Dropdown
            label="Pending Delivery Invoice"
            options={refid_Options}
            value={formData.tripc_refid}
            onChange={(e) => onChange("tripc_refid", e.target.value)}
            error={formErrors.tripc_refid}
            required
            placeholder="Select..."
            disabled={readOnly || stopEdit}
            optionValue="tripc_refid"
            optionLabel="invcm_trnno"
            optionGrid="invcm_trnno:No,cntct_cname:Customer,cntct_ofadr:Address"
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.brand_actve}
          cname={formData.crusr_cname}
          cdate={formData.brand_crdat}
          uname={formData.upusr_cname}
          udate={formData.brand_updat}
          rvnmr={formData.brand_rvnmr}
        />
      )}
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
export default DeliveryTripsForm;
