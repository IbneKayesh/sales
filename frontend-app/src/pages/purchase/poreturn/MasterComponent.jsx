import { useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import t_po_master from "@/models/purchase/t_po_master.json";
import { useContacts } from "@/hooks/setup/useContacts";

const MasterComponent = ({
  errors,
  formData,
  handleChange,
  setCreditLimit,
}) => {
  //const { supplierList, fetchSupplierList } = useContacts();
  const supplierList = [{
    contact_name: formData.contact_name,
    contact_id: formData.contact_id,
    credit_limit: formData.credit_limit,
    allow_due: formData.allow_due,
    contact_mobile: formData.contact_mobile,
    contact_address: formData.contact_address,
  }];

  // useEffect(() => {
  //   fetchSupplierList();
  // }, []);

  const contact_id_IT = (option) => {
    return (
      <div className="flex flex-column">
        <div className="font-semibold">{option.contact_name}</div>
        <div className="text-sm text-gray-600">{option.contact_mobile}</div>
        <div className="text-sm text-gray-600">{option.contact_address}</div>
        <div className="text-sm">
          Credit Limit:{" "}
          {option.credit_limit > 0 ? (
            <>
              <i className="pi pi-credit-card mr-2 text-green-600 font-bold"></i>
              {option.credit_limit}
            </>
          ) : (
            <>
              <i className="pi pi-credit-card mr-2 text-red-600 font-bold"></i>
              {option.credit_limit}
            </>
          )}
        </div>
      </div>
    );
  };

  const contact_id_VT = (option) => {
    if (!option) {
      return "Select Contact";
    }

    return (
      <div className="flex flex-column">
        <span className="font-semibold">
          {option.credit_limit > 0 ? (
            <i className="pi pi-credit-card mr-2 text-green-600"></i>
          ) : (
            <i className="pi pi-credit-card mr-2 text-red-600"></i>
          )}
          {option.contact_name}
        </span>
      </div>
    );
  };

  const handleChange_contact_id = (e) => {
    handleChange("contact_id", e.value);
    const selectedObj = supplierList.find((c) => c.contact_id === e.value);
    setCreditLimit(selectedObj?.credit_limit || 0);
  };

  return (
    <div className="grid">
      <div className="col-12 md:col-2">
        <label htmlFor="order_no" className="block text-900 font-medium mb-2">
          {t_po_master.order_no.name} <span className="text-red-500">*</span>
        </label>
        <InputText
          name="order_no"
          value={formData.order_no}
          onChange={(e) => handleChange("order_no", e.target.value)}
          className={`w-full ${errors.order_no ? "p-invalid" : ""}`}
          placeholder={`Enter ${t_po_master.order_no.name}`}
          disabled
        />
        {errors.order_no && (
          <small className="mb-3 text-red-500">{errors.order_no}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="order_date" className="block text-900 font-medium mb-2">
          {t_po_master.order_date.name}
          <span className="text-red-500">*</span>
        </label>
        <Calendar
          name="order_date"
          value={formData.order_date ? new Date(formData.order_date) : null}
          onChange={(e) =>
            handleChange(
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
        <label htmlFor="contact_id" className="block text-900 font-medium mb-2">
          {t_po_master.contact_id.name}
          <span className="text-red-500">*</span>
        </label>
        <Dropdown
          name="contact_id"
          value={formData.contact_id}
          options={supplierList}
          optionLabel="contact_name"
          optionValue="contact_id"
          onChange={(e) => handleChange_contact_id(e)}
          className={`w-full ${errors.contact_id ? "p-invalid" : ""}`}
          placeholder={`Select ${t_po_master.contact_id.name}`}
          filter
          showClear
          itemTemplate={contact_id_IT}
          valueTemplate={contact_id_VT}
        />
        {errors.contact_id && (
          <small className="mb-3 text-red-500">{errors.contact_id}</small>
        )}
      </div>
      <div className="col-12 md:col-4">
        <label htmlFor="order_note" className="block text-900 font-medium mb-2">
          {t_po_master.order_note.name}
        </label>
        <InputText
          name="order_note"
          value={formData.order_note}
          onChange={(e) => handleChange("order_note", e.target.value)}
          className={`w-full ${errors.order_note ? "p-invalid" : ""}`}
          placeholder={`Enter ${t_po_master.order_note.name}`}
        />
        {errors.order_note && (
          <small className="mb-3 text-red-500">{errors.order_note}</small>
        )}
      </div>
      <div className="col-12 md:col-1">
        <label htmlFor="is_posted" className="block text-900 font-medium mb-2">
          {t_po_master.is_posted.name}
        </label>
        <Checkbox
          name="is_posted"
          checked={formData.is_posted === 1}
          onChange={(e) => handleChange("is_posted", e.checked ? 1 : 0)}
          className={errors.is_posted ? "p-invalid" : ""}
        />
        {errors.is_posted && (
          <small className="text-red-500">{errors.is_posted}</small>
        )}
      </div>
    </div>
  );
};

export default MasterComponent;