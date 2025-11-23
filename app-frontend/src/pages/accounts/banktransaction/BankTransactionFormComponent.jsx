import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import t_bank_trans from "@/models/accounts/t_bank_trans.json";

const BankTransactionFormComponent = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
  bankAccounts,
  transHeads,
  refNoTrans,
  selectedRefNoTrans,
}) => {
  const debitAmount = selectedRefNoTrans.reduce(
    (sum, item) => sum + (item.debit_amount ?? 0),
    0
  );
  const creditAmount = selectedRefNoTrans.reduce(
    (sum, item) => sum + (item.credit_amount ?? 0),
    0
  );
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
            value={formData.trans_date ? new Date(formData.trans_date) : null}
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
            <small className="mb-3 text-red-500">{errors.trans_date}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="trans_head"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_trans.t_bank_trans.trans_head.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="trans_head"
            value={formData.trans_head}
            options={transHeads}
            onChange={(e) => onChange("trans_head", e.value)}
            className={`w-full ${errors.trans_head ? "p-invalid" : ""}`}
            placeholder={`Select ${t_bank_trans.t_bank_trans.trans_head.name}`}
          />
          {errors.trans_head && (
            <small className="mb-3 text-red-500">{errors.trans_head}</small>
          )}
        </div>
        <div className="col-12 md:col-4">
          <label htmlFor="ref_no" className="block text-900 font-medium mb-2">
            {t_bank_trans.t_bank_trans.ref_no.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="ref_no"
            value={formData.ref_no}
            options={refNoTrans.map((trn) => ({
              label: `${trn.order_type} - ${trn.order_no} - ${trn.contact_name}`,
              value: trn.order_no,
            }))}
            onChange={(e) => onChange("ref_no", e.value)}
            className={`w-full ${errors.ref_no ? "p-invalid" : ""}`}
            placeholder={`Select ${t_bank_trans.t_bank_trans.ref_no.name}`}
          />
          {errors.ref_no && (
            <small className="mb-3 text-red-500">{errors.ref_no}</small>
          )}
        </div>
        <div className="col-12">
          {/* {JSON.stringify(selectedRefNoTrans)} */}

          <DataTable
            value={selectedRefNoTrans}
            emptyMessage="No data found."
            className="bg-dark-300"
            size="small"
          >
            <Column field="trans_details" header="Details" />
            <Column
              field="debit_amount"
              header="Debit Amount"
              footer={debitAmount}
              //body={debitAmountTemplate}
            />
            <Column
              field="credit_amount"
              header="Credit Amount"
              footer={creditAmount}
              //body={creditAmountTemplate}
            />
            <Column
              header="Actions"
              //body={actionTemplate}
              style={{ width: "120px" }}
            />
          </DataTable>
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
