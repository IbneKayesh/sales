import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Badge } from "primereact/badge";
import { SplitButton } from "primereact/splitbutton";

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

  const trnShortBody = (rowData) => {
    if (!rowData.order_type) return "";

    return rowData.order_type
      .split(" ") // split string into words
      .map((word) => word[0].toUpperCase()) // take first char of each word
      .join(""); // join them together
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
    return (
      <>
        {rowData.is_paid ? (
          <Badge value="Paid" severity="success" className="mr-1"></Badge>
        ) : (
          <Badge value="Unpaid" severity="danger" className="mr-1"></Badge>
        )}
        {rowData.is_complete ? (
          <Badge value="Complete" severity="info"></Badge>
        ) : (
          <Badge value="Pending" severity="warning"></Badge>
        )}
      </>
    );
  };

  // Summary calculations for table footer
  const totalPaid = dataList.filter((item) => item.is_paid).length;
  const totalUnpaid = dataList.filter((item) => !item.is_paid).length;
  const totalComplete = dataList.filter((item) => item.is_complete).length;
  const totalPending = dataList.filter((item) => !item.is_complete).length;
  const totalUnpaidValue = dataList
    .filter((item) => !item.is_paid)
    .reduce(
      (sum, item) => sum + ((item.total_amount ?? 0) - (item.paid_amount ?? 0)),
      0
    );

  const formatCurrency = (value) => {
    if (value == null || isNaN(value)) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(value);
  };

  return (
    <div className="p-1">
      <ConfirmDialog />
      <DataTable
        value={dataList}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 50, 75]}
        emptyMessage="No orders found."
        responsiveLayout="scroll"
        className="bg-dark-300"
        size="small"
        footer={
          <div className="p-2 text-center">
            {totalPaid > 0 && (
              <Badge
                value={`Paid: ${totalPaid}`}
                severity="success"
                className="mr-1"
              />
            )}
            {totalUnpaid > 0 && (
              <Badge
                value={`Unpaid: ${totalUnpaid}`}
                severity="danger"
                className="mr-1"
              />
            )}
            {totalComplete > 0 && (
              <Badge
                value={`Complete: ${totalComplete}`}
                severity="info"
                className="mr-1"
              />
            )}
            {totalPending > 0 && (
              <Badge
                value={`Pending: ${totalPending}`}
                severity="warning"
                className="mr-1"
              />
            )}
            {totalUnpaidValue > 0 && (
              <Badge
                value={`Unpaid Value: ${formatCurrency(totalUnpaidValue)}`}
                severity="danger"
              />
            )}
          </div>
        }
      >
        <Column field="order_type" header="Type" sortable body={trnShortBody} />
        <Column field="order_no" header="Order No" sortable />
        <Column field="order_date" header="Date" sortable />
        <Column field="contact_name" header="Contact" sortable />
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
