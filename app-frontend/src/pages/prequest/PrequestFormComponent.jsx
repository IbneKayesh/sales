import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { generateGuid } from "@/utils/guid";
import ConvertedQtyComponent from "@/components/ConvertedQtyComponent";
import t_po_master from "@/models/prequest/t_po_master.json";
import { useContacts } from "@/hooks/setup/useContacts";
import { useItems } from "@/hooks/inventory/useItems";

const PrequestFormComponent = ({
  isBusy,
  errors,
  formData,
  onChange,
  poTypeOptions,
  refNoOptions,
  orderChildItems,
  setOrderChildItems,
  onSaveAll,
}) => {
  const { items } = useItems();
  const { contacts } = useContacts();
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingRows, setEditingRows] = useState([]);
  const [disabledItemAdd, setDisabledItemAdd] = useState(false);
  
  useEffect (()=>{
    if(formData.ref_no !== "-" && formData.ref_no !== "No Ref"){
      setDisabledItemAdd(true);
      setSelectedItem(null);
    }else{
      setDisabledItemAdd(false);
    }

  },[formData.ref_no])

  const handleAddItem = () => {
    if (!selectedItem) return;

    const item = items.find((i) => i.item_id === selectedItem);
    if (!item) return;

    const newRow = {
      id: generateGuid(), // Temporary ID for new items
      po_master_id: "sgd",
      item_id: selectedItem,
      item_name: item.item_name,
      item_rate: item.purchase_rate,
      item_qty: 1,
      unit_difference_qty: item.unit_difference_qty,
      small_unit_name: item.small_unit_name,
      big_unit_name: item.big_unit_name,
      discount_amount: 0,
      item_amount: item.purchase_rate * 1, // Will be re-calculated on edit save
      item_note: "",
      order_qty: 0, // Will be calculate on edit save
      ismodified: 1, // Flag for new items
    };

    setOrderChildItems([...orderChildItems, newRow]);
    setSelectedItem(null);
  };

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete item "${rowData.item_name}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        setOrderChildItems((prev) =>
          prev.filter((item) => item.id !== rowData.id)
        );
      },
      reject: () => {},
    });
  };

  const onRowEditSave = (event) => {
    let { newData, index } = event;
    // Calculate item_amount
    newData.item_amount =
      (newData.item_rate * newData.item_qty) - newData.discount_amount;
    newData.order_qty = 0;
    newData.ismodified = 1;
    let _localItems = [...orderChildItems];
    _localItems[index] = newData;
    setOrderChildItems(_localItems);
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
        style={{ width: "120px" }}
        inputStyle={{ width: "100%" }}
      />
    );
  };

  const numberEditor = (options) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
        style={{ width: "110px" }}
        inputStyle={{ width: "100%" }}
      />
    );
  };

  const textEditor = (options) => {
    return (
      <InputText
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        style={{ width: "110px" }}
        inputStyle={{ width: "100%" }}
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

  const totalItemQty = orderChildItems.reduce(
    (sum, item) => sum + (item.item_qty || 0),
    0
  );
  const totalOrderQty = orderChildItems.reduce(
    (sum, item) => sum + (item.order_qty || 0),
    0
  );
  const totalItemAmount = orderChildItems.reduce(
    (sum, item) => sum + (item.item_amount || 0),
    0
  );

  return (
    <div className="p-1">
      <ConfirmDialog />
      {/* Master Form */}
      <div className="grid">
        <div className="col-12 md:col-3">
          <label
            htmlFor="order_type"
            className="block text-900 font-medium mb-2"
          >
            {t_po_master.t_po_master.order_type.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="order_type"
            value={formData.order_type}
            options={poTypeOptions}
            onChange={(e) => onChange("order_type", e.value)}
            className={`w-full ${errors.order_type ? "p-invalid" : ""}`}
            placeholder={`Select ${t_po_master.t_po_master.order_type.name}`}
            disabled={formData.po_master_id}
          />
          {errors.order_type && (
            <small className="mb-3 text-red-500">{errors.order_type}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label htmlFor="order_no" className="block text-900 font-medium mb-2">
            {t_po_master.t_po_master.order_no.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <InputText
            name="order_no"
            value={formData.order_no}
            onChange={(e) => onChange("order_no", e.target.value)}
            className={`w-full ${errors.order_no ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_po_master.t_po_master.order_no.name}`}
            disabled
          />
          {errors.order_no && (
            <small className="mb-3 text-red-500">{errors.order_no}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="order_date"
            className="block text-900 font-medium mb-2"
          >
            {t_po_master.t_po_master.order_date.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <Calendar
            name="order_date"
            value={formData.order_date ? new Date(formData.order_date) : null}
            onChange={(e) =>
              onChange(
                "order_date",
                e.value ? e.value.toISOString().split("T")[0] : ""
              )
            }
            className={`w-full ${errors.order_date ? "p-invalid" : ""}`}
            dateFormat="yy-mm-dd"
            placeholder={`Select ${t_po_master.t_po_master.order_date.name}`}
          />
          {errors.order_date && (
            <small className="mb-3 text-red-500">{errors.order_date}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="contacts_id"
            className="block text-900 font-medium mb-2"
          >
            {t_po_master.t_po_master.contacts_id.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="contacts_id"
            value={formData.contacts_id}
            options={contacts
              .filter(
                (contact) =>
                  contact.contact_type === "Both" ||
                  contact.contact_type === "Supplier"
              )
              .map((contact) => ({
                label: contact.contact_name,
                value: contact.contact_id,
              }))}
            onChange={(e) => onChange("contacts_id", e.value)}
            className={`w-full ${errors.contacts_id ? "p-invalid" : ""}`}
            placeholder={`Select ${t_po_master.t_po_master.contacts_id.name}`}
            optionLabel="label"
            optionValue="value"
          />
          {errors.contacts_id && (
            <small className="mb-3 text-red-500">{errors.contacts_id}</small>
          )}
        </div>

        <div className="col-12 md:col-3">
          <label htmlFor="ref_no" className="block text-900 font-medium mb-2">
            {t_po_master.t_po_master.ref_no.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="ref_no"
            value={formData.ref_no}
            options={refNoOptions}
            onChange={(e) => onChange("ref_no", e.value)}
            className={`w-full ${errors.ref_no ? "p-invalid" : ""}`}
            placeholder={`Select ${t_po_master.t_po_master.ref_no.name}`}
            optionLabel="label"
            optionValue="value"
          />
          {errors.ref_no && (
            <small className="mb-3 text-red-500">{errors.ref_no}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="order_note"
            className="block text-900 font-medium mb-2"
          >
            {t_po_master.t_po_master.order_note.name}
          </label>
          <InputText
            name="order_note"
            value={formData.order_note}
            onChange={(e) => onChange("order_note", e.target.value)}
            className={`w-full ${errors.order_note ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_po_master.t_po_master.order_note.name}`}
          />
          {errors.order_note && (
            <small className="mb-3 text-red-500">{errors.order_note}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="total_amount"
            className="block text-900 font-medium mb-2"
          >
            {t_po_master.t_po_master.total_amount.name}
          </label>
          <InputNumber
            name="total_amount"
            value={formData.total_amount}
            onValueChange={(e) => onChange("total_amount", e.value)}
            mode="currency"
            currency="BDT"
            locale="en-US"
            className={`w-full ${errors.total_amount ? "p-invalid" : ""}`}
            disabled
          />
          {errors.total_amount && (
            <small className="mb-3 text-red-500">{errors.total_amount}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="paid_amount"
            className="block text-900 font-medium mb-2"
          >
            {t_po_master.t_po_master.paid_amount.name}
          </label>
          <InputNumber
            name="paid_amount"
            value={formData.paid_amount}
            onValueChange={(e) => onChange("paid_amount", e.value)}
            mode="currency"
            currency="BDT"
            locale="en-US"
            className={`w-full ${errors.paid_amount ? "p-invalid" : ""}`}
          />
          {errors.paid_amount && (
            <small className="mb-3 text-red-500">{errors.paid_amount}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label htmlFor="is_paid" className="block text-900 font-medium mb-2">
            {t_po_master.t_po_master.is_paid.name}
          </label>
          <div className="flex align-items-center">
            <Checkbox
              name="is_paid"
              checked={formData.is_paid}
              onChange={(e) => onChange("is_paid", e.checked)}
              className={errors.is_paid ? "p-invalid" : ""}
              disabled
            />
            <label htmlFor="is_paid" className="ml-2">
              Paid
            </label>
          </div>
          {errors.is_paid && (
            <small className="mb-3 text-red-500">{errors.is_paid}</small>
          )}
        </div>
      </div>

      {/* Child Editable Table */}
      <div className="mt-2">
        <div className="flex align-items-center gap-2 mb-2">
          <Dropdown
            value={selectedItem}
            options={items.map((item) => ({
              label: item.item_name,
              value: item.item_id,
            }))}
            onChange={(e) => setSelectedItem(e.value)}
            placeholder="Select Item"
            className="w-full"
            disabled={disabledItemAdd}
          />
          <Button
            label="Add"
            icon="pi pi-plus"
            onClick={handleAddItem}
            disabled={!selectedItem}
            size="small"
          />
        </div>
        <DataTable
          value={orderChildItems}
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
        >
          <Column
            field="item_name"
            header="Item Name"
            footer={
              <>
                {orderChildItems.length} Items, {editingRows.length} Selected
              </>
            }
          />
          <Column
            field="item_rate"
            header="Rate"
            body={itemRateTemplate}
            editor={itemRateEditor}
          />
          <Column
            field="item_qty"
            header="Quantity"
            editor={numberEditor}
            footer={totalItemQty}
          />
          <Column field="small_unit_name" header="Unit" />
          <Column header="Bulk" body={convertedQtyTemplate} />
          <Column
            field="discount_amount"
            header="Discount"
            body={discountAmountTemplate}
            editor={itemRateEditor}
          />
          <Column
            field="item_amount"
            header="Amount"
            body={itemAmountTemplate}
            footer={
              <>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "BDT",
                }).format(totalItemAmount)}
              </>
            }
          />
          <Column field="item_note" header="Note" editor={textEditor} />
          <Column
            field="order_qty"
            header="PR Qty"
            body={order_qtyBody}
            footer={totalOrderQty}
          />
          <Column
            rowEditor
            headerStyle={{ width: "5%", minWidth: "8rem" }}
            bodyStyle={{ textAlign: "center" }}
          />
          <Column
            header="Actions"
            body={actionTemplate}
            style={{ width: "120px" }}
          />
        </DataTable>
      </div>

      <div className="col-12 mt-2">
        <div className="flex flex-row-reverse flex-wrap">
          <Button
            type="button"
            onClick={(e) => {
              onSaveAll(e);
            }}
            label={formData.po_master_id ? "Update" : "Save"}
            icon={isBusy ? "pi pi-spin pi-spinner" : "pi pi-check"}
            severity="success"
            size="small"
            loading={isBusy || editingRows.length > 0}
            disabled={orderChildItems && orderChildItems.length < 1}
          />
        </div>
      </div>
    </div>
  );
};

export default PrequestFormComponent;
