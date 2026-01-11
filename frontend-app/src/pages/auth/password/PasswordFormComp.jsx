import { Button } from "primereact/button";
import { Password } from "primereact/password";

const PasswordFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <div className="col-12">
          <label
            htmlFor="pswrd_current"
            className="block text-900 font-medium mb-2"
          >
            Current Password <span className="text-red-500">*</span>
          </label>
          <Password
            name="pswrd_current"
            value={formData.pswrd_current}
            onChange={(e) => onChange("pswrd_current", e.target.value)}
            className={`w-full ${errors.pswrd_current ? "p-invalid" : ""}`}
            placeholder="Enter current password"
            feedback={false}
            toggleMask
            style={{ width: "100%" }}
            inputStyle={{ width: "100%" }}
          />
          {errors.pswrd_current && (
            <small className="mb-3 text-red-500">{errors.pswrd_current}</small>
          )}
        </div>
        <div className="col-12">
          <label
            htmlFor="pswrd_new"
            className="block text-900 font-medium mb-2"
          >
            New Password <span className="text-red-500">*</span>
          </label>
          <Password
            name="pswrd_new"
            value={formData.pswrd_new}
            onChange={(e) => onChange("pswrd_new", e.target.value)}
            className={`w-full ${errors.pswrd_new ? "p-invalid" : ""}`}
            placeholder="Enter new password"
            feedback={false}
            toggleMask
            style={{ width: "100%" }}
            inputStyle={{ width: "100%" }}
          />
          {errors.pswrd_new && (
            <small className="mb-3 text-red-500">{errors.pswrd_new}</small>
          )}
        </div>
        <div className="col-12">
          <label
            htmlFor="pswrd_confirm"
            className="block text-900 font-medium mb-2"
          >
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <Password
            name="pswrd_confirm"
            value={formData.pswrd_confirm}
            onChange={(e) => onChange("pswrd_confirm", e.target.value)}
            className={`w-full ${errors.pswrd_confirm ? "p-invalid" : ""}`}
            placeholder="Confirm new password"
            feedback={false}
            toggleMask
            style={{ width: "100%" }}
            inputStyle={{ width: "100%" }}
          />
          {errors.pswrd_confirm && (
            <small className="mb-3 text-red-500">{errors.pswrd_confirm}</small>
          )}
        </div>
        <div className="col-12">
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

export default PasswordFormComp;
