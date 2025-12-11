import React, { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { Dialog } from "primereact/dialog";
import { Badge } from "primereact/badge";

const ContactListComponent = ({
  dataList,
  onEdit,
  onDelete,
  onLedger,
  contactsLedger,
}) => {
  const [selectedRowDetail, setSelectedRowDetail] = useState({});
  const [visibleLedger, setVisibleLedger] = useState(false);

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.contact_name}"?`,
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

  const handleVisibleLedger = (rowData) => {
    setSelectedRowDetail(rowData);
    setVisibleLedger(true);
    onLedger(rowData);
  };

  const current_balance_BT = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.current_balance);
  };

  const allow_due_BT = (rowData) => {
    return rowData.allow_due ? (
      <Badge value="Yes" severity="success" className="mr-1"></Badge>
    ) : (
      <Badge value="No" severity="danger" className="mr-1"></Badge>
    );
  };

  const actionTemplate = (rowData) => {
    let menuItems = [
      {
        label: "Edit",
        icon: "pi pi-pencil",
        command: () => {
          onEdit(rowData);
        },
        disabled: rowData.ismodified,
      },
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
          icon="pi pi-book"
          size="small"
          tooltip="Ledger"
          tooltipOptions={{ position: "top" }}
          onClick={() => handleVisibleLedger(rowData)}
          model={menuItems}
        />
      </div>
    );
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
        className="bg-dark-300"
        size="small"
      >
        <Column field="contact_name" header="Name" sortable />
        <Column field="contact_mobile" header="Mobile" />
        <Column field="contact_email" header="Email" />
        <Column field="contact_address" header="Address" />
        <Column field="contact_type" header="Type" />
        <Column
          field="current_balance"
          header="Balance"
          body={current_balance_BT}
        />
        <Column field="allow_due" header="Allow Due" body={allow_due_BT} />
        <Column
          header="Actions"
          body={actionTemplate}
          style={{ width: "120px" }}
        />
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
            <Column
              field="payment_date"
              header="Date"
            />
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

export default ContactListComponent;
