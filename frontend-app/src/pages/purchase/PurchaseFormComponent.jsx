import React, { useState, useEffect, useMemo } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Accordion, AccordionTab } from "primereact/accordion";
import ConvertedQtyComponent from "@/components/ConvertedQtyComponent";
import t_po_master from "@/models/purchase/t_po_master.json";
import { generateGuid } from "@/utils/guid";
import { EntryComponent } from "./EntryComponent";
import ProductComponent from "./ProductComponent";

const PurchaseFormComponent = ({
  isBusy,
  errors,
  formData,
  formDataOrderItems,
  setFormDataOrderItems,
  onChange,
  onSave,
  paymentOptions,
  formDataOrderPayments,
}) => {
  const [editingRows, setEditingRows] = useState([]);

  const [formDataPayment, setFormDataPayment] = useState({
    payment_id: "",
    payment_type: formData.order_type,
    payment_mode: "Cash",
    payment_amount: "",
    order_amount: "",
    payment_note: "",
  });

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
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setFormDataPayment({ ...formDataPayment, [name]: value });
  };

  const handleDeletePayment = (rowData) => {
    setFormDataPaymentList((prev) =>
      prev.filter((item) => item.payment_id !== rowData.payment_id)
    );
  };

  return (
    <div className="p-1">
      {JSON.stringify(formData)}
      {/* Master Form */}
      <Accordion multiple activeIndex={[0, 1, 2]}>
        <AccordionTab header={"Purchase Order"}>
          <EntryComponent
            errors={errors}
            formData={formData}
            onChange={onChange}
          />
        </AccordionTab>

        <AccordionTab header={"Order Details"}>
          <ProductComponent
            formDataOrderItems={formDataOrderItems}
            setFormDataOrderItems={setFormDataOrderItems}
            editingRows={editingRows}
            setEditingRows={setEditingRows}
          />
        </AccordionTab>

        <AccordionTab header={"Payment Details"}>
          <div className="grid">
            {/* Right side payment summary – 3 columns offset */}
            <div className="col-4 col-offset-8">
              {/* PAYMENT SUMMARY */}
              <div className="flex flex-column gap-3 mb-4">
                <div className="flex justify-content-between">
                  <span>{t_po_master.order_amount.name}:</span>
                  <span className="font-bold">{formData.order_amount}/-</span>
                </div>

                <div className="flex justify-content-between">
                  <span>{t_po_master.discount_amount.name}:</span>
                  <span className="font-bold">
                    {formData.discount_amount}/-
                  </span>
                </div>

                <div className="flex justify-content-between">
                  <span>{t_po_master.tax_amount.name}:</span>
                  <span className="font-bold">{formData.tax_amount}/-</span>
                </div>

                <div className="flex justify-content-between">
                  <span>{t_po_master.cost_amount.name}</span>
                  <InputNumber
                    name="cost_amount"
                    value={formData.cost_amount}
                    onValueChange={(e) => onChange("cost_amount", e.value)}
                    mode="currency"
                    currency="BDT"
                    locale="en-US"
                    className={`${errors.cost_amount ? "p-invalid" : ""}`}
                    inputStyle={{ width: "100%" }}
                  />
                  {errors.cost_amount && (
                    <small className="text-red-500">{errors.cost_amount}</small>
                  )}
                </div>

                <div className="flex justify-content-between">
                  <span>{t_po_master.total_amount.name}:</span>
                  <span className="font-bold">{formData.total_amount}/-</span>
                </div>

                <div className="flex justify-content-between">
                  <span>{t_po_master.paid_amount.name}:</span>
                  <span className="font-bold text-green-500">
                    {formData.paid_amount}/-
                  </span>
                </div>

                <div className="flex justify-content-between">
                  <span>{t_po_master.due_amount.name}:</span>
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
                    inputStyle={{ width: "100%" }}
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
                    inputStyle={{ width: "100%" }}
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
                  value={formDataOrderPayments}
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

export default PurchaseFormComponent;
