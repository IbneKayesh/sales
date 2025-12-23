import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";

const LedgerListComponent = ({ dataList, onEdit, onDelete }) => {
  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.contact_name}, ${rowData.ledger_ref}"?`,
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

  const action_BT = (rowData) => {
    //console.log("rowData " + JSON.stringify(rowData));
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
          icon={`${rowData.edit_stop ? "pi pi-eye" : "pi pi-pencil"}`}
          size="small"
          tooltip={rowData.edit_stop ? "View" : "Edit"}
          tooltipOptions={{ position: "top" }}
          onClick={() => onEdit(rowData)}
          model={menuItems}
        />
      </div>
    );
  };

  const balance_amount_BT = (rowData) => {
    if (rowData.balance_amount === 0) {
      return "0";
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.balance_amount);
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
        <Column field="account_name" header="Account" sortable />
        <Column field="head_name" header="Head" sortable />
        <Column field="contact_name" header="Contact" sortable />
        <Column field="ledger_date" header="Date" sortable />
        <Column field="ledger_ref" header="Ref" sortable />
        <Column field="ledger_note" header="Note" sortable />
        <Column field="payment_mode" header="Mode" sortable />
        <Column field="debit_amount" header="Debit" sortable />
        <Column field="credit_amount" header="Credit" sortable />
        <Column header="#" body={action_BT} style={{ width: "120px" }} />
      </DataTable>
    </div>
  );
};

export default LedgerListComponent;
