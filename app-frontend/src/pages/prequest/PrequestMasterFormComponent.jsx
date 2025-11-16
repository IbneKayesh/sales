import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import t_po_master from "@/models/prequest/t_po_master.json";
import { useContacts } from "@/hooks/setup/useContacts";

const PrequestMasterFormComponent = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
  poTypeOptions,
  refNoOptions,
}) => {
  const { contacts } = useContacts();

  return (
    <div className="p-1">
      <div className="grid">
        <div className="col-12 md:col-3">
          <label
            htmlFor="order_type"
            className="block text-900 font-medium mb-2"
          >
            {t_po_master.t_po_master.order_type.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="order_type"
            value={formData.order_type}
            options={poTypeOptions}
            onChange={(e) => onChange("order_type", e.value)}
            className={`w-full ${errors.order_type ? "p-invalid" : ""}`}
            placeholder={`Select ${t_po_master.t_po_master.order_type.name}`}
          />
          {errors.order_type && (
            <small className="mb-3 text-red-500">{errors.order_type}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label htmlFor="order_no" className="block text-900 font-medium mb-2">
            {t_po_master.t_po_master.order_no.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <InputText
            name="order_no"
            value={formData.order_no}
            onChange={(e) => onChange("order_no", e.target.value)}
            className={`w-full ${errors.order_no ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_po_master.t_po_master.order_no.name}`}
            disabled
          />
          {errors.order_no && (
            <small className="mb-3 text-red-500">{errors.order_no}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="order_date"
            className="block text-900 font-medium mb-2"
          >
            {t_po_master.t_po_master.order_date.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <Calendar
            name="order_date"
            value={formData.order_date ? new Date(formData.order_date) : null}
            onChange={(e) =>
              onChange(
                "order_date",
                e.value ? e.value.toISOString().split("T")[0] : ""
              )
            }
            className={`w-full ${errors.order_date ? "p-invalid" : ""}`}
            dateFormat="yy-mm-dd"
            placeholder={`Select ${t_po_master.t_po_master.order_date.name}`}
          />
          {errors.order_date && (
            <small className="mb-3 text-red-500">{errors.order_date}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="contacts_id"
            className="block text-900 font-medium mb-2"
          >
            {t_po_master.t_po_master.contacts_id.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="contacts_id"
            value={formData.contacts_id}
            options={contacts
              .filter(
                (contact) =>
                  contact.contact_type === "Both" ||
                  contact.contact_type === "Supplier"
              )
              .map((contact) => ({
                label: contact.contact_name,
                value: contact.contact_id,
              }))}
            onChange={(e) => onChange("contacts_id", e.value)}
            className={`w-full ${errors.contacts_id ? "p-invalid" : ""}`}
            placeholder={`Select ${t_po_master.t_po_master.contacts_id.name}`}
            optionLabel="label"
            optionValue="value"
          />
          {errors.contacts_id && (
            <small className="mb-3 text-red-500">{errors.contacts_id}</small>
          )}
        </div>

        <div className="col-12 md:col-3">
          <label htmlFor="ref_no" className="block text-900 font-medium mb-2">
            {t_po_master.t_po_master.ref_no.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="ref_no"
            value={formData.ref_no}
            options={refNoOptions}
            onChange={(e) => onChange("ref_no", e.value)}
            className={`w-full ${errors.ref_no ? "p-invalid" : ""}`}
            placeholder={`Select ${t_po_master.t_po_master.ref_no.name}`}
            optionLabel="label"
            optionValue="value"
          />
          {errors.ref_no && (
            <small className="mb-3 text-red-500">{errors.ref_no}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="order_note"
            className="block text-900 font-medium mb-2"
          >
            {t_po_master.t_po_master.order_note.name}
          </label>
          <InputText
            name="order_note"
            value={formData.order_note}
            onChange={(e) => onChange("order_note", e.target.value)}
            className={`w-full ${errors.order_note ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_po_master.t_po_master.order_note.name}`}
          />
          {errors.order_note && (
            <small className="mb-3 text-red-500">{errors.order_note}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="total_amount"
            className="block text-900 font-medium mb-2"
          >
            {t_po_master.t_po_master.total_amount.name}
          </label>
          <InputNumber
            name="total_amount"
            value={formData.total_amount}
            onValueChange={(e) => onChange("total_amount", e.value)}
            mode="currency"
            currency="BDT"
            locale="en-US"
            className={`w-full ${errors.total_amount ? "p-invalid" : ""}`}
            disabled
          />
          {errors.total_amount && (
            <small className="mb-3 text-red-500">{errors.total_amount}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="paid_amount"
            className="block text-900 font-medium mb-2"
          >
            {t_po_master.t_po_master.paid_amount.name}
          </label>
          <InputNumber
            name="paid_amount"
            value={formData.paid_amount}
            onValueChange={(e) => onChange("paid_amount", e.value)}
            mode="currency"
            currency="BDT"
            locale="en-US"
            className={`w-full ${errors.paid_amount ? "p-invalid" : ""}`}
          />
          {errors.paid_amount && (
            <small className="mb-3 text-red-500">{errors.paid_amount}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label htmlFor="is_paid" className="block text-900 font-medium mb-2">
            {t_po_master.t_po_master.is_paid.name}
          </label>
          <div className="flex align-items-center">
            <Checkbox
              name="is_paid"
              checked={formData.is_paid}
              onChange={(e) => onChange("is_paid", e.checked)}
              className={errors.is_paid ? "p-invalid" : ""}
              disabled
            />
            <label htmlFor="is_paid" className="ml-2">
              Paid
            </label>
          </div>
          {errors.is_paid && (
            <small className="mb-3 text-red-500">{errors.is_paid}</small>
          )}
        </div>
        <div className="col-12">
          <div className="flex flex-row-reverse flex-wrap">
            <Button
              type="button"
              onClick={(e) => onSave(e)}
              label={formData.po_master_id ? "Update" : "Save"}
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

export default PrequestMasterFormComponent;
