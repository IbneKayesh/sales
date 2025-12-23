import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { Badge } from "primereact/badge";

const OrderListComponent = ({
  dataList,
  onEdit,
  onDelete,
  onCancelBooking,
}) => {
  const payable_amount_BT = (rowData) => {
    return (
      <span>
        {rowData.payable_amount} - {rowData.paid_amount} = {rowData.due_amount}
      </span>
    );
  };

  const is_paid_BT = (rowData) => {
    //console.log("rowData " + JSON.stringify(rowData))
    return (
      <>
        {(() => {
          const statusMap = {
            Paid: { severity: "success" },
            Unpaid: { severity: "danger" },
            Partial: { severity: "warning" },
          };

          const status = statusMap[rowData.is_paid];

          return status ? (
            <Badge
              value={rowData.is_paid}
              severity={status.severity}
              className="mr-1"
            />
          ) : null;
        })()}

        {rowData.is_posted ? (
          <Badge value="Posted" severity="success" className="mr-1"></Badge>
        ) : (
          <Badge value="Unposted" severity="danger" className="mr-1"></Badge>
        )}
        {rowData.is_closed ? (
          <Badge value="Closed" severity="info"></Badge>
        ) : (
          <Badge value="Open" severity="warning"></Badge>
        )}
        {rowData.vat_collected ? (
          <Badge value="VAT Collected" severity="info"></Badge>
        ) : (
          ""
        )}
        {rowData.has_cancelled ? (
          <Badge value="Cancelled" severity="info"></Badge>
        ) : (
          ""
        )}
      </>
    );
  };

  const handleCancelBooking = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to cancel Pending Invoice Qty "${rowData.order_no}"?`,
      header: "Cancel Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        onCancelBooking(rowData);
      },
      reject: () => {
        // Do nothing on reject
      },
    });
  };

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
  const action_BT = (rowData) => {
    //console.log("rowData " + JSON.stringify(rowData));
    let menuItems = [
      {
        label: "Cancel",
        icon: "pi pi-times text-red-400",
        command: () => {
          handleCancelBooking(rowData);
        },
        disabled: !rowData.edit_stop,
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

  const dataTable_FT = () => {
    const paidCount = dataList.filter((item) => item.is_paid === "Paid").length;
    const unpaidCount = dataList.filter(
      (item) => item.is_paid === "Unpaid"
    ).length;
    const partialCount = dataList.filter(
      (item) => item.is_paid === "Partial"
    ).length;

    const totalDueAmount = dataList.reduce(
      (sum, item) => sum + (item.due_amount || 0),
      0
    );

    const postedCount = dataList.filter((item) => item.is_posted).length;
    const unpostedCount = dataList.filter((item) => !item.is_posted).length;

    const closedCount = dataList.filter((item) => item.is_closed).length;
    const openCount = dataList.filter((item) => !item.is_closed).length;

    return (
      <div className="p-2 text-center">
        {paidCount > 0 && (
          <Badge
            value={`Paid: ${paidCount}`}
            severity="success"
            className="mr-1"
          />
        )}
        {unpaidCount > 0 && (
          <Badge
            value={`Unpaid: ${unpaidCount}`}
            severity="danger"
            className="mr-1"
          />
        )}
        {partialCount > 0 && (
          <Badge
            value={`Partial: ${partialCount}`}
            severity="warning"
            className="mr-1"
          />
        )}
        {totalDueAmount > 0 && (
          <Badge
            value={`Due Amount: ${totalDueAmount}`}
            severity="danger"
            className="mr-1"
          />
        )}
        {postedCount > 0 && (
          <Badge
            value={`Posted: ${postedCount}`}
            severity="success"
            className="mr-1"
          />
        )}
        {unpostedCount > 0 && (
          <Badge
            value={`Unposted: ${unpostedCount}`}
            severity="danger"
            className="mr-1"
          />
        )}
        {closedCount > 0 && (
          <Badge
            value={`Closed: ${closedCount}`}
            severity="info"
            className="mr-1"
          />
        )}
        {openCount > 0 && (
          <Badge
            value={`Open: ${openCount}`}
            severity="warning"
            className="mr-1"
          />
        )}
      </div>
    );
  };

  return (
    <div className="p-1">
      <ConfirmDialog />
      <DataTable
        value={dataList}
        paginator
        rows={15}
        rowsPerPageOptions={[15, 25, 50, 75, 100]}
        size="small"
        emptyMessage="No data found."
        footer={dataTable_FT}
      >
        <Column field="order_no" header="Booking" sortable></Column>
        <Column field="order_date" header="Date" sortable></Column>
        <Column field="contact_name" header="Contact" sortable></Column>
        <Column
          field="payable_amount"
          header="Amount"
          body={payable_amount_BT}
          sortable
        ></Column>
        <Column
          field="is_paid"
          header="Status"
          body={is_paid_BT}
          sortable
        ></Column>
        <Column header="#" body={action_BT}></Column>
      </DataTable>
    </div>
  );
};

export default OrderListComponent;
