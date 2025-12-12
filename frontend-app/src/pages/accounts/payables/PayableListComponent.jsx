import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";

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

  const actionTemplate = (rowData) => {
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

  const nameTemplate = (rowData) => {
    return rowData.payment_head + " - " + rowData.contact_name;
  };


  const payableAmountTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.payable_amount);
  };

  const paymentAmountTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.payment_amount);
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
        <Column field="payment_head" header="Head" sortable body={nameTemplate} />
        <Column field="order_date" header="Date" sortable />
        <Column field="ref_no" header="Ref No" sortable />
        <Column
          field="payable_amount"
          header="Total Amount"
          body={payableAmountTemplate}
          sortable
        />
        <Column
          field="payment_amount"
          header="Due Amount"
          body={paymentAmountTemplate}
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

export default PayableListComponent;