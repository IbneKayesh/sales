import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import t_accounts from "@/models/accounts/t_accounts.json";

const AccountComponent = ({
  accountList,
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
  onEdit,
}) => {
  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.account_name}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        onDelete(rowData);
      },
      reject: () => {
        // Do nothing on reject
      },
    });
  };
  const current_balance_BT = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.current_balance);
  };
  const default_BT = (rowData) => {
    return rowData.is_default ? "Yes" : "No";
  };
  const action_BT = (rowData) => {
    let menuItems = [
      {
        label: "Delete",
        icon: "pi pi-trash text-red-400",
        command: () => {
          handleDelete(rowData);
        },
        disabled: rowData.edit_stop,
      },
    ];
    return (
      <div className="flex flex-wrap gap-2">
        <SplitButton
          icon="pi pi-pencil"
          size="small"
          tooltip="Edit"
          tooltipOptions={{ position: "top" }}
          onClick={() => onEdit(rowData)}
          model={menuItems}
          disabled={rowData.edit_stop}
        />
      </div>
    );
  };
  return (
    <div className="p-1">
      <ConfirmDialog />

      <div className="grid">
        <div className="col-12 md:col-3">
          <label
            htmlFor="account_name"
            className="block text-900 font-medium mb-2"
          >
            {t_accounts.account_name.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <InputText
            name="account_name"
            value={formData.account_name}
            onChange={(e) => onChange("account_name", e.target.value)}
            className={`w-full ${errors.account_name ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_accounts.account_name.name}`}
          />
          {errors.account_name && (
            <small className="mb-3 text-red-500">
              {errors.account_name}
            </small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="account_no"
            className="block text-900 font-medium mb-2"
          >
            {t_accounts.account_no.name}
          </label>
          <InputText
            name="account_no"
            value={formData.account_no}
            onChange={(e) => onChange("account_no", e.target.value)}
            className={`w-full ${errors.account_no ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_accounts.account_no.name}`}
          />
          {errors.account_no && (
            <small className="mb-3 text-red-500">{errors.account_no}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="account_note"
            className="block text-900 font-medium mb-2"
          >
            {t_accounts.account_note.name}
          </label>
          <InputText
            name="account_note"
            value={formData.account_note}
            onChange={(e) => onChange("account_note", e.target.value)}
            className={`w-full ${errors.account_note ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_accounts.account_note.name}`}
          />
          {errors.account_note && (
            <small className="mb-3 text-red-500">
              {errors.account_note}
            </small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="opening_date"
            className="block text-900 font-medium mb-2"
          >
            {t_accounts.opening_date.name}{" "}
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
            placeholder={`Select ${t_accounts.opening_date.name}`}
          />
          {errors.opening_date && (
            <small className="mb-3 text-red-500">{errors.opening_date}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="is_default"
            className="block text-900 font-medium mb-2"
          >
            {t_accounts.is_default.name}
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

      <DataTable
        value={accountList}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        emptyMessage="No data found."
        size="small"
      >
        <Column field="account_name" header="Account" />
        <Column field="account_no" header="Account No" />
        <Column field="account_note" header="Note" />
        <Column field="opening_date" header="Opening Date" />
        <Column
          field="current_balance"
          header="Balance"
          body={current_balance_BT}
          sortable
        />
        <Column field="is_default" header="Default" body={default_BT} />
        <Column
          header={accountList.length + " Rows"}
          body={action_BT}
          style={{ width: "120px" }}
        />
      </DataTable>
    </div>
  );
};

export default AccountComponent;
