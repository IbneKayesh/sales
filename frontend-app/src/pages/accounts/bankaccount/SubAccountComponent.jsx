import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";

const SubAccountComponent = ({ subAccountList, subAccount }) => {
  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.sub_account_name}"?`,
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
        <h5>Sub Accounts</h5>
      </div>

      <DataTable
        value={subAccountList}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        emptyMessage="No data found."
        size="small"
      >
        <Column field="sub_account_name" header="Sub Account Name" />
        <Column field="sub_account_desc" header="Description" />
        <Column field="opening_date" header="Opening Date" />
        <Column
          field="current_balance"
          header="Balance"
          body={current_balance_BT}
          sortable
        />
        <Column field="is_default" header="Default" body={default_BT} />
        <Column header="#" body={action_BT} style={{ width: "120px" }} />
      </DataTable>
    </div>
  );
};

export default SubAccountComponent;
