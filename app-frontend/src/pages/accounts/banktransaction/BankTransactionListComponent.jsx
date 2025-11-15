import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";

const BankTransactionListComponent = ({ dataList, onEdit, onDelete }) => {

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.transaction_name}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        onDelete(rowData.bank_transactions_id);
      },
      reject: () => {
        // Do nothing on reject
      },
    });
  };

  const actionTemplate = (rowData) => {
    return (
      <div className="d-flex flex-nowrap gap-2">
        <Button
          icon="pi pi-pencil"
          onClick={() => onEdit(rowData)}
          tooltip="Edit"
          tooltipOptions={{ position: "top" }}
          size="small"
          severity="primary"
        />
        <Button
          icon="pi pi-trash"
          onClick={() => handleDelete(rowData)}
          tooltip="Delete"
          tooltipOptions={{ position: "top" }}
          size="small"
          severity="danger"
        />
      </div>
    );
  };

  const debitAmountTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(rowData.debit_amount);
  };

  const creditAmountTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(rowData.credit_amount);
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
        responsiveLayout="scroll"
        className="bg-dark-300"
        size="small"
      >
        <Column field="account_name" header="Account Name" sortable />
        <Column field="bank_name" header="Bank Name" sortable />
        <Column field="transaction_date" header="Transaction Date" sortable />
        <Column field="transaction_name" header="Transaction Name" sortable />
        <Column field="reference_no" header="Reference No" />
        <Column field="transaction_details" header="Transaction Details" />
        <Column
          field="debit_amount"
          header="Debit Amount"
          body={debitAmountTemplate}
          sortable
        />
        <Column
          field="credit_amount"
          header="Credit Amount"
          body={creditAmountTemplate}
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

export default BankTransactionListComponent;
