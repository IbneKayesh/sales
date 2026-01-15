import { useState, useEffect } from "react";
import HeaderComp from "./HeaderComp";
import ItemsComp from "./ItemsComp";
import PaymentComp from "./PaymentComp";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";

const EntryComp = ({
  isBusy,
  errors,
  setErrors,
  formData,
  handleChange,
  formDataItemList,
  setFormDataItemList,
  formDataPaymentList,
  setFormDataPaymentList,
  handleSubmit,
}) => {
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  const handlePrint = () => {
    setShowPrintDialog(true);
  };

  useEffect(() => {
    const hasProducts = formDataItemList.length > 0;
    const hasCreditLimit = formData.pmstr_duamt > formData.cntct_crlmt;
    if (!hasProducts || hasCreditLimit || formData.edit_stop) {
      setDisableSubmit(true);
    } else {
      setDisableSubmit(false);
    }
  }, [formDataItemList, formData.pmstr_duamt, formData.cntct_crlmt]);

  useEffect(() => {
    const order_amount = formDataItemList.reduce(
      (sum, item) => sum + (item.bking_bkqty || 0) * (item.bking_bkrat || 0),
      0
    );
    const discount_amount = formDataItemList.reduce(
      (sum, item) => sum + (item.bking_dsamt || 0),
      0
    );
    const vat_amount = formDataItemList.reduce(
      (sum, item) => sum + (item.bking_vtamt || 0),
      0
    );
    const total_amount =
      order_amount -
      (discount_amount +
        vat_amount +
        Number(formData.pmstr_incst || 0) +
        Number(formData.pmstr_excst || 0));

    let payable_amount =
      order_amount + Number(formData.pmstr_incst || 0) - discount_amount;
    if (formData.pmstr_vatpy === "1") payable_amount += vat_amount;

    const paidAmount = formDataPaymentList.reduce(
      (sum, item) => sum + (item.rcvpy_pyamt || 0),
      0
    );

    const due_amount = payable_amount - (paidAmount || 0);

    handleChange("pmstr_odamt", order_amount);
    handleChange("pmstr_dsamt", discount_amount);
    handleChange("pmstr_vtamt", vat_amount);
    handleChange("pmstr_ttamt", total_amount);
    handleChange("pmstr_pyamt", payable_amount);
    handleChange("pmstr_pdamt", paidAmount);
    handleChange("pmstr_duamt", due_amount);
  }, [
    formDataItemList,
    formData.pmstr_incst,
    formData.pmstr_excst,
    formData.pmstr_pdamt,
    formDataPaymentList,
    formData.pmstr_vatpy,
  ]);

  return (
    <div>
      <HeaderComp
        errors={errors}
        formData={formData}
        handleChange={handleChange}
      />
      <ItemsComp
        formData={formData}
        formDataItemList={formDataItemList}
        setFormDataItemList={setFormDataItemList}
      />
      <PaymentComp
        errors={errors}
        setErrors={setErrors}
        formData={formData}
        handleChange={handleChange}
        formDataPaymentList={formDataPaymentList}
        setFormDataPaymentList={setFormDataPaymentList}
      />
      <div className="flex justify-content-end">
        <ButtonGroup>
          <Button
            type="button"
            label="Print"
            icon="pi pi-print"
            severity="info"
            size="small"
            onClick={handlePrint}
            disabled={!formData.id}
          />
          <Button
            type="button"
            label={
              formData.id
                ? "Update"
                : formData.pmstr_ispst
                ? "Save with Posted"
                : "Save as Draft"
            }
            icon={isBusy ? "pi pi-spin pi-spinner" : "pi pi-check"}
            severity="success"
            size="small"
            loading={isBusy}
            onClick={handleSubmit}
            disabled={disableSubmit}
          />
        </ButtonGroup>
      </div>
    </div>
  );
};

export default EntryComp;
