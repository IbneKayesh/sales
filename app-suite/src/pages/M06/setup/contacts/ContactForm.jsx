import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Dropdown from "@/components/Dropdown";
import InputNumber from "@/components/InputNumber";
import InputLabel from "@/components/InputLabel";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";
import {
  cntry_Options,
  crncy_Options,
  sorce_Options,
  ctype_Options,
} from "@/utils/vtable.js";

const ContactForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-6">
          <InputText
            label="Contact Name"
            placeholder="Enter contact name"
            value={formData.cntct_cname}
            onChange={(e) => onChange("cntct_cname", e.target.value)}
            error={formErrors.cntct_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputText
            label="Code"
            placeholder="Enter code"
            value={formData.cntct_ccode}
            onChange={(e) => onChange("cntct_ccode", e.target.value)}
            error={formErrors.cntct_ccode}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Type"
            options={ctype_Options}
            value={formData.cntct_ctype}
            onChange={(e) => onChange("cntct_ctype", e.target.value)}
            error={formErrors.cntct_ctype}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Source"
            options={sorce_Options}
            value={formData.cntct_sorce}
            onChange={(e) => onChange("cntct_sorce", e.target.value)}
            error={formErrors.cntct_sorce}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Contact Person"
            placeholder="Enter person name"
            value={formData.cntct_cntps}
            onChange={(e) => onChange("cntct_cntps", e.target.value)}
            error={formErrors.cntct_cntps}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputText
            label="Contact No"
            placeholder="Enter contact number"
            value={formData.cntct_cntno}
            onChange={(e) => onChange("cntct_cntno", e.target.value)}
            error={formErrors.cntct_cntno}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputText
            label="Email"
            placeholder="email@example.com"
            value={formData.cntct_email}
            onChange={(e) => onChange("cntct_email", e.target.value)}
            error={formErrors.cntct_email}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputText
            label="TIN No"
            placeholder="Enter TIN number"
            value={formData.cntct_tinno}
            onChange={(e) => onChange("cntct_tinno", e.target.value)}
            error={formErrors.cntct_tinno}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Trade"
            placeholder="Enter trade"
            value={formData.cntct_trade}
            onChange={(e) => onChange("cntct_trade", e.target.value)}
            error={formErrors.cntct_trade}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputText
            label="Office Address"
            placeholder="Enter office address"
            value={formData.cntct_ofadr}
            onChange={(e) => onChange("cntct_ofadr", e.target.value)}
            error={formErrors.cntct_ofadr}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-8">
          <InputText
            label="Factory Address"
            placeholder="Enter factory address"
            value={formData.cntct_fcadr}
            onChange={(e) => onChange("cntct_fcadr", e.target.value)}
            error={formErrors.cntct_fcadr}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <Dropdown
            label="Country"
            options={cntry_Options}
            value={formData.cntct_cntry}
            onChange={(e) => onChange("cntct_cntry", e.target.value)}
            error={formErrors.cntct_cntry}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Currency"
            options={crncy_Options}
            value={formData.cntct_crncy}
            onChange={(e) => onChange("cntct_crncy", e.target.value)}
            error={formErrors.cntct_crncy}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Discount %"
            placeholder="0"
            value={formData.cntct_dspct}
            onChange={(e) => onChange("cntct_dspct", e.target.value)}
            min={0}
            max={100}
            step={0.01}
            error={formErrors.cntct_dspct}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputLabel label="Credit Limit" value={formData.cntct_crlmt} />
        </div>
        <div className="col-span-3">
          <InputLabel label="Credit Balance" value={formData.cntct_crbal} />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.cntct_actve}
          cname={formData.crusr_cname}
          cdate={formData.cntct_crdat}
          uname={formData.upusr_cname}
          udate={formData.cntct_updat}
          rvnmr={formData.cntct_rvnmr}
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
export default ContactForm;
