import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import t_users from "@/models/setup/t_users.json";

const UsersFormComponent = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
  roleOptions,
}) => {
  return (
    <div className="p-1">
      <div className="grid">
        <div className="col-12 md:col-3">
          <label htmlFor="user_name" className="block text-900 font-medium mb-2">
            {t_users.user_name.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <InputText
            name="user_name"
            value={formData.user_name}
            onChange={(e) => onChange("user_name", e.target.value)}
            className={`w-full ${errors.user_name ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_users.user_name.name}`}
          />
          {errors.user_name && (
            <small className="mb-3 text-red-500">{errors.user_name}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label htmlFor="user_password" className="block text-900 font-medium mb-2">
            {t_users.user_password.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <InputText
            name="user_password"
            value={formData.user_password}
            onChange={(e) => onChange("user_password", e.target.value)}
            className={`w-full ${errors.user_password ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_users.user_password.name}`}
          />
          {errors.user_password && (
            <small className="mb-3 text-red-500">{errors.user_password}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label htmlFor="user_mobile" className="block text-900 font-medium mb-2">
            {t_users.user_mobile.name} <span className="text-red-500">*</span>
          </label>
          <InputText
            name="user_mobile"
            value={formData.user_mobile}
            onChange={(e) => onChange("user_mobile", e.target.value)}
            className={`w-full ${errors.user_mobile ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_users.user_mobile.name}`}
          />
          {errors.user_mobile && (
            <small className="mb-3 text-red-500">{errors.user_mobile}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label htmlFor="user_email" className="block text-900 font-medium mb-2">
            {t_users.user_email.name} <span className="text-red-500">*</span>
          </label>
          <InputText
            name="user_email"
            value={formData.user_email}
            onChange={(e) => onChange("user_email", e.target.value)}
            className={`w-full ${errors.user_email ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_users.user_email.name}`}
          />
          {errors.user_email && (
            <small className="mb-3 text-red-500">{errors.user_email}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label htmlFor="user_role" className="block text-900 font-medium mb-2">
            {t_users.user_role.name} <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="user_role"
            value={formData.user_role}
            options={roleOptions}
            onChange={(e) => onChange("user_role", e.value)}
            className={`w-full ${errors.user_role ? "p-invalid" : ""}`}
            placeholder={`Select ${t_users.user_role.name}`}
          />
          {errors.user_role && (
            <small className="mb-3 text-red-500">{errors.user_role}</small>
          )}
        </div>
        <div className="col-12">
          <div className="flex flex-row-reverse flex-wrap">
            <Button
              type="button"
              onClick={(e) => onSave(e)}
              label={formData.user_id ? "Update" : "Save"}
              icon={isBusy ? "pi pi-spin pi-spinner" : "pi pi-check"}
              severity="success"
              size="small"
              loading={isBusy}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersFormComponent;
