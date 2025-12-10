import React, { useState, useEffect, useMemo, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Accordion, AccordionTab } from "primereact/accordion";
import t_po_master from "@/models/purchase/t_po_master.json";
import { generateGuid } from "@/utils/guid";
import { EntryComponent } from "./EntryComponent";
import ProductComponent from "./ProductComponent";

const OrderFormComponent = ({
  isBusy,
  errors,
  setErrors,
  formData,
  formDataOrderItems,
  setFormDataOrderItems,
  onChange,
  onSave,
  paymentOptions,
  formDataOrderPayments,
  setFormDataOrderPayments,
}) => {
  const [editingRows, setEditingRows] = useState([]);
  const [payableNote, setPayableNote] = useState("");

  useEffect(() => {
    let note = "With ";
    if (formData.vat_payable) {
      note += "Vat";
    }
    if (formData.cost_payable) {
      note += " Cost";
    }
    setPayableNote(note);
  }, [formData.vat_payable, formData.cost_payable]);

  const [formDataPayment, setFormDataPayment] = useState({
    payment_id: "",
    payment_head: formData.order_type,
    payment_mode: "Cash",
    payment_amount: "",
    order_amount: "",
    payment_note: "",
  });

  useEffect(() => {
    const order_amount = formDataOrderItems.reduce(
      (sum, item) => sum + (item.product_qty || 0) * (item.product_price || 0),
      0
    );
    const discount_amount = formDataOrderItems.reduce(
      (sum, item) => sum + (item.discount_amount || 0),
      0
    );
    const vat_amount = formDataOrderItems.reduce(
      (sum, item) => sum + (item.vat_amount || 0),
      0
    );
    const total_amount =
      order_amount - discount_amount + vat_amount + (formData.order_cost || 0);

    let payable_amount = order_amount - discount_amount;
    if (formData.vat_payable) payable_amount += vat_amount;
    if (formData.cost_payable) payable_amount += formData.order_cost;

    const paidAmount = formDataOrderPayments.reduce(
      (sum, item) => sum + (item.payment_amount || 0),
      0
    );

    const due_amount = payable_amount - (paidAmount || 0);

    onChange("order_amount", (order_amount).toFixed(2));
    onChange("discount_amount", (discount_amount).toFixed(2));
    onChange("vat_amount", (vat_amount).toFixed(2));
    onChange("total_amount", (total_amount).toFixed(2));
    onChange("payable_amount", (payable_amount).toFixed(2));
    onChange("paid_amount", (paidAmount).toFixed(2));
    onChange("due_amount", (due_amount).toFixed(2));
  }, [
    formDataOrderItems,
    formData.order_cost,
    formData.paid_amount,
    formDataOrderPayments,
    formData.vat_payable,
    formData.cost_payable,
  ]);

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
    //set error if payment mode or payment amount is empty
    if (!payment_mode || !payment_amount) {
      setErrors({
        payment_mode: "Payment mode is required",
        payment_amount: "Payment amount is required",
      });
      return;
    }

    setFormDataOrderPayments((prevList) => {
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
          payment_head: formData.order_type,
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
      payment_head: formData.order_type,
      payment_mode: "Cash",
      payment_amount: "",
      order_amount: "",
      payment_note: "",
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

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setFormDataPayment({ ...formDataPayment, [name]: value });
  };

  const handleDeletePayment = (rowData) => {
    setFormDataOrderPayments((prev) =>
      prev.filter((item) => item.payment_id !== rowData.payment_id)
    );
  };

  const InvoiceHeader = () => {
    return (
      <div className="flex align-items-center gap-2 w-full">
        Invoice# {formData.order_no}, Date# {formData.order_date},{" "}
        {!formData.is_posted && (
          <span className="text-red-300">[Not posted]</span>
        )}
      </div>
    );
  };

  const InvoiceProducts = () => {
    return (
      <div className="flex align-items-center gap-2 w-full">
        Products# {formDataOrderItems.length}, Qty#{" "}
        {formDataOrderItems.reduce(
          (total, item) => total + item.product_qty,
          0
        )}
      </div>
    );
  };

  const InvoicePayments = () => {
    return (
      <>
        <span className="flex align-items-center gap-2 w-full">
          Payable# {formData.payable_amount}/-, Paid#{" "}
          <span className="text-green-500">{formData.paid_amount}/-</span>, Due#{" "}
          {formData.due_amount > 0 ? (
            <span className="text-red-500">{formData.due_amount}/-</span>
          ) : (
            <span className="text-green-500">{formData.due_amount}/-</span>
          )}
        </span>
      </>
    );
  };

  return (
    <div className="p-1">
      {/* {JSON.stringify(formData)} */}
      {/* Master Form */}
      <Accordion multiple activeIndex={[0, 1, 2]}>
        <AccordionTab header={InvoiceHeader}>
          <EntryComponent
            errors={errors}
            formData={formData}
            onChange={onChange}
          />
        </AccordionTab>

        <AccordionTab header={InvoiceProducts}>
          <ProductComponent
            formData={formData}
            formDataOrderItems={formDataOrderItems}
            setFormDataOrderItems={setFormDataOrderItems}
            editingRows={editingRows}
            setEditingRows={setEditingRows}
          />
        </AccordionTab>

        <AccordionTab header={InvoicePayments}>
          <div className="grid">
            {/* {JSON.stringify(formData.payable_note)} */}
            {/* Right side payment summary – 3 columns offset */}
            <div className="col-4 col-offset-8">
              {/* PAYMENT SUMMARY */}
              <div className="flex flex-column gap-3 mb-4">
                <div className="flex justify-content-between">
                  <span>{t_po_master.order_amount.name}</span>
                  <span className="font-bold">{formData.order_amount}/-</span>
                </div>

                <div className="flex justify-content-between">
                  {t_po_master.discount_amount.name}
                  <span className="font-bold">
                    {formData.discount_amount}/-
                  </span>
                </div>

                <div className="flex justify-content-between">
                  <span
                    onClick={() =>
                      onChange("vat_payable", !formData.vat_payable)
                    }
                  >
                    <input
                      type="checkbox"
                      checked={formData.vat_payable}
                      readOnly
                    />
                    {t_po_master.vat_amount.name}
                  </span>
                  <span className="font-bold">{formData.vat_amount}/-</span>
                </div>

                <div className="flex justify-content-between">
                  <span
                    onClick={() =>
                      onChange("cost_payable", !formData.cost_payable)
                    }
                  >
                    <input
                      type="checkbox"
                      checked={formData.cost_payable}
                      readOnly
                    />
                    {t_po_master.order_cost.name}
                  </span>
                  <InputNumber
                    name="order_cost"
                    value={formData.order_cost}
                    onValueChange={(e) => onChange("order_cost", e.value)}
                    mode="currency"
                    currency="BDT"
                    locale="en-US"
                    className={`${errors.order_cost ? "p-invalid" : ""}`}
                    inputStyle={{
                      width: "100%",
                      padding: "3px",
                      color: formData.order_cost > 0 ? "red" : "",
                      backgroundColor:
                        formData.order_cost > 0 ? "#f9fae9ff" : "",
                    }}
                  />
                  {errors.order_cost && (
                    <small className="text-red-500">{errors.order_cost}</small>
                  )}
                </div>

                <div className="flex justify-content-between">
                  <span>{t_po_master.total_amount.name}</span>
                  <span className="font-bold">{formData.total_amount}/-</span>
                </div>

                <div className="flex justify-content-between">
                  <span className="text-sm text-blue-500">
                    {t_po_master.payable_amount.name} {payableNote}
                  </span>
                  <span className="font-bold">{formData.payable_amount}/-</span>
                </div>

                <div className="flex justify-content-between">
                  <span>{t_po_master.paid_amount.name}</span>
                  <span className="font-bold text-green-500">
                    {formData.paid_amount}/-
                  </span>
                </div>

                <div className="flex justify-content-between">
                  <span>{t_po_master.due_amount.name}</span>
                  <span className="font-bold text-red-500">
                    {formData.due_amount}/-
                  </span>
                </div>

                <div className="flex justify-content-between">
                  <span>{t_po_master.other_cost.name}</span>
                  <InputNumber
                    name="other_cost"
                    value={formData.other_cost}
                    onValueChange={(e) => onChange("other_cost", e.value)}
                    mode="currency"
                    currency="BDT"
                    locale="en-US"
                    className={`${errors.other_cost ? "p-invalid" : ""}`}
                    inputStyle={{
                      width: "100%",
                      padding: "3px",
                      color: formData.other_cost > 0 ? "red" : "",
                      backgroundColor:
                        formData.other_cost > 0 ? "#f9fae9ff" : "",
                    }}
                  />
                  {errors.other_cost && (
                    <small className="text-red-500">{errors.other_cost}</small>
                  )}
                </div>
              </div>

              <hr className="my-2" />

              {/* COST AMOUNT INPUT */}
              <div className="field mb-3">
                <div className="flex flex-column gap-3 mb-4">
                  <div className="flex gap-3">
                    <Dropdown
                      name="payment_mode"
                      value={formDataPayment.payment_mode}
                      options={paymentOptions}
                      onChange={(e) => handlePaymentChange(e)}
                      className={`flex-1 ${
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
                      className={`flex-1 ${
                        errors.payment_amount ? "p-invalid" : ""
                      }`}
                      placeholder="Payment Amount"
                      inputStyle={{ width: "100%" }}
                      minFractionDigits={2}
                      maxFractionDigits={2}
                    />
                  </div>
                  {errors.payment_amount && (
                    <small className="text-red-500">
                      {errors.payment_amount}
                    </small>
                  )}
                  <div className="flex gap-3">
                    <InputText
                      name="payment_note"
                      value={formDataPayment.payment_note}
                      onChange={(e) => handlePaymentChange(e)}
                      className={`flex-1 ${
                        errors.payment_note ? "p-invalid" : ""
                      }`}
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
                </div>
                <DataTable
                  value={formDataOrderPayments}
                  editMode="row"
                  dataKey="payment_id"
                  emptyMessage="No items found."
                  className="bg-dark-300"
                  size="small"
                >
                  <Column field="payment_head" header="Head" />
                  <Column field="payment_mode" header="Mode" />
                  <Column field="payment_amount" header="Payment" />
                  <Column field="order_amount" header="Paid" />
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
                onSave(e);
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
                (formDataOrderItems && formDataOrderItems.length < 1) ||
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

export default OrderFormComponent;
