import { useState, useEffect } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import MasterComponent from "./MasterComponent";
import ItemsComponent from "./ItemsComponent";
import PaymentComponent from "./PaymentComponent";

const OrderEntryComponent = ({
  configLine,
  isBusy,
  errors,
  setErrors,
  formData,
  setFormData,
  formDataList,
  setFormDataList,
  formDataPaymentList,
  setFormDataPaymentList,
  handleChange,
  handleSave,
}) => {
  const [creditLimit, setCreditLimit] = useState(0);
  const [disableSubmit, setDisableSubmit] = useState(false);

  useEffect(() => {
    const hasProducts = formDataList.length > 0;
    const hasCreditLimit = formData.due_amount > creditLimit;
    if (!hasProducts || hasCreditLimit) {
      setDisableSubmit(true);
    } else {
      setDisableSubmit(false);
    }
  }, [formDataList, formData.due_amount, creditLimit]);

  useEffect(() => {
    const order_amount = formDataList.reduce(
      (sum, item) => sum + (item.product_qty || 0) * (item.product_price || 0),
      0
    );
    const discount_amount = formDataList.reduce(
      (sum, item) => sum + (item.discount_amount || 0),
      0
    );
    const vat_amount = formDataList.reduce(
      (sum, item) => sum + (item.vat_amount || 0),
      0
    );
    const total_amount =
      order_amount -
      discount_amount +
      vat_amount +
      (formData.include_cost || 0) +
      (formData.exclude_cost || 0);

    let payable_amount = order_amount + formData.include_cost - discount_amount;
    if (formData.is_vat_payable) payable_amount += vat_amount;

    const paidAmount = formDataPaymentList.reduce(
      (sum, item) => sum + (item.payment_amount || 0),
      0
    );

    const due_amount = payable_amount - (paidAmount || 0);

    handleChange("order_amount", order_amount.toFixed(2));
    handleChange("discount_amount", discount_amount.toFixed(2));
    handleChange("vat_amount", vat_amount.toFixed(2));
    handleChange("total_amount", total_amount.toFixed(2));
    handleChange("payable_amount", payable_amount.toFixed(2));
    handleChange("paid_amount", paidAmount.toFixed(2));
    handleChange("due_amount", due_amount.toFixed(2));
  }, [
    formDataList,
    formData.include_cost,
    formData.exclude_cost,
    formData.paid_amount,
    formDataPaymentList,
    formData.is_vat_payable,
  ]);

  const InvoiceHeader = () => {
    return (
      <div className="flex align-items-center gap-2 w-full">
        Invoice# {formData.order_no}, Date# {formData.order_date}{" "}
        {!formData.is_posted && (
          <span className="text-red-500">[Not posted]</span>
        )}
      </div>
    );
  };

  const InvoiceProducts = () => {
    return (
      <div className="flex align-items-center gap-2 w-full">
        Products# {formDataList.length}, Qty#{" "}
        {formDataList.reduce(
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
          <span className="text-green-500">{formData.paid_amount}/-,</span> Due#{" "}
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
      {/* Credit Limit {creditLimit} */}
      <Accordion multiple activeIndex={[0, 1, 2]}>
        <AccordionTab header={InvoiceHeader}>
          <MasterComponent
            errors={errors}
            formData={formData}
            handleChange={handleChange}
            setCreditLimit={setCreditLimit}
          />
        </AccordionTab>
        <AccordionTab header={InvoiceProducts}>
          <ItemsComponent
            configLine={configLine}
            formData={formData}
            formDataList={formDataList}
            setFormDataList={setFormDataList}
          />
        </AccordionTab>
        <AccordionTab header={InvoicePayments}>
          <PaymentComponent
            errors={errors}
            setErrors={setErrors}
            formData={formData}
            handleChange={handleChange}
            formDataPaymentList={formDataPaymentList}
            setFormDataPaymentList={setFormDataPaymentList}
          />
        </AccordionTab>
      </Accordion>
      <div className="flex justify-content-end">
        <Button
          type="button"
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
          onClick={handleSave}
          disabled={disableSubmit}
        />
      </div>
    </div>
  );
};

export default OrderEntryComponent;
