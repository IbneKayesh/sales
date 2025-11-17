import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const PrequestListComponent = ({ dataList, onEdit, onDelete }) => {
  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete ${rowData.order_type} "${rowData.order_no}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        onDelete(rowData.po_master_id);
      },
      reject: () => {
        // Do nothing on reject
      },
    });
  };

  const actionTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          icon="pi pi-pencil"
          size="small"
          tooltip="Edit"
          tooltipOptions={{ position: "top" }}
          onClick={() => onEdit(rowData)}
          disabled={rowData.ismodified}
        />
        <Button
          icon="pi pi-trash"
          size="small"
          tooltip="Delete"
          tooltipOptions={{ position: "top" }}
          onClick={() => handleDelete(rowData)}
          disabled={rowData.ismodified}
          severity="danger"
        />
      </div>
    );
  };

  const totalAmountTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.total_amount);
  };

  const paidAmountTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.paid_amount);
  };

  const isPaidTemplate = (rowData) => {
    return rowData.is_paid ? "Paid" : "Pending";
  };

  return (
    <div className="p-1">
      <ConfirmDialog />
      <DataTable
        value={dataList}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        emptyMessage="No orders found."
        responsiveLayout="scroll"
        className="bg-dark-300"
        size="small"
      >
        <Column field="order_type" header="Order Type" sortable />
        <Column field="order_no" header="Order No" sortable />
        <Column field="order_date" header="Date" sortable />
        <Column field="contact_name" header="Contact" sortable />
        <Column field="ref_no" header="Ref. Order" sortable />
        <Column field="order_note" header="Note" />
        <Column
          field="total_amount"
          header="Total Amount"
          body={totalAmountTemplate}
          sortable
        />
        <Column
          field="paid_amount"
          header="Paid Amount"
          body={paidAmountTemplate}
          sortable
        />
        <Column
          field="is_paid"
          header="Status"
          body={isPaidTemplate}
          sortable
        />
        <Column
          header="Actions"
          body={actionTemplate}
          style={{ width: "150px" }}
        />
      </DataTable>
    </div>
  );
};

export default PrequestListComponent;
