import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { Badge } from "primereact/badge";

const PayableListComponent = ({ dataList, onEdit, onDelete }) => {
  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.ref_no}"?`,
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
    let menuItems = [
      {
        label: "Delete",
        icon: "pi pi-trash text-red-400",
        command: () => {
          handleDelete(rowData);
        },
        disabled: 1,
      },
    ];
    return (
      <div className="flex flex-wrap gap-2">
        <SplitButton
          icon="pi pi-plus"
          size="small"
          tooltip="Add New"
          tooltipOptions={{ position: "top" }}
          onClick={() => onEdit(rowData)}
          model={menuItems}
          disabled={rowData.ismodified}
        />
      </div>
    );
  };

  const payment_head_BT = (rowData) => {
    return (
      rowData.payment_type +
      ", " +
      rowData.source_name +
      ", " +
      rowData.payment_head +
      ", " +
      rowData.contact_name
    );
  };

  const due_amount_BT = (rowData) => {
    return <Badge value={rowData.due_amount} severity="danger" />;
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
        <Column
          field="payment_head"
          header="Particulars"
          sortable
          body={payment_head_BT}
        />
        <Column field="order_date" header="Due Date" sortable />
        <Column field="ref_no" header="Ref No" sortable />
        <Column field="payable_amount" header="Total" sortable />
        <Column field="due_amount" header="Due" sortable body={due_amount_BT} />
        <Column header="Actions" body={action_BT} style={{ width: "120px" }} />
      </DataTable>
    </div>
  );
};

export default PayableListComponent;
