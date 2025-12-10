import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import t_po_master from "@/models/purchase/t_po_master.json";
import { useContacts } from "@/hooks/setup/useContacts";

export const EntryComponent = ({ errors, formData, onChange }) => {
  const { contactCustomerList } = useContacts();

  return (
    <>
      <div className="grid">
        <div className="col-12 md:col-2">
          <label htmlFor="order_no" className="block text-900 font-medium mb-2">
            {t_po_master.order_no.name} <span className="text-red-500">*</span>
          </label>
          <InputText
            name="order_no"
            value={formData.order_no}
            onChange={(e) => onChange("order_no", e.target.value)}
            className={`w-full ${errors.order_no ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_po_master.order_no.name}`}
            disabled
          />
          {errors.order_no && (
            <small className="mb-3 text-red-500">{errors.order_no}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="order_date"
            className="block text-900 font-medium mb-2"
          >
            {t_po_master.order_date.name}
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
            placeholder={`Select ${t_po_master.order_date.name}`}
          />
          {errors.order_date && (
            <small className="mb-3 text-red-500">{errors.order_date}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="contact_id"
            className="block text-900 font-medium mb-2"
          >
            {t_po_master.contact_id.name}
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="contact_id"
            value={formData.contact_id}
            options={contactCustomerList}
            onChange={(e) => onChange("contact_id", e.value)}
            className={`w-full ${errors.contact_id ? "p-invalid" : ""}`}
            placeholder={`Select ${t_po_master.contact_id.name}`}
            optionLabel="label"
            optionValue="value"
            filter
            showClear
          />
          {errors.contact_id && (
            <small className="mb-3 text-red-500">{errors.contact_id}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label htmlFor="ref_no" className="block text-900 font-medium mb-2">
            {t_po_master.ref_no.name}
          </label>
          <InputText
            name="ref_no"
            value={formData.ref_no}
            onChange={(e) => onChange("ref_no", e.target.value)}
            className={`w-full ${errors.ref_no ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_po_master.ref_no.name}`}
          />
          {errors.ref_no && (
            <small className="mb-3 text-red-500">{errors.ref_no}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="order_note"
            className="block text-900 font-medium mb-2"
          >
            {t_po_master.order_note.name}
          </label>
          <InputText
            name="order_note"
            value={formData.order_note}
            onChange={(e) => onChange("order_note", e.target.value)}
            className={`w-full ${errors.order_note ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_po_master.order_note.name}`}
          />
          {errors.order_note && (
            <small className="mb-3 text-red-500">{errors.order_note}</small>
          )}
        </div>
        <div className="col-12 md:col-1">
          <label
            htmlFor="is_posted"
            className="block text-900 font-medium mb-2"
          >
            {t_po_master.is_posted.name}
          </label>

          <Checkbox
            name="is_posted"
            checked={formData.is_posted === 1}
            onChange={(e) => onChange("is_posted", e.checked ? 1 : 0)}
            className={errors.is_posted ? "p-invalid" : ""}
          />

          {errors.is_posted && (
            <small className="text-red-500">{errors.is_posted}</small>
          )}
        </div>
      </div>
    </>
  );
};
