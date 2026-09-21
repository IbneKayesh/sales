import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Dropdown from "@/components/Dropdown";
import AuditData from "@/components/AuditData";
import InputLabel from "@/components/InputLabel";
import { IconClose, IconSave } from "@/icons";
import { day_Options } from "@/utils/vtable";

const DRouteForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
  dzone_Options,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-4">
          <InputText
            label="Route Name"
            placeholder="Enter route name"
            value={formData.route_rname}
            onChange={(e) => onChange("route_rname", e.target.value)}
            error={formErrors.route_rname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Day"
            options={day_Options}
            value={formData.route_dname}
            onChange={(e) => onChange("route_dname", e.target.value)}
            error={formErrors.route_dname}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputText
            label="Serial No"
            placeholder="Enter serial no"
            value={formData.route_srial}
            onChange={(e) => onChange("route_srial", e.target.value)}
            error={formErrors.route_srial}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputLabel
            label="Territory"
            value={formData.trtry_cname || "Territory name is required"}
            error={formErrors.route_trtry}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.route_actve}
          cname={formData.crusr_cname}
          cdate={formData.route_crdat}
          uname={formData.upusr_cname}
          udate={formData.route_updat}
          rvnmr={formData.route_rvnmr}
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
export default DRouteForm;
