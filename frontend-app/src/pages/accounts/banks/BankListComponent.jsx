import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";

const BankListComponent = ({ dataList, onEdit, onDelete, onAccountList }) => {
  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.bank_name}"?`,
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

  const action_BT = (rowData) => {
    let menuItems = [      
      {
        label: "Accounts",
        icon: "pi pi-user text-blue-400",
        command: () => {
          onAccountList(rowData);
        },
      },
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
      <DataTable
        value={dataList}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        emptyMessage="No data found."
        className="bg-dark-300"
        size="small"
      >
        <Column field="bank_name" header="Bank" />
        <Column field="branch_name" header="Branch" />
        <Column field="swift_code" header="Swift Code" />
        <Column
          field="current_balance"
          header="Balance"
          body={current_balance_BT}
          sortable
        />
        <Column
          header="#"
          body={action_BT}
          style={{ width: "120px" }}
        />
      </DataTable>
    </div>
  );
};

export default BankListComponent;
