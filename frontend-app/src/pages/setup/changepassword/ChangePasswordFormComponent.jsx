import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";

const ChangePasswordFormComponent = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
  onClear,
}) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-3">
        <label htmlFor="currentPassword" className="block text-900 font-medium mb-2">
          Current Password <span className="text-red-500">*</span>
        </label>
        <Password
          name="currentPassword"
          value={formData.currentPassword}
          onChange={(e) => onChange("currentPassword", e.target.value)}
          className={`w-full ${errors.currentPassword ? "p-invalid" : ""}`}
          placeholder="Enter current password"
          feedback={false}
          toggleMask
          style={{ width: "100%" }}
          inputStyle={{ width: "100%" }}
        />
        {errors.currentPassword && (
          <small className="mb-3 text-red-500">{errors.currentPassword}</small>
        )}
      </div>
      <div className="col-12 md:col-3">
        <label htmlFor="newPassword" className="block text-900 font-medium mb-2">
          New Password <span className="text-red-500">*</span>
        </label>
        <Password
          name="newPassword"
          value={formData.newPassword}
          onChange={(e) => onChange("newPassword", e.target.value)}
          className={`w-full ${errors.newPassword ? "p-invalid" : ""}`}
          placeholder="Enter new password"
          feedback={false}
          toggleMask
          style={{ width: "100%" }}
          inputStyle={{ width: "100%" }}
        />
        {errors.newPassword && (
          <small className="mb-3 text-red-500">{errors.newPassword}</small>
        )}
      </div>
      <div className="col-12 md:col-3">
        <label htmlFor="confirmPassword" className="block text-900 font-medium mb-2">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <Password
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={(e) => onChange("confirmPassword", e.target.value)}
          className={`w-full ${errors.confirmPassword ? "p-invalid" : ""}`}
          placeholder="Confirm new password"
          feedback={false}
          toggleMask
          style={{ width: "100%" }}
          inputStyle={{ width: "100%" }}
        />
        {errors.confirmPassword && (
          <small className="mb-3 text-red-500">{errors.confirmPassword}</small>
        )}
      </div>
      <div className="col-12">
        <div className="flex flex-row-reverse flex-wrap gap-2">
          <Button
            type="button"
            onClick={onSave}
            label="Change Password"
            icon={isBusy ? "pi pi-spin pi-spinner" : "pi pi-check"}
            severity="success"
            size="small"
            loading={isBusy}
          />
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordFormComponent;
