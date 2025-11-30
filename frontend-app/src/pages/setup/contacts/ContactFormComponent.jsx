import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import t_contacts from "@/models/setup/t_contacts.json";

const ContactFormComponent = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
  contactTypeOptions,
}) => {
  return (
    <div className="p-1">
      <div className="grid">
        <div className="col-12 md:col-3">
          <label
            htmlFor="contact_name"
            className="block text-900 font-medium mb-2"
          >
            {t_contacts.contact_name.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <InputText
            name="contact_name"
            value={formData.contact_name}
            onChange={(e) => onChange("contact_name", e.target.value)}
            className={`w-full ${errors.contact_name ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_contacts.contact_name.name}`}
          />
          {errors.contact_name && (
            <small className="mb-3 text-red-500">{errors.contact_name}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="contact_mobile"
            className="block text-900 font-medium mb-2"
          >
            {t_contacts.contact_mobile.name}
          </label>
          <InputText
            name="contact_mobile"
            value={formData.contact_mobile}
            onChange={(e) => onChange("contact_mobile", e.target.value)}
            className={`w-full ${errors.contact_mobile ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_contacts.contact_mobile.name}`}
          />
          {errors.contact_mobile && (
            <small className="mb-3 text-red-500">
              {errors.contact_mobile}
            </small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="contact_email"
            className="block text-900 font-medium mb-2"
          >
            {t_contacts.contact_email.name}
          </label>
          <InputText
            name="contact_email"
            value={formData.contact_email}
            onChange={(e) => onChange("contact_email", e.target.value)}
            className={`w-full ${errors.contact_email ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_contacts.contact_email.name}`}
          />
          {errors.contact_email && (
            <small className="mb-3 text-red-500">
              {errors.contact_email}
            </small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="contact_address"
            className="block text-900 font-medium mb-2"
          >
            {t_contacts.contact_address.name}
          </label>
          <InputText
            name="contact_address"
            value={formData.contact_address}
            onChange={(e) => onChange("contact_address", e.target.value)}
            className={`w-full ${errors.contact_address ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_contacts.contact_address.name}`}
          />
          {errors.contact_address && (
            <small className="mb-3 text-red-500">
              {errors.contact_address}
            </small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="contact_type"
            className="block text-900 font-medium mb-2"
          >
            {t_contacts.contact_type.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="contact_type"
            value={formData.contact_type}
            options={contactTypeOptions}
            onChange={(e) => onChange("contact_type", e.value)}
            className={`w-full ${errors.contact_type ? "p-invalid" : ""}`}
            placeholder={`Select ${t_contacts.contact_type.name}`}
          />
          {errors.contact_type && (
            <small className="mb-3 text-red-500">{errors.contact_type}</small>
          )}
        </div>
        <div className="col-12">
          <div className="flex flex-row-reverse flex-wrap">
            <Button
              type="button"
              onClick={(e) => onSave(e)}
              label={formData.contact_id ? "Update" : "Save"}
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

export default ContactFormComponent;
