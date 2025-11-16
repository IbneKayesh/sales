import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";

const PrequestChildListComponent = ({ dataList, onEdit, onDelete, selectedMasterId }) => {

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete item "${rowData.item_name}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        onDelete(rowData.id);
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

  const itemRateTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(rowData.item_rate);
  };

  const discountAmountTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(rowData.discount_amount);
  };

  const itemAmountTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(rowData.item_amount);
  };

  return (
    <div className="p-1">
      <ConfirmDialog />
      {selectedMasterId && (
        <div className="mb-3">
          <h4>Items for Purchase Order #{selectedMasterId}</h4>
        </div>
      )}
      <DataTable
        value={dataList}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        emptyMessage="No items found."
        responsiveLayout="scroll"
        className="bg-dark-300"
        size="small"
      >
        <Column field="item_name" header="Item Name" sortable />
        <Column
          field="item_rate"
          header="Rate"
          body={itemRateTemplate}
          sortable
        />
        <Column field="item_qty" header="Quantity" sortable />
        <Column
          field="discount_amount"
          header="Discount"
          body={discountAmountTemplate}
          sortable
        />
        <Column
          field="item_amount"
          header="Amount"
          body={itemAmountTemplate}
          sortable
        />
        <Column field="item_note" header="Note" />
        <Column field="order_qty" header="Order Qty" sortable />
        <Column
          header="Actions"
          body={actionTemplate}
          style={{ width: "120px" }}
        />
      </DataTable>
    </div>
  );
};

export default PrequestChildListComponent;
