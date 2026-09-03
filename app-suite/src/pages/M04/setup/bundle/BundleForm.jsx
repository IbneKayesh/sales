import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Dropdown from "@/components/Dropdown";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";
import { bndle_Options } from "@/utils/vtable.js";
import InputLabel from "@/components/InputLabel";
import InputCalendar from "@/components/InputCalendar";

const BundleForm = ({
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
        <div className="col-span-4">
          <InputLabel label="Department" value={formData.dpart_cname} />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Type"
            options={bndle_Options}
            value={formData.bndlm_itype}
            onChange={(e) => onChange("bndlm_itype", e.target.value)}
            error={formErrors.bndlm_itype}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputText
            label="Bundle Name"
            placeholder="Enter bundle name"
            value={formData.bndlm_cname}
            onChange={(e) => onChange("bndlm_cname", e.target.value)}
            error={formErrors.bndlm_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-8">
          <InputLabel label="Name" value={formData.price_cname} />
        </div>
        <div className="col-span-2">
          <InputText
            label="Bundle Qty"
            placeholder="Enter bundle qty"
            value={formData.bndlm_itqty}
            onChange={(e) => onChange("bndlm_itqty", e.target.value)}
            error={formErrors.bndlm_itqty}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputLabel label="Unit" value={formData.runit_cname} />
        </div>
        <div className="col-span-2">
          <InputLabel
            label="Rate"
            value={formData.bndlm_itrat}
            error={formErrors.bndlm_itrat}
            disabled={true}
          />
        </div>
        <div className="col-span-2">
          <InputLabel
            label="Value"
            value={formData.bndlm_itqty * formData.bndlm_itrat}
          />
        </div>
        <div className="col-span-2">
          <InputLabel label="Bundle" value={formData.bndlm_value || 0} />
        </div>
        <div className="col-span-3">
          <InputCalendar
            label="From Date"
            value={formData.bndlm_frdat}
            onChange={(e) => onChange("bndlm_frdat", e.target.value)}
            placeholder="Select..."
            error={formErrors.bndlm_frdat}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputCalendar
            label="To Date"
            value={formData.bndlm_todat}
            onChange={(e) => onChange("bndlm_todat", e.target.value)}
            placeholder="Select..."
            error={formErrors.bndlm_todat}
            required
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.bndlm_actve}
          cname={formData.crusr_cname}
          cdate={formData.bndlm_crdat}
          uname={formData.upusr_cname}
          udate={formData.bndlm_updat}
          rvnmr={formData.bndlm_rvnmr}
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
export default BundleForm;
