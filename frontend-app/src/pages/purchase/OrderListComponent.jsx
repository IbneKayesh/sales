import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";


const OrderListComponent = ({ dataList, onEdit, onDelete }) => {
  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.order_no}"?`,
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
    //console.log("rowData " + JSON.stringify(rowData));
    let menuItems = [
      {
        label: "Delete",
        icon: "pi pi-trash text-red-400",
        command: () => {
          handleDelete(rowData);
        },
        disabled: rowData.isedit,
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

  const totalAmountTemplate = (rowData) => {
    const { total_amount, paid_amount, due_amount } = rowData;

    return (
      <span>
        Total: {total_amount} &nbsp; Paid: {paid_amount} &nbsp;
        {due_amount > 0 && (
          <>
            Due: <span className="text-red-500 font-bold">{due_amount}</span>
          </>
        )}
      </span>
    );
  };

  const totalAmountFooterTemplate = () => {
    const total_due_amount = dataList.reduce(
      (sum, item) => sum + (item.due_amount || 0),
      0
    );

    return (
      <>
        Due: <span className="text-red-500 font-bold">{total_due_amount}</span>
      </>
    );
  };

  // Summary calculations for table footer
  const tableFooterTemplate = () => {
    const totalPaid = dataList.filter((item) => item.is_paid === "Paid").length;
    const totalUnpaid = dataList.filter(
      (item) => item.is_paid === "Unpaid"
    ).length;
    const totalPartial = dataList.filter(
      (item) => item.is_paid === "Partial"
    ).length;
    const totalPosted = dataList.filter((item) => item.is_posted).length;
    const totalUnposted = dataList.filter((item) => !item.is_posted).length;
    const totalCompleted = dataList.filter((item) => item.is_completed).length;
    const totalIncomplete = dataList.filter(
      (item) => !item.is_completed
    ).length;
    const totalUnpaidValue = dataList
      .filter((item) => !item.is_paid)
      .reduce(
        (sum, item) =>
          sum + ((item.total_amount ?? 0) - (item.paid_amount ?? 0)),
        0
      );

    return (
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
        {totalPartial > 0 && (
          <Badge
            value={`Partial: ${totalPartial}`}
            severity="warning"
            className="mr-1"
          />
        )}
        {totalPosted > 0 && (
          <Badge
            value={`Posted: ${totalPosted}`}
            severity="success"
            className="mr-1"
          />
        )}
        {totalUnposted > 0 && (
          <Badge
            value={`Unposted: ${totalUnposted}`}
            severity="danger"
            className="mr-1"
          />
        )}
        {totalCompleted > 0 && (
          <Badge
            value={`Completed: ${totalCompleted}`}
            severity="info"
            className="mr-1"
          />
        )}
        {totalIncomplete > 0 && (
          <Badge
            value={`Incomplete: ${totalIncomplete}`}
            severity="warning"
            className="mr-1"
          />
        )}
        {totalUnpaidValue > 0 && (
          <Badge
            value={`Unpaid Value: ${formatCurrency(totalUnpaidValue)}`}
            severity="danger"
            className="mr-1"
          />
        )}
      </div>
    );
  };

  const formatCurrency = (value) => {
    if (value == null || isNaN(value)) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(value);
  };

  const trnShortBody_FirstChars = (rowData) => {
    if (!rowData.order_type) return "";

    return rowData.order_type
      .split(" ") // split string into words
      .map((word) => word[0].toUpperCase()) // take first char of each word
      .join(""); // join them together
  };

  const trnShortBody = (rowData) => {
    if (!rowData.order_type) return "";

    const parts = rowData.order_type.trim().split(" ");
    return parts[parts.length - 1]; // return last word
  };

  return (
    <div className="p-1">
      <ConfirmDialog />
      <DataTable
        footer={tableFooterTemplate()}
      >
        <Column field="order_no" header="Order No" sortable />
        <Column field="order_date" header="Date" sortable />
        <Column field="contact_name" header="Contact" sortable />
        <Column
          field="total_amount"
          header="Total Amount"
          sortable
          body={totalAmountTemplate}
          footer={totalAmountFooterTemplate}
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

export default OrderListComponent;