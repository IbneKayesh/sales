import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";

const SrequestMasterListComponent = ({ dataList, onEdit, onDelete, onSelect }) => {

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete sales order "${rowData.so_master_id}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        onDelete(rowData.so_master_id);
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
          icon="pi pi-eye"
          onClick={() => onSelect(rowData.so_master_id)}
          tooltip="View Items"
          tooltipOptions={{ position: "top" }}
          size="small"
          severity="info"
        />
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

  const totalAmountTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(rowData.total_amount);
  };

  const paidAmountTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(rowData.paid_amount);
  };

  const isPaidTemplate = (rowData) => {
    return rowData.is_paid ? "Paid" : "Pending";
  };

  return (
    <div className="p-1">
      <ConfirmDialog />
      <DataTable
        value={dataList}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        emptyMessage="No sales orders found."
        responsiveLayout="scroll"
        className="bg-dark-300"
        size="small"
      >
        <Column field="so_master_id" header="SO ID" sortable />
        <Column field="transaction_date" header="Date" sortable />
        <Column field="contact_name" header="Contact" sortable />
        <Column field="transaction_note" header="Note" />
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

export default SrequestMasterListComponent;
