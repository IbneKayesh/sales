import React, { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { Dialog } from "primereact/dialog";
import { Badge } from "primereact/badge";
import { formatDate } from "@/utils/datetime";

const ContactListComp = ({
  dataList,
  onEdit,
  onDelete,
  onShowContactLedger,
  ledgerDataList,
}) => {
  const [selectedRowDetail, setSelectedRowDetail] = useState({});
  const [dlgLedger, setDlgLedger] = useState(false);

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.cntct_cntnm}"?`,
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
        label: "Edit",
        icon: "pi pi-pencil",
        command: () => {
          onEdit(rowData);
        },
        disabled: rowData.edit_stop,
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
          icon="pi pi-book"
          size="small"
          tooltip="Ledger"
          tooltipOptions={{ position: "top" }}
          onClick={() => handleDlgLedger(rowData)}
          model={menuItems}
        />
      </div>
    );
  };

  const cntct_ctype_BT = (rowData) => {
    return (
      <>
        {rowData.cntct_ctype} {" - "}
        {rowData.cntct_sorce}
      </>
    );
  };

  const cntct_cntnm_BT = (rowData) => {
    return (
      <>
        {rowData.cntct_cntnm}
        {", "}
        {rowData.cntct_cntps}
        {", "}
        {rowData.cntct_cntno}
        {", "}
        {rowData.cntct_email}{" "}
        {rowData.cntct_actve === 1 ? (
          <i className="pi pi-check-circle text-green-500" />
        ) : (
          <i className="pi pi-times-circle text-red-500" />
        )}
      </>
    );
  };

  const cntct_ofadr_BT = (rowData) => {
    return (
      rowData.cntct_ofadr +
      ", " +
      rowData.cntct_fcadr +
      ", " +
      rowData.cntct_cntry
    );
  };

  const cntct_crlmt_BT = (rowData) => {
    return rowData.cntct_crlmt > 0 ? (
      <Badge
        value={rowData.cntct_crlmt}
        severity="success"
        className="mr-1"
      ></Badge>
    ) : (
      <Badge
        value={rowData.cntct_crlmt}
        severity="danger"
        className="mr-1"
      ></Badge>
    );
  };

  const cntct_pybln_BT = (rowData) => {
    return rowData.cntct_pybln > 0 ? (
      <Badge
        value={rowData.cntct_pybln}
        severity="danger"
        className="mr-1"
      ></Badge>
    ) : (
      <Badge
        value={rowData.cntct_pybln}
        severity="success"
        className="mr-1"
      ></Badge>
    );
  };

  const cntct_adbln_BT = (rowData) => {
    return rowData.cntct_adbln > 0 ? (
      <Badge
        value={rowData.cntct_adbln}
        severity="danger"
        className="mr-1"
      ></Badge>
    ) : (
      <Badge
        value={rowData.cntct_adbln}
        severity="success"
        className="mr-1"
      ></Badge>
    );
  };

  const cntct_crbln_BT = (rowData) => {
    return rowData.cntct_crbln > 0 ? (
      <Badge
        value={rowData.cntct_crbln}
        severity="danger"
        className="mr-1"
      ></Badge>
    ) : (
      <Badge
        value={rowData.cntct_crbln}
        severity="success"
        className="mr-1"
      ></Badge>
    );
  };

  const handleDlgLedger = (rowData) => {
    setSelectedRowDetail(rowData);
    setDlgLedger(true);
    onShowContactLedger(rowData);
  };

  const account_balance = () => {
    //total debit - total credit;
    const total_debit = ledgerDataList.reduce(
      (total, row) => total + Number(row.ledgr_dbamt),
      0
    );
    const total_credit = ledgerDataList.reduce(
      (total, row) => total + Number(row.ledgr_cramt),
      0
    );
    const balance = total_credit - total_debit;
    return balance > 0 ? (
      <span className="text-green-500">{balance}</span>
    ) : (
      <span className="text-red-500">{balance}</span>
    );
  };

  const ledgr_trdat_BT = (rowData) => {
    return <>{formatDate(rowData.ledgr_trdat)}</>;
  };

  const ledgr_refno_BT = (rowData) => {
    return (
      <>
        {rowData.ledgr_refno}
        {rowData.ledgr_notes ? "," + rowData.ledgr_notes : ""}
      </>
    );
  };

  const ledgr_dbamt_BT = (rowData) => {
    return Number(rowData.ledgr_dbamt) === 0
      ? 0
      : Number(rowData.ledgr_dbamt).toFixed(4);
  };

  const ledgr_cramt_BT = (rowData) => {
    return Number(rowData.ledgr_cramt) === 0
      ? 0
      : Number(rowData.ledgr_cramt).toFixed(4);
  };

  const ledgr_dbamt_FT = () => {
    return ledgerDataList.reduce(
      (total, row) => total + Number(row.ledgr_dbamt),
      0
    );
  };

  const ledgr_cramt_FT = () => {
    return ledgerDataList.reduce(
      (total, row) => total + Number(row.ledgr_cramt),
      0
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
        size="small"
        rowHover
        showGridlines
      >
        <Column field="cntct_ctype" header="Type" body={cntct_ctype_BT} />
        <Column field="cntct_cntnm" header="Name" body={cntct_cntnm_BT} />
        <Column field="cntct_ofadr" header="Address" body={cntct_ofadr_BT} />
        <Column
          field="cntct_crlmt"
          header="Credit Limit"
          body={cntct_crlmt_BT}
        />
        <Column field="cntct_pybln" header="Payable" body={cntct_pybln_BT} />
        <Column field="cntct_adbln" header="Advance" body={cntct_adbln_BT} />
        <Column field="cntct_crbln" header="Balance" body={cntct_crbln_BT} />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>

      <Dialog
        header={
          <>
            Accounts Ledger of{" "}
            <span className="text-blue-500">
              {selectedRowDetail?.cntct_cntnm || "N/A"}{" "}
            </span>
            {account_balance()}
          </>
        }
        visible={dlgLedger}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!dlgLedger) return;
          setDlgLedger(false);
        }}
      >
        <div className="m-0">
          {/* {JSON.stringify(ledgerDataList)} */}
          <DataTable
            value={ledgerDataList}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            emptyMessage="No data found."
            size="small"
            rowHover
            showGridlines
          >
            <Column field="ledgr_pymod" header="Mode" />
            <Column field="ledgr_trdat" header="Date" body={ledgr_trdat_BT} />
            <Column field="ledgr_refno" header="Ref" body={ledgr_refno_BT}/>
            <Column
              field="ledgr_dbamt"
              header="Debit (-)"
              body={ledgr_dbamt_BT}
              footer={ledgr_dbamt_FT}
            />
            <Column
              field="ledgr_cramt"
              header="Credit (+)"
              body={ledgr_cramt_BT}
              footer={ledgr_cramt_FT}
            />
          </DataTable>
        </div>
      </Dialog>
    </div>
  );
};

export default ContactListComp;
