import React, { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { Dialog } from "primereact/dialog";
import { Badge } from "primereact/badge";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";

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

  const credit_limit_BT = (rowData) => {
    const creditLimit = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.credit_limit);

    return rowData.credit_limit > 0 ? (
      <Badge value={creditLimit} severity="success" className="mr-1"></Badge>
    ) : (
      <Badge value={creditLimit} severity="danger" className="mr-1"></Badge>
    );
  };

  const payable_balance_BT = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.payable_balance);
  };

  const advance_balance_BT = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.advance_balance);
  };

  const current_balance_BT = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.current_balance);
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
        size="small"
        rowHover
        showGridlines
      >
        <Column field="contact_name" header="Name" sortable />
        <Column field="contact_mobile" header="Mobile" />
        <Column field="contact_email" header="Email" />
        <Column field="contact_address" header="Address" />
        <Column field="contact_type" header="Type" />
        <Column
          field="credit_limit"
          header="Credit Limit"
          body={credit_limit_BT}
        />
        <Column
          field="payable_balance"
          header="Payable Balance"
          body={payable_balance_BT}
        />
        <Column
          field="advance_balance"
          header="Advance Balance"
          body={advance_balance_BT}
        />
        <Column
          field="current_balance"
          header="Current Balance"
          body={current_balance_BT}
        />
        <Column field="shop_name" header="Shop" />
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

export default ContactListComponent;
