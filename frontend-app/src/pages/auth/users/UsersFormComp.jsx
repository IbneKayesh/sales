import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import tmab_users from "@/models/auth/tmab_users.json";

const UsersFormComp = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
  roleOptions,
  businessOptions,
}) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-3">
        <label htmlFor="users_email" className="block text-900 font-medium mb-2">
          {tmab_users.users_email.label} <span className="text-red-500">*</span>
        </label>
        <InputText
          name="users_email"
          value={formData.users_email}
          onChange={(e) => onChange("users_email", e.target.value)}
          className={`w-full ${errors.users_email ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmab_users.users_email.label}`}
        />
        {errors.users_email && (
          <small className="mb-3 text-red-500">{errors.users_email}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="users_pswrd"
          className="block text-900 font-medium mb-2"
        >
          {tmab_users.users_pswrd.label} <span className="text-red-500">*</span>
        </label>
        <InputText
          name="users_pswrd"
          type="password"
          value={formData.users_pswrd}
          onChange={(e) => onChange("users_pswrd", e.target.value)}
          className={`w-full ${errors.users_pswrd ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmab_users.users_pswrd.label}`}
        />
        {errors.users_pswrd && (
          <small className="mb-3 text-red-500">{errors.users_pswrd}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="users_recky"
          className="block text-900 font-medium mb-2"
        >
          {tmab_users.users_recky.label} <span className="text-red-500">*</span>
        </label>
        <InputText
          name="users_recky"
          value={formData.users_recky}
          onChange={(e) => onChange("users_recky", e.target.value)}
          className={`w-full ${errors.users_recky ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmab_users.users_recky.label}`}
        />
        {errors.users_recky && (
          <small className="mb-3 text-red-500">{errors.users_recky}</small>
        )}
      </div>
      <div className="col-12 md:col-3">
        <label
          htmlFor="users_oname"
          className="block text-900 font-medium mb-2"
        >
          {tmab_users.users_oname.label} <span className="text-red-500">*</span>
        </label>
        <InputText
          name="users_oname"
          value={formData.users_oname}
          onChange={(e) => onChange("users_oname", e.target.value)}
          className={`w-full ${errors.users_oname ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmab_users.users_oname.label}`}
        />
        {errors.users_oname && (
          <small className="mb-3 text-red-500">{errors.users_oname}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="users_cntct"
          className="block text-900 font-medium mb-2"
        >
          {tmab_users.users_cntct.label} <span className="text-red-500">*</span>
        </label>
        <InputText
          name="users_cntct"
          value={formData.users_cntct}
          onChange={(e) => onChange("users_cntct", e.target.value)}
          className={`w-full ${errors.users_cntct ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmab_users.users_cntct.label}`}
        />
        {errors.users_cntct && (
          <small className="mb-3 text-red-500">{errors.users_cntct}</small>
        )}
      </div>
      <div className="col-12 md:col-3">
        <label
          htmlFor="users_bsins"
          className="block text-900 font-medium mb-2"
        >
          {tmab_users.users_bsins.label} <span className="text-red-500">*</span>
        </label>
        <Dropdown
          name="users_bsins"
          value={formData.users_bsins}
          options={businessOptions}
          onChange={(e) => onChange("users_bsins", e.value)}
          className={`w-full ${errors.users_bsins ? "p-invalid" : ""}`}
          placeholder={`Select ${tmab_users.users_bsins.label}`}
        />
        {errors.users_bsins && (
          <small className="mb-3 text-red-500">{errors.users_bsins}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="users_drole"
          className="block text-900 font-medium mb-2"
        >
          {tmab_users.users_drole.label} <span className="text-red-500">*</span>
        </label>
        <Dropdown
          name="users_drole"
          value={formData.users_drole}
          options={roleOptions}
          onChange={(e) => onChange("users_drole", e.value)}
          className={`w-full ${errors.users_drole ? "p-invalid" : ""}`}
          placeholder={`Select ${tmab_users.users_drole.label}`}
        />
        {errors.users_drole && (
          <small className="mb-3 text-red-500">{errors.users_drole}</small>
        )}
      </div>
      <div className="col-12 md:col-3">
        <label
          htmlFor="users_wctxt"
          className="block text-900 font-medium mb-2"
        >
          {tmab_users.users_wctxt.label}
        </label>
        <InputText
          name="users_wctxt"
          value={formData.users_wctxt}
          onChange={(e) => onChange("users_wctxt", e.target.value)}
          className={`w-full ${errors.users_wctxt ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmab_users.users_wctxt.label}`}
        />
        {errors.users_wctxt && (
          <small className="mb-3 text-red-500">{errors.users_wctxt}</small>
        )}
      </div>
      <div className="col-12 md:col-4">
        <label
          htmlFor="users_notes"
          className="block text-900 font-medium mb-2"
        >
          {tmab_users.users_notes.label}
        </label>
        <InputText
          name="users_notes"
          value={formData.users_notes}
          onChange={(e) => onChange("users_notes", e.target.value)}
          className={`w-full ${errors.users_notes ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmab_users.users_notes.label}`}
        />
        {errors.users_notes && (
          <small className="mb-3 text-red-500">{errors.users_notes}</small>
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
  );
};

export default UsersFormComp;