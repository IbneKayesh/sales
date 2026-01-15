import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { formatDate, formatDateTime } from "@/utils/datetime";
import ZeroRowCell from "@/components/ZeroRowCell";
import { Badge } from "primereact/badge";
import { SplitButton } from "primereact/splitbutton";

const ListComp = ({ dataList, onEdit }) => {
  const pmstr_trdat_BT = (rowData) => {
    const { pmstr_trdat, pmstr_trnte, pmstr_refno } = rowData;
    const parts = [
      pmstr_trdat && formatDate(pmstr_trdat),
      pmstr_trnte,
      pmstr_refno,
    ].filter(Boolean);

    return <span>{parts.join(" • ")}</span>;
  };

  const pmstr_pyamt_BT = (rowData) => {
    const { pmstr_pyamt, pmstr_pdamt, pmstr_duamt } = rowData;

    return (
      <>
        <ZeroRowCell value={pmstr_pyamt} text={pmstr_pyamt} />
        {" • "}
        <ZeroRowCell value={pmstr_pdamt} text={pmstr_pdamt} />
        {" • "}
        <ZeroRowCell value={pmstr_duamt} text={pmstr_duamt} />
      </>
    );
  };

  const is_paid_BT = (rowData) => {
    //console.log("rowData " + JSON.stringify(rowData))
    return (
      <>
        {(() => {
          const statusMap = {
            1: { severity: "success", name: "Paid" },
            0: { severity: "danger", name: "Unpaid" },
            2: { severity: "warning", name: "Partial" },
          };

          const status = statusMap[rowData.pmstr_ispad];

          return status ? (
            <Badge
              value={status.name}
              severity={status.severity}
              className="mr-1"
            />
          ) : null;
        })()}

        {rowData.pmstr_ispst ? (
          <Badge value="Posted" severity="success" className="mr-1"></Badge>
        ) : (
          <Badge value="Unposted" severity="danger" className="mr-1"></Badge>
        )}
        {rowData.pmstr_isret ? (
          <Badge value="Retruned" severity="info"></Badge>
        ) : (
          ""
        )}
        {rowData.pmstr_iscls ? (
          <Badge value="Closed" severity="info"></Badge>
        ) : (
          ""
        )}
        {rowData.pmstr_vatcl ? (
          <Badge value="Vat Collected" severity="info"></Badge>
        ) : (
          ""
        )}
        {rowData.pmstr_hscnl ? (
          <Badge value="Cancelled" severity="info"></Badge>
        ) : (
          ""
        )}
      </>
    );
  };

  
  const handleCancelBooking = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to cancel Pending Invoice Qty "${rowData.pmstr_trnno}"?`,
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
      message: `Are you sure you want to delete "${rowData.pmstr_trnno}"?`,
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
    const paidCount = dataList.filter((item) => item.pmstr_ispad === 1).length;
    const unpaidCount = dataList.filter(
      (item) => item.pmstr_ispad === 0
    ).length;
    const partialCount = dataList.filter(
      (item) => item.pmstr_ispad === 2
    ).length;

    const totalDueAmount = dataList.reduce(
      (sum, item) => sum + Number(item.pmstr_duamt || 0),
      0
    );

    const unpostedCount = dataList.filter((item) => !item.pmstr_ispst).length;

    const returnCount = dataList.filter((item) => item.pmstr_isret).length;

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
            value={`Due: ${totalDueAmount}`}
            severity="danger"
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
        {returnCount > 0 && (
          <Badge
            value={`Return: ${returnCount}`}
            severity="warning"
            className="mr-1"
          />
        )}
      </div>
    );
  };

  return (
    <div className="p-1">
      {/* {JSON.stringify(dataList)} */}

      <ConfirmDialog />
      <DataTable
        value={dataList}
        paginator
        rows={15}
        rowsPerPageOptions={[15, 50, 100]}
        emptyMessage="No data found."
        size="small"
        rowHover
        showGridlines
        footer={dataTable_FT}
      >
        <Column field="pmstr_odtyp" header="Type" />
        <Column field="pmstr_trnno" header="No" />
        <Column field="pmstr_trdat" header="Date • Note" body={pmstr_trdat_BT} />
        <Column field="pmstr_pyamt" header="Payable • Paid • Due" body={pmstr_pyamt_BT} />
        <Column
          field="is_paid"
          header="Status"
          body={is_paid_BT}
          sortable
        ></Column>
         <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default ListComp;
