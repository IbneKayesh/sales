import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Dropdown from "@/components/Dropdown";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";
import { bool_Options } from "@/utils/vtable.js";

const EmployeeForm = ({
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
        <div className="col-span-3">
          <InputText
            label="Employee Code"
            placeholder="Enter employee code"
            value={formData.emply_ccode}
            onChange={(e) => onChange("emply_ccode", e.target.value)}
            error={formErrors.emply_ccode}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputText
            label="Card No"
            placeholder="Enter card number"
            value={formData.emply_crdno}
            onChange={(e) => onChange("emply_crdno", e.target.value)}
            error={formErrors.emply_crdno}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputText
            label="Employee Name"
            placeholder="Enter employee name"
            value={formData.emply_cname}
            onChange={(e) => onChange("emply_cname", e.target.value)}
            error={formErrors.emply_cname}
            required
            disabled={readOnly}
          />
        </div>
      </div>

      <div className="grid">
        <div className="col-span-4">
          <InputText
            label="Contact No"
            placeholder="Enter contact number"
            value={formData.emply_cntno}
            onChange={(e) => onChange("emply_cntno", e.target.value)}
            error={formErrors.emply_cntno}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Email"
            placeholder="email@example.com"
            value={formData.emply_email}
            onChange={(e) => onChange("emply_email", e.target.value)}
            error={formErrors.emply_email}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Is Permanent"
            options={bool_Options}
            value={formData.emply_isprm}
            onChange={(e) => onChange("emply_isprm", e.target.value)}
            error={formErrors.emply_isprm}
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputText
            label="User Role"
            placeholder="Enter role"
            value={formData.emply_urole}
            onChange={(e) => onChange("emply_urole", e.target.value)}
            error={formErrors.emply_urole}
            disabled={readOnly}
          />
        </div>
      </div>

      {formData?.id && (
        <AuditData
          actve={formData.emply_actve}
          cname={formData.crusr_cname}
          cdate={formData.emply_crdat}
          uname={formData.upusr_cname}
          udate={formData.emply_updat}
          rvnmr={formData.emply_rvnmr}
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
export default EmployeeForm;
