import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import t_bank from "@/models/accounts/t_bank.json";

const BankFormComponent = ({ isBusy, errors, formData, onChange, onSave }) => {
  return (
    <div className="p-1">
      <div className="grid">
        <div className="col-12 md:col-5">
          <label
            htmlFor="bank_name"
            className="block text-900 font-medium mb-2"
          >
            {t_bank.t_bank.bank_name.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <InputText
            name="bank_name"
            value={formData.bank_name}
            onChange={(e) => onChange("bank_name", e.target.value)}
            className={`w-full ${errors.bank_name ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_bank.t_bank.bank_name.name}`}
          />
          {errors.bank_name && (
            <small className="mb-3 text-red-500">{errors.bank_name}</small>
          )}
        </div>
        <div className="col-12 md:col-4">
          <label
            htmlFor="bank_address"
            className="block text-900 font-medium mb-2"
          >
            {t_bank.t_bank.bank_address.name}
          </label>
          <InputText
            name="bank_address"
            value={formData.bank_address}
            onChange={(e) => onChange("bank_address", e.target.value)}
            className={`w-full ${errors.bank_address ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_bank.t_bank.bank_address.name}`}
          />
          {errors.bank_address && (
            <small className="mb-3 text-red-500">{errors.bank_address}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="routing_number"
            className="block text-900 font-medium mb-2"
          >
            {t_bank.t_bank.routing_number.name}
          </label>
          <InputText
            name="routing_number"
            value={formData.routing_number}
            onChange={(e) => onChange("routing_number", e.target.value)}
            className={`w-full ${errors.routing_number ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_bank.t_bank.routing_number.name}`}
          />
          {errors.routing_number && (
            <small className="mb-3 text-red-500">{errors.routing_number}</small>
          )}
        </div>

        <div className="col-12 md:col-4">
          <label
            htmlFor="debit_balance"
            className="block text-900 font-medium mb-2"
          >
            {t_bank.t_bank.debit_balance.name}
          </label>
          <InputNumber
            name="debit_balance"
            value={formData.debit_balance}
            onValueChange={(e) => onChange("debit_balance", e.value)}
            mode="currency"
            currency="BDT"
            locale="en-US"
            className={`w-full ${errors.debit_balance ? "p-invalid" : ""}`}
            disabled
          />
          {errors.debit_balance && (
            <small className="mb-3 text-red-500">{errors.debit_balance}</small>
          )}
        </div>

        <div className="col-12 md:col-4">
          <label
            htmlFor="credit_balance"
            className="block text-900 font-medium mb-2"
          >
            {t_bank.t_bank.credit_balance.name}
          </label>
          <InputNumber
            name="credit_balance"
            value={formData.credit_balance}
            onValueChange={(e) => onChange("credit_balance", e.value)}
            mode="currency"
            currency="BDT"
            locale="en-US"
            className={`w-full ${errors.credit_balance ? "p-invalid" : ""}`}
            disabled
          />
          {errors.credit_balance && (
            <small className="mb-3 text-red-500">{errors.credit_balance}</small>
          )}
        </div>

        <div className="col-12 md:col-4">
          <label
            htmlFor="current_balance"
            className="block text-900 font-medium mb-2"
          >
            {t_bank.t_bank.current_balance.name}
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
        <div className="col-12">
          <div className="flex flex-row-reverse flex-wrap">
            <Button
              type="button"
              onClick={(e) => onSave(e)}
              label={formData.bank_id ? "Update" : "Save"}
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

export default BankFormComponent;
