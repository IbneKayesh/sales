import { useState, useEffect } from "react";
import HeaderComp from "./HeaderComp";
import ItemsComp from "./ItemsComp";
import PaymentComp from "./PaymentComp";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import PrintComp from "./PrintComp";
import CancelItemsComp from "./CancelItemsComp";
import { Dialog } from "primereact/dialog";

const EntryComp = ({
  isBusy,
  errors,
  setErrors,
  formData,
  handleChange,
  formDataItemList,
  setFormDataItemList,
  formDataExpensesList,
  setFormDataExpensesList,
  formDataPaymentList,
  setFormDataPaymentList,
  handleSubmit,
  //cancel booking items
  cancelledRows,
  setCancelledRows,
  onCancelBookingItems,
  setCancelledPayment,
}) => {
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogName, setDialogName] = useState("payment");
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  const handlePrint = () => {
    setShowPrintDialog(true);
  };

  useEffect(() => {
    const hasProducts = formDataItemList.length < 1;
    const hasCreditLimit =
      Number(formData.mbkng_duamt) > Number(formData.cntct_crlmt);
    if (hasProducts || hasCreditLimit || formData.edit_stop) {
      //console.log("disable");
      setDisableSubmit(true);
    } else {
      setDisableSubmit(false);
    }
    //console.log(hasCreditLimit);
  }, [formDataItemList, formData.mbkng_duamt, formData.cntct_crlmt]);

  useEffect(() => {
    const order_amount = formDataItemList.reduce(
      (sum, item) =>
        sum + (Number(item.cbkng_itqty) || 0) * (Number(item.cbkng_itrat) || 0),
      0,
    );
    const discount_amount = formDataItemList.reduce(
      (sum, item) => sum + (Number(item.cbkng_dsamt) || 0),
      0,
    );
    const vat_amount = formDataItemList.reduce(
      (sum, item) => sum + (Number(item.cbkng_vtamt) || 0),
      0,
    );

    const total_amount =
      order_amount -
      (discount_amount +
        vat_amount +
        Number(formData.mbkng_incst || 0) +
        Number(formData.mbkng_excst || 0));

    let payable_amount =
      order_amount +
      Number(formData.mbkng_incst || 0) -
      (discount_amount + Number(formData.mbkng_rnamt || 0));
    if (formData.mbkng_vatpy === 1) payable_amount += vat_amount;

    const paidAmount = formDataPaymentList.reduce(
      (sum, item) => sum + (Number(item.rcvpy_pyamt) || 0),
      0,
    );

    const cancelledAmount = formData.mbkng_cnamt || 0;

    //console.log(payable_amount, paidAmount);
    const due_amount = payable_amount - cancelledAmount - (paidAmount || 0);

    handleChange("mbkng_odamt", Number(order_amount).toFixed(2));
    handleChange("mbkng_dsamt", Number(discount_amount).toFixed(2));
    handleChange("mbkng_vtamt", Number(vat_amount).toFixed(2));
    handleChange("mbkng_ttamt", Number(total_amount).toFixed(2));
    handleChange("mbkng_pyamt", Number(payable_amount).toFixed(2));
    handleChange("mbkng_pdamt", Number(paidAmount).toFixed(2));
    handleChange("mbkng_duamt", Number(Math.round(due_amount)).toFixed(2));
  }, [
    formDataItemList,
    formData.mbkng_incst,
    formData.mbkng_excst,
    formData.mbkng_pdamt,
    formDataPaymentList,
    formData.pmstr_vatpy,
    formData.pmstr_rnamt,
  ]);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const handleShowCancelDlg = () => {
    const hasCancelableItems = formDataItemList.some(
      (item) => item.cbkng_pnqty > 0,
    );
    if (hasCancelableItems) {
      setShowCancelDialog(true);
    }
  };
  const handleHideCancelDlg = () => {
    setShowCancelDialog(false);
  };

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
            label="Cancel"
            icon="pi pi-times"
            severity="danger"
            size="small"
            onClick={handleShowCancelDlg}
            disabled={!formData.id}
          />
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

      <Dialog
        header="Print/Payment/Including Expenses/Excluding Expenses"
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        closable={true}
        style={{ width: "50vw" }}
        footer="Footer"
      >
        <>
          {dialogName === "payment" ? (
            <PaymentComp />
          ) : dialogName === "including expenses" ? (
            <PaymentComp />
          ) : dialogName === "excluding expenses" ? (
            <PaymentComp />
          ) : (
            <PrintComp />
          )}
        </>
      </Dialog>

      <PrintComp
        visible={showPrintDialog}
        onHide={() => setShowPrintDialog(false)}
        formData={formData}
        formDataList={formDataItemList}
        formDataPaymentList={formDataPaymentList}
      />

      <CancelItemsComp
        visible={showCancelDialog}
        onHide={handleHideCancelDlg}
        formData={formData}
        formDataItemList={formDataItemList}
        cancelledRows={cancelledRows}
        setCancelledRows={setCancelledRows}
        onCancelBookingItems={onCancelBookingItems}
        setCancelledPayment={setCancelledPayment}
      />
    </div>
  );
};

export default EntryComp;
