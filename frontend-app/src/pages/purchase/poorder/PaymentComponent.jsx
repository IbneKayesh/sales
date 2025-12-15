import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import t_po_master from "@/models/purchase/t_po_master.json";
import { paymentModeOptions } from "@/utils/vtable.js";
import { generateGuid } from "@/utils/guid";

const PaymentComponent = ({
  errors,
  setErrors,
  formData,
  handleChange,
  formDataPaymentList,
  setFormDataPaymentList,
}) => {
  const [payableNote, setPayableNote] = useState("");
  const [formDataPayment, setFormDataPayment] = useState({
    payment_id: "",
    shop_id: formData.shop_id,
    master_id: formData.master_id,
    contact_id: formData.contact_id,
    payment_head: formData.order_type,
    payment_mode: "Cash",
    payment_date: new Date().toISOString().split("T")[0],
    payment_amount: "",
    payment_note: "",
    ref_no: formData.order_no,
  });

  useEffect(() => {
    let note = "";
    if (formData.is_vat_payable) {
      note += " with Vat";
    }
    setPayableNote(note);
  }, [formData.is_vat_payable]);

  const handleChangePayment = (e) => {
    const { name, value } = e.target;
    setFormDataPayment({ ...formDataPayment, [name]: value });
  };

  const handleAddPayment = () => {
    const { payment_mode, payment_note, payment_amount } = formDataPayment;
    //set error if payment mode or payment amount is empty
    if (!payment_mode || !payment_amount) {
      setErrors({
        payment_mode: "Payment mode is required",
        payment_amount: "Payment amount is required",
      });
      return;
    }

    //payment amount validation
    if (formDataPayment.payment_amount > formData.due_amount) {
      setErrors({
        payment_amount: "The payment amount cannot exceed the due amount.",
      });
      return;
    } else {
      setErrors({
        payment_amount: "",
      });
    }

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
        };
        return updated;
      }

      // If not found → add new row
      return [
        ...prevList,
        {
          payment_id: generateGuid(),
          shop_id: formData.shop_id,
          master_id: formData.master_id,
          contact_id: formData.contact_id,
          payment_head: formData.order_type,
          payment_mode: payment_mode,
          payment_date: new Date().toISOString().split("T")[0],
          payment_amount: payment_amount,
          payment_note: payment_note,
          ref_no: formData.order_no,
        },
      ];
    });

    // Reset form
    setFormDataPayment({
      payment_id: "",
      shop_id: formData.shop_id,
      master_id: formData.master_id,
      contact_id: formData.contact_id,
      payment_head: formData.order_type,
      payment_mode: "",
      payment_date: new Date().toISOString().split("T")[0],
      payment_amount:"",
      payment_note: "",
      ref_no: formData.order_no,
    });
  };

  const handleDelete = (rowData) => {
    setFormDataPaymentList((prev) =>
      prev.filter((item) => item.payment_id !== rowData.payment_id)
    );
  };

  const action_BT = (rowData) => {
    return (
      <span
        className="pi pi-trash text-red-600 text-bold px-2"
        onClick={() => handleDelete(rowData)}
      ></span>
    );
  };

  return (
    <div className="grid">
      <div className="col-4 col-offset-4 border-2 border-gray-200 p-2">
        <div className="flex flex-column gap-3 mb-4">
          <div className="flex justify-content-between">
            <span>{t_po_master.order_amount.name} (1)</span>
            <span className="font-bold">{formData.order_amount}/-</span>
          </div>
          <div className="flex justify-content-between">
            {t_po_master.discount_amount.name} (2)
            <span className="font-bold">{formData.discount_amount}/-</span>
          </div>

          <div className="flex justify-content-between">
            <span
              onClick={() =>
                handleChange("is_vat_payable", !formData.is_vat_payable)
              }
            >
              <input
                type="checkbox"
                checked={formData.is_vat_payable}
                readOnly
              />
              {t_po_master.vat_amount.name} (3)
            </span>
            <span className="font-bold">{formData.vat_amount}/-</span>
          </div>

          <div className="flex justify-content-between">
            <span>{t_po_master.include_cost.name} (4)</span>
            <InputNumber
              name="include_cost"
              value={formData.include_cost}
              onValueChange={(e) => handleChange("include_cost", e.value)}
              mode="currency"
              currency="BDT"
              locale="en-US"
              className={`${errors.include_cost ? "p-invalid" : ""}`}
              inputStyle={{
                width: "100%",
                padding: "3px",
                color: formData.include_cost > 0 ? "red" : "",
                backgroundColor: formData.include_cost > 0 ? "#f9fae9ff" : "",
              }}
            />
            {errors.include_cost && (
              <small className="text-red-500">{errors.include_cost}</small>
            )}
          </div>

          <div className="flex justify-content-between">
            <span>{t_po_master.exclude_cost.name} (5)</span>
            <InputNumber
              name="exclude_cost"
              value={formData.exclude_cost}
              onValueChange={(e) => handleChange("exclude_cost", e.value)}
              mode="currency"
              currency="BDT"
              locale="en-US"
              className={`${errors.exclude_cost ? "p-invalid" : ""}`}
              inputStyle={{
                width: "100%",
                padding: "3px",
                color: formData.exclude_cost > 0 ? "red" : "",
                backgroundColor: formData.exclude_cost > 0 ? "#f9fae9ff" : "",
              }}
            />
            {errors.exclude_cost && (
              <small className="text-red-500">{errors.exclude_cost}</small>
            )}
          </div>

          <div className="flex justify-content-between">
            <span>{t_po_master.total_amount.name} (6) = (1-2+3+4+5)</span>
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
        </div>
      </div>
      <div className="col-4">
        <div className="field mb-3">
          <div className="flex flex-column gap-3 mb-4">
            <div className="flex gap-3">
              <Dropdown
                name="payment_mode"
                value={formDataPayment.payment_mode}
                options={paymentModeOptions}
                onChange={(e) => handleChangePayment(e)}
                className={`flex-1 ${errors.payment_mode ? "p-invalid" : ""}`}
                placeholder={`Select payment mode`}
                optionLabel="label"
                optionValue="value"
              />
              <InputNumber
                name="payment_amount"
                value={formDataPayment.payment_amount}
                onValueChange={(e) => handleChangePayment(e)}
                className={`flex-1 ${errors.payment_amount ? "p-invalid" : ""}`}
                placeholder="Payment Amount"
                inputStyle={{ width: "100%" }}
                minFractionDigits={2}
                maxFractionDigits={2}
              />
            </div>
            {errors.payment_amount && (
              <small className="text-red-500">{errors.payment_amount}</small>
            )}
            <div className="flex gap-3">
              <InputText
                name="payment_note"
                value={formDataPayment.payment_note}
                onChange={(e) => handleChangePayment(e)}
                className={`flex-1 ${errors.payment_note ? "p-invalid" : ""}`}
                placeholder="Payment Note"
              />
              <Button
                type="button"
                label="Add Payment"
                icon="pi pi-plus"
                severity="info"
                size="small"
                onClick={handleAddPayment}
                disabled={formData.due_amount <= 0}
              />
            </div>
          </div>
          {/* {JSON.stringify(formDataPaymentList?.[0])} */}
          <DataTable
            value={formDataPaymentList}
            editMode="row"
            dataKey="payment_id"
            emptyMessage="No items found."
            size="small"
          >
            <Column field="payment_head" header="Head" />
            <Column field="payment_mode" header="Mode" />
            <Column field="payment_date" header="Date" />
            <Column field="payment_amount" header="Paid" />
            <Column field="payment_note" header="Note" />
            <Column header="#" body={action_BT} style={{ width: "120px" }} />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;
