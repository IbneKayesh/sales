import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import t_payments from "@/models/accounts/t_payments.json";
import { useContacts } from "@/hooks/setup/useContacts";
import { paymentModeOptions } from "@/utils/vtable";

const PaymentFormComponent = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
}) => {
  const { contactPaymentList } = useContacts();
  const [paymentContacts, setPaymentContacts] = useState([]);
  const paymentTypeOptions = [
    { label: "Expense", value: "Expense" },
    { label: "Income", value: "Income" },
    { label: "Supplier Advance", value: "Supplier Advance" },
    { label: "Customer Advance", value: "Customer Advance" },
    { label: "Cash Deposit", value: "Cash Deposit" },
    { label: "Cash Withdraw", value: "Cash Withdraw" },
  ];
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);

  const handlePaymentTypeChange = (e) => {
    setSelectedPaymentType(e.value);
    if (e.value === "Expense") {
      const supplierContacts = contactPaymentList.filter(
        (contact) => contact.contact_type === "Expense"
      );
      setPaymentContacts(supplierContacts);
    }
    if (e.value === "Income") {
      const supplierContacts = contactPaymentList.filter(
        (contact) => contact.contact_type === "Income"
      );
      setPaymentContacts(supplierContacts);
    }
    if (e.value === "Supplier Advance") {
      const supplierContacts = contactPaymentList.filter(
        (contact) => contact.contact_type === "Supplier"
      );
      setPaymentContacts(supplierContacts);
    }
    if (e.value === "Customer Advance") {
      const customerContacts = contactPaymentList.filter(
        (contact) => contact.contact_type === "Customer"
      );
      setPaymentContacts(customerContacts);
    }
    if (e.value === "Cash Deposit" || e.value === "Cash Withdraw") {
      const customerContacts = contactPaymentList.filter(
        (contact) => contact.contact_type === "Cash"
      );
      setPaymentContacts(customerContacts);
    }
  };

  const contact_id_IT = (option) => {
    return (
      <div className="flex flex-column">
        <div className="font-semibold">{option.contact_name}</div>
        <div className="text-sm text-gray-600">{option.contact_mobile}</div>
        <div className="text-sm text-gray-600">{option.contact_address}</div>
        <div className="text-sm">
          Due:{" "}
          {option.allow_due ? (
            <>
              <i className="pi pi-credit-card mr-2 text-green-600 font-bold"></i>
              Yes
            </>
          ) : (
            <>
              <i className="pi pi-credit-card mr-2 text-red-600 font-bold"></i>
              No
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
          {option.allow_due ? (
            <i className="pi pi-credit-card mr-2 text-green-600"></i>
          ) : (
            <i className="pi pi-credit-card mr-2 text-red-600"></i>
          )}
          {option.contact_name}
        </span>
      </div>
    );
  };

  return (
    <>
      <div className="grid">
        <div className="col-12 md:col-1">
          <label
            htmlFor="payment_type"
            className="block text-900 font-medium mb-2"
          >
            Payment Type
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="payment_type"
            value={selectedPaymentType}
            options={paymentTypeOptions}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => handlePaymentTypeChange(e)}
            className={`w-full`}
            placeholder={`Enter Payment Type`}
          />
        </div>

        <div className="col-12 md:col-3">
          <label
            htmlFor="contact_id"
            className="block text-900 font-medium mb-2"
          >
            Account
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="contact_id"
            value={formData.contact_id}
            options={paymentContacts}
            optionLabel="contact_name"
            optionValue="contact_id"
            onChange={(e) => onChange("contact_id", e.value)}
            className={`w-full ${errors.contact_id ? "p-invalid" : ""}`}
            placeholder={`Select ${t_payments.contact_id.name}`}
            filter
            showClear
            itemTemplate={contact_id_IT}
            valueTemplate={contact_id_VT}
          />
          {errors.contact_id && (
            <small className="mb-3 text-red-500">{errors.contact_id}</small>
          )}
        </div>
        <div className="col-12 md:col-1">
          <label
            htmlFor="payment_mode"
            className="block text-900 font-medium mb-2"
          >
            {t_payments.payment_mode.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="payment_mode"
            value={formData.payment_mode}
            options={paymentModeOptions}
            onChange={(e) => onChange("payment_mode", e.value)}
            className={`w-full ${errors.payment_mode ? "p-invalid" : ""}`}
            placeholder={`Select ${t_payments.payment_mode.name}`}
            optionLabel="label"
            optionValue="value"
          />
          {errors.payment_mode && (
            <small className="mb-3 text-red-500">{errors.payment_mode}</small>
          )}
        </div>

        <div className="col-12 md:col-1">
          <label
            htmlFor="payment_date"
            className="block text-900 font-medium mb-2"
          >
            {t_payments.payment_date.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <Calendar
            name="payment_date"
            value={
              formData.payment_date ? new Date(formData.payment_date) : null
            }
            onChange={(e) =>
              onChange(
                "payment_date",
                e.value ? e.value.toISOString().split("T")[0] : ""
              )
            }
            className={`w-full ${errors.payment_date ? "p-invalid" : ""}`}
            dateFormat="yy-mm-dd"
            placeholder={`Select ${t_payments.payment_date.name}`}
            disabled
          />
          {errors.payment_date && (
            <small className="mb-3 text-red-500">{errors.payment_date}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="payment_amount"
            className="block text-900 font-medium mb-2"
          >
            {t_payments.payment_amount.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <InputNumber
            name="payment_amount"
            value={formData.payment_amount}
            onValueChange={(e) => onChange("payment_amount", e.value)}
            mode="currency"
            currency="BDT"
            locale="en-US"
            className={`${errors.payment_amount ? "p-invalid" : ""}`}
            style={{ width: "100%" }}
            inputStyle={{ width: "100%" }}
          />
          {errors.payment_amount && (
            <small className="mb-3 text-red-500">{errors.payment_amount}</small>
          )}
        </div>

        <div className="col-12 md:col-2">
          <label
            htmlFor="payment_note"
            className="block text-900 font-medium mb-2"
          >
            {t_payments.payment_note.name}
          </label>
          <InputText
            name="payment_note"
            value={formData.payment_note}
            onChange={(e) => onChange("payment_note", e.target.value)}
            className={`w-full ${errors.payment_note ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_payments.payment_note.name}`}
          />
          {errors.payment_note && (
            <small className="mb-3 text-red-500">{errors.payment_note}</small>
          )}
        </div>
        <div className="col-12 md:col-1">
          <label htmlFor="ref_no" className="block text-900 font-medium mb-2">
            {t_payments.ref_no.name}
          </label>
          <InputText
            name="ref_no"
            value={formData.ref_no}
            onChange={(e) => onChange("ref_no", e.target.value)}
            className={`w-full ${errors.ref_no ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_payments.ref_no.name}`}
            disabled
          />
          {errors.ref_no && (
            <small className="mb-3 text-red-500">{errors.ref_no}</small>
          )}
        </div>
      </div>

      <hr className="my-2" />

      {/* <div className="grid">
        <div className="col-12 md:col-2">
          <label
            htmlFor="account_id"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_payments.account_id.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="account_id"
            value={formData.account_id}
            options={bankAccountList.map((account) => ({
              label: `${account.account_name} (${account.bank_name})`,
              value: account.account_id,
            }))}
            onChange={(e) => onChange("account_id", e.value)}
            className={`w-full ${errors.account_id ? "p-invalid" : ""}`}
            placeholder={`Select ${t_bank_payments.account_id.name}`}
            optionLabel="label"
            optionValue="value"
          />
          {errors.account_id && (
            <small className="mb-3 text-red-500">{errors.account_id}</small>
          )}
        </div>




        <div className="col-12">
          <div className="flex flex-row-reverse flex-wrap">
            <Button
              type="button"
              onClick={(e) => onSave(e)}
              label={formData.payment_id ? "Update" : "Save"}
              icon={isBusy ? "pi pi-spin pi-spinner" : "pi pi-check"}
              severity="success"
              size="small"
              loading={isBusy}
            />
          </div>
        </div>
      </div> */}
    </>
  );
};

export default PaymentFormComponent;
