import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import t_bank_accounts from "@/models/accounts/t_bank_accounts.json";

const BankAccountFormComponent = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
}) => {
  return (
    <div className="p-1">
      <div className="grid">
        <div className="col-12 md:col-3">
          <label
            htmlFor="bank_name"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_accounts.bank_name.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <InputText
            name="bank_name"
            value={formData.bank_name}
            onChange={(e) => onChange("bank_name", e.target.value)}
            className={`w-full ${errors.bank_name ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_bank_accounts.bank_name.name}`}
          />
          {errors.bank_name && (
            <small className="mb-3 text-red-500">{errors.bank_name}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="bank_branch"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_accounts.bank_branch.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <InputText
            name="bank_branch"
            value={formData.bank_branch}
            onChange={(e) => onChange("bank_branch", e.target.value)}
            className={`w-full ${errors.bank_branch ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_bank_accounts.bank_branch.name}`}
          />
          {errors.bank_branch && (
            <small className="mb-3 text-red-500">{errors.bank_branch}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="account_name"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_accounts.account_name.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <InputText
            name="account_name"
            value={formData.account_name}
            onChange={(e) => onChange("account_name", e.target.value)}
            className={`w-full ${errors.account_name ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_bank_accounts.account_name.name}`}
          />
          {errors.account_name && (
            <small className="mb-3 text-red-500">{errors.account_name}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="account_number"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_accounts.account_number.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <InputText
            name="account_number"
            value={formData.account_number}
            onChange={(e) => onChange("account_number", e.target.value)}
            className={`w-full ${errors.account_number ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_bank_accounts.account_number.name}`}
          />
          {errors.account_number && (
            <small className="mb-3 text-red-500">{errors.account_number}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="opening_date"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_accounts.opening_date.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <Calendar
            name="opening_date"
            value={
              formData.opening_date ? new Date(formData.opening_date) : null
            }
            onChange={(e) =>
              onChange(
                "opening_date",
                e.value ? e.value.toISOString().split("T")[0] : ""
              )
            }
            className={`w-full ${errors.opening_date ? "p-invalid" : ""}`}
            dateFormat="yy-mm-dd"
            placeholder={`Select ${t_bank_accounts.opening_date.name}`}
          />
          {errors.opening_date && (
            <small className="mb-3 text-red-500">{errors.opening_date}</small>
          )}
        </div>
        <div className="col-12 md:col-4">
          <label
            htmlFor="current_balance"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_accounts.current_balance.name}
          </label>
          <InputNumber
            name="current_balance"
            value={formData.current_balance}
            onValueChange={(e) => onChange("current_balance", e.value)}
            mode="currency"
            currency="BDT"
            locale="en-US"
            className={`w-full ${errors.current_balance ? "p-invalid" : ""}`}
            disabled
          />
          {errors.current_balance && (
            <small className="mb-3 text-red-500">
              {errors.current_balance}
            </small>
          )}
        </div>
        <div className="col-12 md:col-4">
          <label
            htmlFor="is_default"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_accounts.is_default.name}
          </label>
          <div className="flex align-items-center">
            <Checkbox
              inputId="is_default"
              name="is_default"
              checked={formData.is_default === 1}
              onChange={(e) => onChange("is_default", e.checked ? 1 : 0)}
              className={`${errors.is_default ? "p-invalid" : ""}`}
            />
            <label htmlFor="is_default" className="ml-2">
              Yes
            </label>
          </div>
          {errors.is_default && (
            <small className="mb-3 text-red-500">{errors.is_default}</small>
          )}
        </div>
        <div className="col-12">
          <div className="flex flex-row-reverse flex-wrap">
            <Button
              type="button"
              onClick={(e) => onSave(e)}
              label={formData.account_id ? "Update" : "Save"}
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

export default BankAccountFormComponent;
