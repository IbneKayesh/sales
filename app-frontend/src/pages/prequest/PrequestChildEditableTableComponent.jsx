import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Card } from "primereact/card";
import { generateGuid } from "@/utils/guid";
import ConvertedQtyComponent from "@/components/ConvertedQtyComponent";

const PrequestChildEditableTableComponent = ({
  selectedMasterId,
  poChildren,
  items,
  onSaveAll,
}) => {
  const [localItems, setLocalItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingRows, setEditingRows] = useState([]);

  useEffect(() => {
    // Initialize localItems with filtered poChildren
    setLocalItems(
      poChildren.filter(
        (child) => child.po_master_id === selectedMasterId.po_master_id
      )
    );
  }, [poChildren, selectedMasterId]);

  const handleAddItem = () => {
    if (!selectedItem) return;

    const item = items.find((i) => i.item_id === selectedItem);
    if (!item) return;

    const newRow = {
      id: generateGuid(), // Temporary ID for new items
      po_master_id: selectedMasterId.po_master_id,
      item_id: selectedItem,
      item_name: item.item_name,
      item_rate: item.purchase_rate,
      item_qty: 0,
      discount_amount: 0,
      item_amount: 0, // Will be calculated on edit save
      item_note: "",
      order_qty: 0, // Will be calculate on edit save
      ismodified: 1, // Flag for new items
    };

    setLocalItems([...localItems, newRow]);
    setSelectedItem(null);
  };

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete item "${rowData.item_name}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        setLocalItems(localItems.filter((item) => item.id !== rowData.id));
      },
      reject: () => {},
    });
  };

  const onRowEditSave = (event) => {
    let { newData, index } = event;
    // Calculate item_amount
    newData.item_amount =
      newData.item_rate * newData.item_qty - newData.discount_amount;
    newData.order_qty =
      selectedMasterId.order_type === "Purchase Receive" ? newData.item_qty : 0;
    let _localItems = [...localItems];
    _localItems[index] = newData;
    setLocalItems(_localItems);
    setEditingRows([]);
  };

  const onRowEditCancel = (event) => {
    setEditingRows([]);
  };

  const onRowEditInit = (event) => {
    setEditingRows([event.data.id]);
  };

  const itemRateEditor = (options) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
        mode="currency"
        currency="BDT"
        locale="en-US"
      />
    );
  };

  const numberEditor = (options) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
      />
    );
  };

  const textEditor = (options) => {
    return (
      <InputText
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const actionTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-trash"
        onClick={() => handleDelete(rowData)}
        tooltip="Delete"
        tooltipOptions={{ position: "top" }}
        size="small"
        severity="danger"
      />
    );
  };

  const itemRateTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.item_rate);
  };

  const discountAmountTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.discount_amount);
  };

  const itemAmountTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.item_amount);
  };

  const convertedQtyTemplate = (rowData) => {
    return <ConvertedQtyComponent qty={rowData.item_qty} rowData={rowData} />;
  };

  const order_qtyBody = (rowData) => {
    return <ConvertedQtyComponent qty={rowData.order_qty} rowData={rowData} />;
  };

  const handleSaveAll = () => {
    onSaveAll(localItems);
  };

  const footerTemplate = () => {
    const totalItemQty = localItems.reduce(
      (sum, item) => sum + (item.item_qty || 0),
      0
    );
    const totalOrderQty = localItems.reduce(
      (sum, item) => sum + (item.order_qty || 0),
      0
    );
    const totalItemAmount = localItems.reduce(
      (sum, item) => sum + (item.item_amount || 0),
      0
    );

    return (
      <div className="flex justify-content-between align-items-center p-2 bg-gray-100">
        <span className="font-bold">Total:</span>
        <span className="font-bold">Item Qty: {totalItemQty}</span>
        <span className="font-bold">Order Qty: {totalOrderQty}</span>
        <span className="font-bold">
          Amount:{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "BDT",
          }).format(totalItemAmount)}
        </span>
      </div>
    );
  };

  return (
    <div className="p-1">
      <ConfirmDialog />
      <div className="flex align-items-center gap-2">
        <Dropdown
          value={selectedItem}
          options={items.map((item) => ({
            label: item.item_name,
            value: item.item_id,
          }))}
          onChange={(e) => setSelectedItem(e.value)}
          placeholder="Select Item"
          className="w-12rem"
        />
        <Button
          label="Add"
          icon="pi pi-plus"
          onClick={handleAddItem}
          disabled={!selectedItem}
        />
      </div>
      <DataTable
        value={localItems}
        editMode="row"
        dataKey="id"
        editingRows={editingRows}
        onRowEditSave={onRowEditSave}
        onRowEditCancel={onRowEditCancel}
        onRowEditInit={onRowEditInit}
        emptyMessage="No items found."
        responsiveLayout="scroll"
        className="bg-dark-300"
        size="small"
        footer={footerTemplate}
      >
        <Column field="item_name" header="Item Name" />
        <Column
          field="item_rate"
          header="Rate"
          body={itemRateTemplate}
          editor={itemRateEditor}
        />
        <Column field="item_qty" header="Quantity" editor={numberEditor} />
        <Column field="small_unit_name" header="Unit" />
        <Column header="Bulk" body={convertedQtyTemplate} />
        <Column
          field="discount_amount"
          header="Discount"
          body={discountAmountTemplate}
          editor={itemRateEditor}
        />
        <Column field="item_amount" header="Amount" body={itemAmountTemplate} />
        <Column field="item_note" header="Note" editor={textEditor} />
        <Column field="order_qty" header="Order" body={order_qtyBody} />
        <Column
          rowEditor
          headerStyle={{ width: "10%", minWidth: "8rem" }}
          bodyStyle={{ textAlign: "center" }}
        />
        <Column
          header="Actions"
          body={actionTemplate}
          style={{ width: "120px" }}
        />
      </DataTable>
      <div className="flex justify-content-end mt-3">
        <Button
          label="Save All"
          icon="pi pi-check"
          onClick={handleSaveAll}
          severity="success"
          disabled={editingRows.length > 0}
        />
      </div>
    </div>
  );
};

export default PrequestChildEditableTableComponent;
