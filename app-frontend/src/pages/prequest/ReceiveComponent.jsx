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
import ConvertedBDTCurrency from "@/components/ConvertedBDTCurrency";
import t_po_master from "@/models/prequest/t_po_master.json";
import { useContacts } from "@/hooks/setup/useContacts";
import { useItems } from "@/hooks/inventory/useItems";

const ReceiveComponent = ({
  isBusy,
  errors,
  formData,
  onChange,
  orderChildItems,
  setOrderChildItems,
  onSaveAll,
}) => {
  const { itemsPurchase, handleFilterChange } = useItems();
  const { contactsSupplier } = useContacts();
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingRows, setEditingRows] = useState([]);
  const [disabledItemAdd, setDisabledItemAdd] = useState(false);

  useEffect(() => {
    handleFilterChange("allitems");
  }, []);

  const handleAddItem = () => {
    if (!selectedItem) return;

    // Check if item is already added
    const existingItem = orderChildItems.find(
      (i) => i.item_id === selectedItem
    );
    if (existingItem) {
      // Item already exists, do not add duplicate
      setSelectedItem(null);
      return;
    }

    const item = itemsPurchase.find((i) => i.item_id === selectedItem);
    if (!item) return;

    const newRow = {
      id: generateGuid(), // Temporary ID for new items
      po_master_id: "sgd",
      item_id: selectedItem,
      item_name: item.item_name,
      item_rate: item.purchase_rate,
      booking_qty: 0,
      order_qty: 0,
      discount_percent: 0,
      discount_amount: 0,
      item_amount: item.purchase_rate * 1, // Will be re-calculated on edit save,
      cost_rate: item.purchase_rate,
      item_note: "",
      unit_difference_qty: item.unit_difference_qty,
      small_unit_name: item.small_unit_name,
      big_unit_name: item.big_unit_name,
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

    const discountAmount = newData.discount_amount;

    const itemAmount = newData.item_rate * newData.order_qty;
    newData.item_amount = itemAmount - discountAmount;

    const discountPercent =
      itemAmount > 0
        ? Math.round((discountAmount / itemAmount) * 100 * 100) / 100
        : 0;
    newData.discount_percent = discountPercent;

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
    const formattedItemRate = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.item_rate);
    const formattedCostRate = Number(rowData.cost_rate).toFixed(2);
    return `${formattedItemRate} (${formattedCostRate})`;
  };

  const orderQtyTemplate = (rowData) => {
    return `${rowData.order_qty} ${rowData.small_unit_name} (${rowData.booking_qty})`;
  };

  const totalBookingQty = orderChildItems.reduce(
    (sum, item) => sum + (item.booking_qty || 0),
    0
  );

  const totalOrderQty = orderChildItems.reduce(
    (sum, item) => sum + (item.order_qty || 0),
    0
  );

  const totalOrderQtyTemplate = () => {
    return `${totalOrderQty} (${totalBookingQty})`;
  };

  const discountAmountTemplate = (rowData) => {
    const discountAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.discount_amount);

    return `${discountAmount} (${rowData.discount_percent}%)`;
  };

  const totalDiscountAmount = orderChildItems.reduce(
    (sum, item) => sum + (item.discount_amount || 0),
    0
  );

  const discountAmountFooterTemplate = (rowData) => {
    const discountAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(totalDiscountAmount);

    return `${discountAmount}`;
  };

  const itemAmountTemplate = (rowData) => {
    //console.log("rowData" + JSON.stringify(rowData))
    const itemAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.item_amount);

    const itemAmountF = rowData.item_rate * rowData.booking_qty;

    return `${itemAmount} (${itemAmountF})`;
  };

  const convertedQtyTemplate = (rowData) => {
    return (
      <>
        <ConvertedQtyComponent qty={rowData.order_qty} rowData={rowData} /> (
        <ConvertedQtyComponent qty={rowData.booking_qty} rowData={rowData} />)
      </>
    );
  };

  const totalItemAmount = orderChildItems.reduce(
    (sum, item) => sum + (item.item_amount || 0),
    0
  );

  const itemAmountFooterTemplate = () => {
    return <ConvertedBDTCurrency value={totalItemAmount} asWords={true} />;
  };

  return (
    <div className="p-1">
      <ConfirmDialog />
      {/* Master Form */}
      <div className="grid">
        <div className="col-12 md:col-3">
          <label htmlFor="order_no" className="block text-900 font-medium mb-2">
            {t_po_master.t_po_master.order_no.name}
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
        <div className="col-12 md:col-2">
          <label
            htmlFor="order_date"
            className="block text-900 font-medium mb-2"
          >
            {t_po_master.t_po_master.order_date.name}
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
            htmlFor="contact_id"
            className="block text-900 font-medium mb-2"
          >
            {t_po_master.t_po_master.contact_id.name}
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="contact_id"
            value={formData.contact_id}
            options={contactsSupplier}
            onChange={(e) => onChange("contact_id", e.value)}
            className={`w-full ${errors.contact_id ? "p-invalid" : ""}`}
            placeholder={`Select ${t_po_master.t_po_master.contact_id.name}`}
            optionLabel="label"
            optionValue="value"
          />
          {errors.contact_id && (
            <small className="mb-3 text-red-500">{errors.contact_id}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label htmlFor="ref_no" className="block text-900 font-medium mb-2">
            {t_po_master.t_po_master.ref_no.name}
          </label>
          <InputText
            name="ref_no"
            value={formData.ref_no}
            onChange={(e) => onChange("ref_no", e.target.value)}
            className={`w-full ${errors.ref_no ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_po_master.t_po_master.ref_no.name}`}
          />
          {errors.ref_no && (
            <small className="mb-3 text-red-500">{errors.ref_no}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
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
        <div className="col-12 md:col-2">
          <label
            htmlFor="order_amount"
            className="block text-900 font-medium mb-2"
          >
            {t_po_master.t_po_master.order_amount.name}
          </label>
          <InputNumber
            name="order_amount"
            value={formData.order_amount}
            onValueChange={(e) => onChange("order_amount", e.value)}
            mode="currency"
            currency="BDT"
            locale="en-US"
            inputStyle={{ width: "100%" }}
            className={`w-full ${errors.order_amount ? "p-invalid" : ""}`}
            disabled
          />
          {errors.order_amount && (
            <small className="mb-3 text-red-500">{errors.order_amount}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="discount_amount"
            className="block text-900 font-medium mb-2"
          >
            {t_po_master.t_po_master.discount_amount.name}
          </label>
          <InputNumber
            name="discount_amount"
            value={formData.discount_amount}
            onValueChange={(e) => onChange("discount_amount", e.value)}
            mode="currency"
            currency="BDT"
            locale="en-US"
            inputStyle={{ width: "100%" }}
            className={`w-full ${errors.discount_amount ? "p-invalid" : ""}`}
            disabled
          />
          {errors.discount_amount && (
            <small className="mb-3 text-red-500">
              {errors.discount_amount}
            </small>
          )}
        </div>
        <div className="col-12 md:col-2">
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
            inputStyle={{ width: "100%" }}
            className={`w-full ${errors.total_amount ? "p-invalid" : ""}`}
            disabled
          />
          {errors.total_amount && (
            <small className="mb-3 text-red-500">{errors.total_amount}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
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
            inputStyle={{ width: "100%" }}
            className={`w-full ${errors.paid_amount ? "p-invalid" : ""}`}
          />
          {errors.paid_amount && (
            <small className="mb-3 text-red-500">{errors.paid_amount}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="cost_amount"
            className="block text-900 font-medium mb-2"
          >
            {t_po_master.t_po_master.cost_amount.name}
          </label>
          <InputNumber
            name="cost_amount"
            value={formData.cost_amount}
            onValueChange={(e) => onChange("cost_amount", e.value)}
            mode="currency"
            currency="BDT"
            locale="en-US"
            inputStyle={{ width: "100%" }}
            className={`w-full ${errors.cost_amount ? "p-invalid" : ""}`}
          />
          {errors.cost_amount && (
            <small className="mb-3 text-red-500">{errors.cost_amount}</small>
          )}
        </div>

        <div className="col-12 md:col-2">
          <label
            htmlFor="is_posted"
            className="block text-900 font-medium mb-2"
          >
            {t_po_master.t_po_master.is_posted.name}
          </label>
          <Checkbox
            name="is_posted"
            checked={formData.is_posted === 1}
            onChange={(e) => onChange("is_posted", e.checked ? 1 : 0)}
            className={`w-full ${errors.is_posted ? "p-invalid" : ""}`}
          />
          {errors.is_posted && (
            <small className="mb-3 text-red-500">{errors.is_posted}</small>
          )}
        </div>
      </div>

      {/* Child Editable Table */}
      <div className="mt-2">
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
            field="order_qty"
            header="Order Qty"
            body={orderQtyTemplate}
            editor={numberEditor}
            footer={totalOrderQtyTemplate}
          />
          <Column
            field="discount_amount"
            header="Discount"
            body={discountAmountTemplate}
            editor={itemRateEditor}
            footer={discountAmountFooterTemplate}
          />
          <Column
            field="item_amount"
            header="Amount"
            body={itemAmountTemplate}
            footer={itemAmountFooterTemplate}
          />
          <Column header="Bulk" body={convertedQtyTemplate} />
          <Column field="item_note" header="Note" editor={textEditor} />
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
            disabled={
              (orderChildItems && orderChildItems.length < 1) ||
              (formData.isedit)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ReceiveComponent;