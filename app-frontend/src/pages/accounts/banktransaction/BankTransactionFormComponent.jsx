import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import t_bank_trans from "@/models/accounts/t_bank_trans.json";

const BankTransactionFormComponent = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
  bankAccounts,
  transGroups,
  contactsBank,
}) => {

  return (
    <div className="p-1">
      <div className="grid">
        <div className="col-12 md:col-3">
          <label
            htmlFor="bank_account_id"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_trans.t_bank_trans.bank_account_id.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="bank_account_id"
            value={formData.bank_account_id}
            options={bankAccounts.map((account) => ({
              label: `${account.account_name} (${account.bank_name})`,
              value: account.bank_account_id,
            }))}
            onChange={(e) => onChange("bank_account_id", e.value)}
            className={`w-full ${errors.bank_account_id ? "p-invalid" : ""}`}
            placeholder={`Select ${t_bank_trans.t_bank_trans.bank_account_id.name}`}
            optionLabel="label"
            optionValue="value"
          />
          {errors.bank_account_id && (
            <small className="mb-3 text-red-500">
              {errors.bank_account_id}
            </small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="trans_date"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_trans.t_bank_trans.trans_date.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <Calendar
            name="trans_date"
            value={
              formData.trans_date
                ? new Date(formData.trans_date)
                : null
            }
            onChange={(e) =>
              onChange(
                "trans_date",
                e.value ? e.value.toISOString().split("T")[0] : ""
              )
            }
            className={`w-full ${errors.trans_date ? "p-invalid" : ""}`}
            dateFormat="yy-mm-dd"
            placeholder={`Select ${t_bank_trans.t_bank_trans.trans_date.name}`}
          />
          {errors.trans_date && (
            <small className="mb-3 text-red-500">
              {errors.trans_date}
            </small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label htmlFor="trans_group" className="block text-900 font-medium mb-2">
            {t_bank_trans.t_bank_trans.trans_group.name} <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="trans_group"
            value={formData.trans_group}
            options={transGroups}
            onChange={(e) => onChange("trans_group", e.value)}
            className={`w-full ${errors.trans_group ? "p-invalid" : ""}`}
            placeholder={`Select ${t_bank_trans.t_bank_trans.trans_group.name}`}
          />
          {errors.trans_group && (
            <small className="mb-3 text-red-500">{errors.trans_group}</small>
          )}
        </div>
        <div className="col-12 md:col-5">
          <label htmlFor="contact_id" className="block text-900 font-medium mb-2">
            {t_bank_trans.t_bank_trans.contact_id.name} <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="contact_id"
            value={formData.contact_id}
            options={contactsBank}
            onChange={(e) => onChange("contact_id", e.value)}
            className={`w-full ${errors.contact_id ? "p-invalid" : ""}`}
            placeholder={`Select ${t_bank_trans.t_bank_trans.contact_id.name}`}
          />
          {errors.contact_id && (
            <small className="mb-3 text-red-500">{errors.contact_id}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="trans_name"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_trans.t_bank_trans.trans_name.name}
          </label>
          <InputText
            name="trans_name"
            value={formData.trans_name}
            onChange={(e) => onChange("trans_name", e.target.value)}
            className={`w-full ${errors.trans_name ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_bank_trans.t_bank_trans.trans_name.name}`}
          />
          {errors.trans_name && (
            <small className="mb-3 text-red-500">{errors.trans_name}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="ref_no"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_trans.t_bank_trans.ref_no.name}
          </label>
          <InputText
            name="ref_no"
            value={formData.ref_no}
            onChange={(e) => onChange("ref_no", e.target.value)}
            className={`w-full ${errors.ref_no ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_bank_trans.t_bank_trans.ref_no.name}`}
          />
          {errors.ref_no && (
            <small className="mb-3 text-red-500">{errors.ref_no}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="trans_details"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_trans.t_bank_trans.trans_details.name}
          </label>
          <InputText
            name="trans_details"
            value={formData.trans_details}
            onChange={(e) => onChange("trans_details", e.target.value)}
            className={`w-full ${
              errors.trans_details ? "p-invalid" : ""
            }`}
            placeholder={`Enter ${t_bank_trans.t_bank_trans.trans_details.name}`}
          />
          {errors.trans_details && (
            <small className="mb-3 text-red-500">
              {errors.trans_details}
            </small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="debit_amount"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_trans.t_bank_trans.debit_amount.name}
          </label>
          <InputNumber
            name="debit_amount"
            value={formData.debit_amount}
            onValueChange={(e) => onChange("debit_amount", e.value)}
            mode="currency"
            currency="BDT"
            locale="en-US"
            className={`w-full ${errors.debit_amount ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_bank_trans.t_bank_trans.debit_amount.name}`}
          />
          {errors.debit_amount && (
            <small className="mb-3 text-red-500">{errors.debit_amount}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="credit_amount"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_trans.t_bank_trans.credit_amount.name}
          </label>
          <InputNumber
            name="credit_amount"
            value={formData.credit_amount}
            onValueChange={(e) => onChange("credit_amount", e.value)}
            mode="currency"
            currency="BDT"
            locale="en-US"
            className={`w-full ${errors.credit_amount ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_bank_trans.t_bank_trans.credit_amount.name}`}
          />
          {errors.credit_amount && (
            <small className="mb-3 text-red-500">{errors.credit_amount}</small>
          )}
        </div>
        <div className="col-12">
          <div className="flex flex-row-reverse flex-wrap">
            <Button
              type="button"
              onClick={(e) => onSave(e)}
              label={formData.bank_transactions_id ? "Update" : "Save"}
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

export default BankTransactionFormComponent;
