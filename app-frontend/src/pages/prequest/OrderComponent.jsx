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
import { Accordion, AccordionTab } from "primereact/accordion";

const OrderComponent = ({
  isBusy,
  errors,
  setErrors,
  formData,
  onChange,
  orderChildItems,
  setOrderChildItems,
  onSaveAll,
  formDataPaymentList,
  setFormDataPaymentList,
  paymentOptions,
}) => {
  const { itemsPurchase, handleFilterChange } = useItems();
  const { contactsSupplier } = useContacts();
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingRows, setEditingRows] = useState([]);
  const [disabledItemAdd, setDisabledItemAdd] = useState(false);
  const [itemQty, setItemQty] = useState(1);
  const [itemNote, setItemNote] = useState("");

  const [formDataPayment, setFormDataPayment] = useState({
    payment_id: "",
    payment_type: formData.order_type,
    payment_mode: "Cash",
    payment_amount: "",
    order_amount: "",
    payment_note: "",
  });

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setFormDataPayment({ ...formDataPayment, [name]: value });
  };

  const handleAddPayment = () => {
    //payment amount validation
    if (formDataPayment.payment_amount > formData.due_amount) {
      setErrors({
        payment_amount: "Payment amount cannot be more than due amount",
      });
      return;
    } else {
      setErrors({
        payment_amount: "",
      });
    }

    const { payment_mode, payment_note, payment_amount } = formDataPayment;
    if (!payment_mode || !payment_amount) return;

    setFormDataPaymentList((prevList) => {
      const index = prevList.findIndex(
        (row) => row.payment_mode === payment_mode
      );

      // If found → update existing row
      if (index !== -1) {
        const updated = [...prevList];
        updated[index] = {
          ...updated[index],
          payment_note: updated[index].payment_note,
          payment_amount: updated[index].payment_amount + payment_amount,
          order_amount: updated[index].payment_amount + payment_amount,
        };
        return updated;
      }

      // If not found → add new row
      return [
        ...prevList,
        {
          payment_id: generateGuid(),
          payment_type: formData.order_type,
          payment_mode,
          payment_note,
          payment_amount,
          order_amount: payment_amount,
        },
      ];
    });

    // Reset form
    setFormDataPayment({
      payment_id: "",
      payment_type: formData.order_type,
      payment_mode: "Cash",
      payment_note: "",
      payment_amount: "",
      order_amount: "",
    });
  };

  const actionTemplatePayment = (rowData) => {
    return (
      <span
        className="pi pi-trash text-red-600 text-bold px-2"
        onClick={() => handleDeletePayment(rowData)}
      ></span>
    );
  };

  const handleDeletePayment = (rowData) => {
    setFormDataPaymentList((prev) =>
      prev.filter((item) => item.payment_id !== rowData.payment_id)
    );
  };

  useEffect(() => {
    if (selectedItem) {
      setDisabledItemAdd(false);
    } else {
      setDisabledItemAdd(true);
    }
  }, [selectedItem]);

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
      booking_qty: itemQty || 1,
      order_qty: itemQty || 1,
      discount_percent: 0,
      discount_amount: 0,
      item_amount: item.purchase_rate * itemQty || 1, // Will be re-calculated on edit save,
      cost_rate: item.purchase_rate,
      item_note: itemNote,
      unit_difference_qty: item.unit_difference_qty,
      small_unit_name: item.small_unit_name,
      big_unit_name: item.big_unit_name,
      ismodified: 1, // Flag for new items
    };

    setOrderChildItems([...orderChildItems, newRow]);
    setSelectedItem(null);
    setItemQty(1);
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

    newData.order_qty = newData.booking_qty;
    
    const discountAmount = newData.discount_amount;

    const itemAmount = newData.item_rate * newData.booking_qty;
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
      <span
        className="pi pi-trash text-red-600 text-bold px-2"
        onClick={() => handleDelete(rowData)}
      ></span>
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

  const bookingQtyTemplate = (rowData) => {
    return `${rowData.booking_qty} ${rowData.small_unit_name} (${rowData.order_qty})`;
  };

  const totalBookingQty = orderChildItems.reduce(
    (sum, item) => sum + (item.booking_qty || 0),
    0
  );

  const totalOrderQty = orderChildItems.reduce(
    (sum, item) => sum + (item.order_qty || 0),
    0
  );

  const totalBookingQtyTemplate = () => {
    return `${totalBookingQty} (${totalOrderQty})`;
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
        <ConvertedQtyComponent qty={rowData.booking_qty} rowData={rowData} /> (
        <ConvertedQtyComponent qty={rowData.order_qty} rowData={rowData} />)
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

  const InvoiceHeader = () => {
    const contactName = contactsSupplier.find(
      (c) => c.value === formData.contact_id
    )?.label || <span className="text-red-500">No supplier selected</span>;

    const { order_no, order_date, is_posted } = formData;

    return (
      <span className="flex align-items-center gap-2 w-full">
        Invoice# {order_no}, Date# {order_date} for {contactName}
        {!is_posted && <span className="text-red-300">[Not posted]</span>}
      </span>
    );
  };

  const ProductsHeader = () => {
    return (
      <>
        <span className="flex align-items-center gap-2 w-full">
          Products# {orderChildItems.length}, Qty# {totalBookingQty}
        </span>
      </>
    );
  };

  const PaymentsHeader = () => {
    return (
      <>
        <span className="flex align-items-center gap-2 w-full">
          Total# {formData.total_amount} BDT, Paid#{" "}
          <span className="text-green-500">{formData.paid_amount}</span> BDT,
          Due#{" "}
          {formData.due_amount > 0 ? (
            <span className="text-red-500">{formData.due_amount}</span>
          ) : (
            <span className="text-green-500">{formData.due_amount}</span>
          )}{" "}
          BDT
        </span>
      </>
    );
  };

  return (
    <div className="p-1">
      <ConfirmDialog />
      {/* Master Form */}

      <Accordion multiple activeIndex={[0]}>
        <AccordionTab header={InvoiceHeader}>
          <div className="grid">
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
                value={
                  formData.order_date ? new Date(formData.order_date) : null
                }
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
            <div className="col-12 md:col-4">
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
                filter
                showClear
              />
              {errors.contact_id && (
                <small className="mb-3 text-red-500">{errors.contact_id}</small>
              )}
            </div>
            <div className="col-12 md:col-2">
              <label
                htmlFor="ref_no"
                className="block text-900 font-medium mb-2"
              >
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
            <div className="col-12 md:col-1">
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
                className={errors.is_posted ? "p-invalid" : ""}
              />

              {errors.is_posted && (
                <small className="text-red-500">{errors.is_posted}</small>
              )}
            </div>
          </div>
        </AccordionTab>

        <AccordionTab header={ProductsHeader}>
          {/* Child Editable Table */}
          <div className="flex align-items-center gap-2 mb-2">
            <Dropdown
              value={selectedItem}
              options={itemsPurchase.map((item) => ({
                label: item.item_name,
                value: item.item_id,
              }))}
              onChange={(e) => setSelectedItem(e.value)}
              placeholder="Select Item"
              optionLabel="label"
              optionValue="value"
              className="w-full"
              filter
              showClear
            />
            <InputNumber
              name="itemQty"
              value={itemQty}
              onValueChange={(e) => setItemQty(e.value)}
              placeholder="Enter Qty"
            />
            <InputText
              name="itemNote"
              value={itemNote}
              onChange={(e) => setItemNote(e.target.value)}
              placeholder="Note"
            />
            <Button
              label="Add"
              icon="pi pi-plus"
              onClick={handleAddItem}
              size="small"
              severity="info"
              className="pr-5"
              disabled={disabledItemAdd}
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
            className="bg-dark-300"
            size="small"
          >
            <Column
              field="item_name"
              header="Item Name"
              footer={
                <>
                  {orderChildItems.length} Items, {editingRows.length} Editing
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
              field="booking_qty"
              header="Booking Qty"
              body={bookingQtyTemplate}
              editor={numberEditor}
              footer={totalBookingQtyTemplate}
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
        </AccordionTab>

        <AccordionTab header={PaymentsHeader}>
          <div className="grid">
            {/* Right side payment summary – 3 columns offset */}
            <div className="col-3 col-offset-9">
              {/* PAYMENT SUMMARY */}
              <div className="flex flex-column gap-3 mb-4">
                <div className="flex justify-content-between">
                  <span>{t_po_master.t_po_master.order_amount.name}:</span>
                  <span className="font-bold">{formData.order_amount}/-</span>
                </div>

                <div className="flex justify-content-between">
                  <span>{t_po_master.t_po_master.discount_amount.name}:</span>
                  <span className="font-bold">
                    {formData.discount_amount}/-
                  </span>
                </div>

                <div className="flex justify-content-between">
                  <span>{t_po_master.t_po_master.cost_amount.name}</span>
                  <InputNumber
                    name="cost_amount"
                    value={formData.cost_amount}
                    onValueChange={(e) => onChange("cost_amount", e.value)}
                    mode="currency"
                    currency="BDT"
                    locale="en-US"
                    className={`${errors.cost_amount ? "p-invalid" : ""}`}
                  />
                  {errors.cost_amount && (
                    <small className="text-red-500">{errors.cost_amount}</small>
                  )}
                </div>

                <div className="flex justify-content-between">
                  <span>{t_po_master.t_po_master.total_amount.name}:</span>
                  <span className="font-bold">{formData.total_amount}/-</span>
                </div>

                <div className="flex justify-content-between">
                  <span>{t_po_master.t_po_master.paid_amount.name}:</span>
                  <span className="font-bold text-green-500">
                    {formData.paid_amount}/-
                  </span>
                </div>

                <div className="flex justify-content-between">
                  <span>{t_po_master.t_po_master.due_amount.name}:</span>
                  <span className="font-bold text-red-500">
                    {formData.due_amount}/-
                  </span>
                </div>

                <div className="flex justify-content-between">
                  <span>{t_po_master.t_po_master.other_cost.name}</span>
                  <InputNumber
                    name="other_cost"
                    value={formData.other_cost}
                    onValueChange={(e) => onChange("other_cost", e.value)}
                    mode="currency"
                    currency="BDT"
                    locale="en-US"
                    className={`${errors.other_cost ? "p-invalid" : ""}`}
                  />
                  {errors.other_cost && (
                    <small className="text-red-500">{errors.other_cost}</small>
                  )}
                </div>
              </div>

              {/* COST AMOUNT INPUT */}

              <div className="field mb-3">
                <div className="flex flex-column gap-3 mb-4">
                  <Dropdown
                    name="payment_mode"
                    value={formDataPayment.payment_mode}
                    options={paymentOptions}
                    onChange={(e) => handlePaymentChange(e)}
                    className={`w-full ${
                      errors.payment_mode ? "p-invalid" : ""
                    }`}
                    placeholder={`Select payment mode`}
                    optionLabel="label"
                    optionValue="value"
                  />
                  <InputNumber
                    name="payment_amount"
                    value={formDataPayment.payment_amount}
                    onValueChange={(e) => handlePaymentChange(e)}
                    className={`${errors.payment_amount ? "p-invalid" : ""}`}
                    placeholder="Payment Amount"
                  />
                  {errors.payment_amount && (
                    <small className="text-red-500">
                      {errors.payment_amount}
                    </small>
                  )}
                  <InputText
                    name="payment_note"
                    value={formDataPayment.payment_note}
                    onChange={(e) => handlePaymentChange(e)}
                    className={`${errors.payment_note ? "p-invalid" : ""}`}
                    placeholder="Payment Note"
                  />
                  <Button
                    type="button"
                    label="Add Payment"
                    icon="pi pi-plus"
                    severity="info"
                    size="small"
                    onClick={handleAddPayment}
                  />
                </div>
                <DataTable
                  value={formDataPaymentList}
                  editMode="row"
                  dataKey="payment_id"
                  emptyMessage="No items found."
                  className="bg-dark-300"
                  size="small"
                >
                  <Column field="payment_mode" header="Mode" />
                  <Column field="payment_amount" header="Paid" />
                  <Column field="payment_note" header="Note" />
                  <Column
                    header="Actions"
                    body={actionTemplatePayment}
                    style={{ width: "120px" }}
                  />
                </DataTable>
              </div>
            </div>
          </div>

          <div className="flex flex-row-reverse flex-wrap mt-2">
            <Button
              type="button"
              onClick={(e) => {
                onSaveAll(e);
              }}
              label={
                formData.po_master_id
                  ? "Update"
                  : formData.is_posted
                  ? "Save with Posted"
                  : "Save as Draft"
              }
              icon={isBusy ? "pi pi-spin pi-spinner" : "pi pi-check"}
              severity="success"
              size="small"
              loading={isBusy || editingRows.length > 0}
              disabled={
                (orderChildItems && orderChildItems.length < 1) ||
                formData.isedit ||
                formData.due_amount < 0
              }
            />
          </div>
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default OrderComponent;
