import React, { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import OrderMasterComponent from "./OrderMasterComponent";
import OrderChildComponent from "./OrderChildComponent";
import OrderPaymentComponent from "./OrderPaymentComponent";

const EntryFormComponent = ({
  configLine,
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
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [isAllowDue, setIsAllowDue] = useState(false);

  useEffect(() => {
    let isDisable = false;
    if (!isAllowDue && formData.due_amount > 0) {
      isDisable = true;
    } else {
      isDisable = false;
    }

    if (formDataOrderItems && formDataOrderItems.length < 1) {
      isDisable = true;
    }

    if (formData.isedit) {
      isDisable = true;
    }

    if (formData.due_amount < 0) {
      isDisable = true;
    }

    //console.log("isAllowDue: " + isAllowDue);
    //console.log("formData.due_amount: " + formData.due_amount);
    //console.log("isDisable: " + isDisable);

    setDisableSubmit(isDisable);
  }, [isAllowDue, formDataOrderItems, formData]);

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

    onChange("order_amount", order_amount.toFixed(2));
    onChange("discount_amount", discount_amount.toFixed(2));
    onChange("vat_amount", vat_amount.toFixed(2));
    onChange("total_amount", total_amount.toFixed(2));
    onChange("payable_amount", payable_amount.toFixed(2));
    onChange("paid_amount", paidAmount.toFixed(2));
    onChange("due_amount", due_amount.toFixed(2));
  }, [
    formDataOrderItems,
    formData.order_cost,
    formData.paid_amount,
    formDataOrderPayments,
    formData.vat_payable,
    formData.cost_payable,
  ]);

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
          <OrderMasterComponent
            errors={errors}
            formData={formData}
            onChange={onChange}
            setIsAllowDue={setIsAllowDue}
          />
        </AccordionTab>

        <AccordionTab header={InvoiceProducts}>
          <OrderChildComponent
            configLine={configLine}
            formData={formData}
            formDataOrderItems={formDataOrderItems}
            setFormDataOrderItems={setFormDataOrderItems}
          />
        </AccordionTab>

        <AccordionTab header={InvoicePayments}>
          <OrderPaymentComponent
            errors={errors}
            setErrors={setErrors}
            formData={formData}
            formDataOrderPayments={formDataOrderPayments}
            setFormDataOrderPayments={setFormDataOrderPayments}
            paymentOptions={paymentOptions}
            onChange={onChange}
          />

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
              loading={isBusy}
              disabled={disableSubmit}
            />
          </div>
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default EntryFormComponent;
