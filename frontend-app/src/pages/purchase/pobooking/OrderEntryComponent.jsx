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
  return (
    <div className="p-1">
      Credit Limit {creditLimit}
      <Accordion multiple activeIndex={[0, 1, 2]}>
        <AccordionTab header="Master">
          <MasterComponent
            errors={errors}
            formData={formData}
            handleChange={handleChange}
            setCreditLimit={setCreditLimit}
          />
        </AccordionTab>
        <AccordionTab header="Items">
          <ItemsComponent
            configLine={configLine}
            formDataList={formDataList}
            setFormDataList={setFormDataList}
          />
        </AccordionTab>
        <AccordionTab header="Payment">
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
          label="Save"
          className="p-button-primary"
          onClick={handleSave}
        />
      </div>
    </div>
  );
};

export default OrderEntryComponent;
