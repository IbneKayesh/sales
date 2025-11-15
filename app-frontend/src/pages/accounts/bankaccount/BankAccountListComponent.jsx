import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";

const BankAccountListComponent = ({ dataList, onEdit, onDelete }) => {

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.account_name}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        onDelete(rowData.bank_account_id);
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

  const debitBalanceTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(rowData.debit_balance);
  };

  const creditBalanceTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(rowData.credit_balance);
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
        <Column field="account_number" header="Account Number" />
        <Column field="bank_name" header="Bank Name" />
        <Column field="opening_date" header="Opening Date" />
        <Column
          field="debit_balance"
          header="Debit Balance"
          body={debitBalanceTemplate}
          sortable
        />
        <Column
          field="credit_balance"
          header="Credit Balance"
          body={creditBalanceTemplate}
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

export default BankAccountListComponent;
