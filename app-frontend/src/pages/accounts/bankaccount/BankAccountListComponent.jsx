import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";

const BankAccountListComponent = ({ dataList, onEdit, onDelete }) => {
  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.account_name}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        onDelete(rowData.bank_account_id);
      },
      reject: () => {
        // Do nothing on reject
      },
    });
  };

  const actionTemplate = (rowData) => {
    let menuItems = [
      {
        label: "Delete",
        icon: "pi pi-trash text-red-400",
        command: () => {
          handleDelete(rowData);
        },
        disabled: rowData.ismodified,
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
          disabled={rowData.ismodified}
        />
      </div>
    );
  };

  const debitBalanceTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.debit_balance);
  };

  const creditBalanceTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.credit_balance);
  };

  return (
    <div className="p-1">
      <ConfirmDialog />
      <DataTable
        value={dataList}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        emptyMessage="No data found."
        responsiveLayout="scroll"
        className="bg-dark-300"
        size="small"
      >
        <Column field="bank_name" header="Bank Name" />
        <Column field="account_name" header="Account Name" sortable />
        <Column field="account_number" header="Account Number" />
        <Column field="opening_date" header="Opening Date" />
        <Column
          field="debit_balance"
          header="Debit"
          body={debitBalanceTemplate}
          sortable
        />
        <Column
          field="credit_balance"
          header="Credit"
          body={creditBalanceTemplate}
          sortable
        />
        <Column
          field="current_balance"
          header="Balance"
          body={(rowData) =>
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "BDT",
            }).format(rowData.current_balance)
          }
          sortable
        />
        <Column
          field="is_default"
          header="Is Default"
          body={(rowData) => (rowData.is_default === 1 ? "Yes" : "No")}
          sortable
        />
        <Column
          header="Actions"
          body={actionTemplate}
          style={{ width: "120px" }}
        />
      </DataTable>
    </div>
  );
};

export default BankAccountListComponent;
