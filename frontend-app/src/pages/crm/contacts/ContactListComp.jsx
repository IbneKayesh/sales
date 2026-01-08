import React, { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { Dialog } from "primereact/dialog";
import { Badge } from "primereact/badge";

const ContactListComp = ({ dataList, onEdit, onDelete }) => {
  const [selectedRowDetail, setSelectedRowDetail] = useState({});
  const [visibleLedger, setVisibleLedger] = useState(false);
  const [contactsLedger, setcontactsLedger] = useState([]);

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
          //onClick={() => handleVisibleLedger(rowData)}
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
    )
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

  const handleVisibleLedger = (rowData) => {
    setSelectedRowDetail(rowData);
    setVisibleLedger(true);
    onLedger(rowData);
  };

  const payment_mode_BT = (rowData) => {
    return rowData.payment_mode + " for " + rowData.ref_no;
  };

  const account_balance = () => {
    //total debit - total credit;
    const total_debit = contactsLedger.reduce(
      (total, row) => total + row.debit_amount,
      0
    );
    const total_credit = contactsLedger.reduce(
      (total, row) => total + row.credit_amount,
      0
    );
    const balance = total_debit - total_credit;
    const formatBalance = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(balance);
    //console.log(formatBalance);
    return balance > 0 ? (
      <span className="text-red-500">{formatBalance}</span>
    ) : (
      <span className="text-blue-500">{formatBalance}</span>
    );
  };

  const debit_amount_FT = () => {
    return contactsLedger.reduce((total, row) => total + row.debit_amount, 0);
  };

  const credit_amount_FT = () => {
    return contactsLedger.reduce((total, row) => total + row.credit_amount, 0);
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
            <span className="text-blue-500">Accounts Ledger of </span>
            {selectedRowDetail?.contact_name || "N/A"}
            <br />
            {account_balance()}
          </>
        }
        visible={visibleLedger}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visibleLedger) return;
          setVisibleLedger(false);
        }}
      >
        <div className="m-0">
          {/* {JSON.stringify(contactsLedger)} */}
          <DataTable
            value={contactsLedger}
            keyField="ledger_id"
            emptyMessage="No data found."
            size="small"
            paginator
            rows={20}
            rowsPerPageOptions={[20, 50, 100]}
          >
            <Column field="payment_head" header="Head" />
            <Column
              field="payment_mode"
              header="Particular"
              body={payment_mode_BT}
            />
            <Column field="payment_date" header="Date" />
            <Column
              field="debit_amount"
              header="Debit"
              footer={debit_amount_FT}
            />
            <Column
              field="credit_amount"
              header="Credit"
              footer={credit_amount_FT}
            />
            <Column field="payment_note" header="Note" />
          </DataTable>
        </div>
      </Dialog>
    </div>
  );
};

export default ContactListComp;
