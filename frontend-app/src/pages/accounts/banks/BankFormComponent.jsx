import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import t_banks from "@/models/accounts/t_banks.json";

const BankFormComponent = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
}) => {
  return (
      <div className="grid">
        <div className="col-12 md:col-4">
          <label
            htmlFor="bank_name"
            className="block text-900 font-medium mb-2"
          >
            {t_banks.bank_name.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <InputText
            name="bank_name"
            value={formData.bank_name}
            onChange={(e) => onChange("bank_name", e.target.value)}
            className={`w-full ${errors.bank_name ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_banks.bank_name.name}`}
          />
          {errors.bank_name && (
            <small className="mb-3 text-red-500">{errors.bank_name}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="branch_name"
            className="block text-900 font-medium mb-2"
          >
            {t_banks.branch_name.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <InputText
            name="branch_name"
            value={formData.branch_name}
            onChange={(e) => onChange("branch_name", e.target.value)}
            className={`w-full ${errors.branch_name ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_banks.branch_name.name}`}
          />
          {errors.branch_name && (
            <small className="mb-3 text-red-500">{errors.branch_name}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="swift_code"
            className="block text-900 font-medium mb-2"
          >
            {t_banks.swift_code.name}
          </label>
          <InputText
            name="swift_code"
            value={formData.swift_code}
            onChange={(e) => onChange("swift_code", e.target.value)}
            className={`w-full ${errors.swift_code ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_banks.swift_code.name}`}
          />
          {errors.swift_code && (
            <small className="mb-3 text-red-500">{errors.swift_code}</small>
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
  );
};

export default BankFormComponent;
