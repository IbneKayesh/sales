import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import t_bank_payments from "@/models/accounts/t_bank_payments.json";
import { useBankAccounts } from "@/hooks/accounts/useBankAccounts";

const PaymentsFormComponent = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
}) => {
  const { bankAccountList } = useBankAccounts();
  return (
    <div className="p-1">
      <div className="grid">
        <div className="col-12 md:col-2">
          <span className="block text-900 font-medium mb-2">Payment Head</span>
          {formData.payment_head}
        </div>
        <div className="col-12 md:col-4">
          <span className="block text-900 font-medium mb-2">Contact</span>
          {formData.contact_name}
        </div>
        <div className="col-12 md:col-2">
          <span className="block text-900 font-medium mb-2">Ref No</span>
          {formData.ref_no}
        </div>
        <div className="col-12 md:col-2">
          <span className="block text-900 font-medium mb-2">Ref Date</span>
          {formData.ref_date}
        </div>
        <div className="col-12 md:col-2">
          <span className="block text-900 font-medium mb-2">Due Amount</span>
          <span className="text-red-500">{formData.due_amount}</span>
        </div>
      </div>

      <hr className="my-2" />

      <div className="grid">
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
        <div className="col-12 md:col-2">
          <label
            htmlFor="payment_mode"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_payments.payment_mode.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <InputText
            name="payment_mode"
            value={formData.payment_mode}
            onChange={(e) => onChange("payment_mode", e.target.value)}
            className={`w-full ${errors.payment_mode ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_bank_payments.payment_mode.name}`}
          />
          {errors.payment_mode && (
            <small className="mb-3 text-red-500">{errors.payment_mode}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="payment_date"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_payments.payment_date.name}{" "}
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
            placeholder={`Select ${t_bank_payments.payment_date.name}`}
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
            {t_bank_payments.payment_amount.name}{" "}
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
            inputStyle={{ width: "100%" }}
          />
          {errors.payment_amount && (
            <small className="mb-3 text-red-500">{errors.payment_amount}</small>
          )}
        </div>
        <div className="col-12 md:col-4">
          <label
            htmlFor="payment_note"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_payments.payment_note.name}
          </label>
          <InputText
            name="payment_note"
            value={formData.payment_note}
            onChange={(e) => onChange("payment_note", e.target.value)}
            className={`w-full ${errors.payment_note ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_bank_payments.payment_note.name}`}
          />
          {errors.payment_note && (
            <small className="mb-3 text-red-500">{errors.payment_note}</small>
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
      </div>
    </div>
  );
};

export default PaymentsFormComponent;
