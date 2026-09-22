import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Dropdown from "@/components/Dropdown";
import AuditData from "@/components/AuditData";
import InputLabel from "@/components/InputLabel";
import { IconClose, IconSave } from "@/icons";

const CRouteForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
  cntct_Options,
  emply_Options,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-6">
          <InputLabel
            label="Territory"
            value={formData.trtry_cname || "Territory name is required"}
            error={formErrors.route_trtry}
          />
        </div>
        <div className="col-span-6">
          <InputLabel
            label="Delivery Route"
            value={formData.route_rname || "Delivery Route is required"}
            error={formErrors.route_rname}
          />
        </div>
        <div className="col-span-6">
          <Dropdown
            label="Contact"
            options={cntct_Options}
            value={formData.rtcnt_cntct}
            onChange={(e) => onChange("rtcnt_cntct", e.target.value)}
            error={formErrors.rtcnt_cntct}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="cntct_cname"
          />
        </div>
        <div className="col-span-4">
          <Dropdown
            label="FF User Id"
            options={emply_Options}
            value={formData.rtcnt_emply}
            onChange={(e) => onChange("rtcnt_emply", e.target.value)}
            error={formErrors.rtcnt_emply}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="emply_cname"
          />
        </div>
        <div className="col-span-2">
          <InputText
            label="Serial No"
            placeholder="Enter serial no"
            value={formData.rtcnt_srial}
            onChange={(e) => onChange("rtcnt_srial", e.target.value)}
            error={formErrors.rtcnt_srial}
            required
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.rtcnt_actve}
          cname={formData.crusr_cname}
          cdate={formData.rtcnt_crdat}
          uname={formData.upusr_cname}
          udate={formData.rtcnt_updat}
          rvnmr={formData.rtcnt_rvnmr}
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
export default CRouteForm;
