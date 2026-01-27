import { useState, useEffect } from "react";
import HeaderComp from "./HeaderComp";
import ItemsComp from "./ItemsComp";
import PaymentComp from "./PaymentComp";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import PrintComp from "./PrintComp";
import CancelItemsComp from "./CancelItemsComp";
import { Dialog } from "primereact/dialog";
import ExpensesDlg from "./ExpensesDlg";
import PaymentDlg from "./PaymentDlg";

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

  //cancel
  handleCancel,
}) => {
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogName, setDialogName] = useState("payment");

  useEffect(() => {
    const hasProducts = formDataItemList.length < 1;
    const hasCreditLimit =
      Number(formData.minvc_duamt) > Number(formData.cntct_crlmt);
    if (hasProducts || hasCreditLimit || formData.edit_stop) {
      //console.log("disable");
      setDisableSubmit(true);
    } else {
      setDisableSubmit(false);
    }
    //console.log(hasCreditLimit);
  }, [formDataItemList, formData.minvc_duamt, formData.cntct_crlmt]);

  useEffect(() => {
    const order_amount = formDataItemList.reduce(
      (sum, item) =>
        sum + (Number(item.cinvc_itqty) || 0) * (Number(item.cinvc_itrat) || 0),
      0,
    );
    const discount_amount = formDataItemList.reduce(
      (sum, item) => sum + (Number(item.cinvc_dsamt) || 0),
      0,
    );
    const vat_amount = formDataItemList.reduce(
      (sum, item) => sum + (Number(item.cinvc_vtamt) || 0),
      0,
    );

    const include_cost = formDataExpensesList.reduce(
      (sum, item) =>
        item.expns_inexc === 1 ? sum + (Number(item.expns_xpamt) || 0) : sum,
      0,
    );

    const exclude_cost = formDataExpensesList.reduce(
      (sum, item) =>
        item.expns_inexc === 2 ? sum + (Number(item.expns_xpamt) || 0) : sum,
      0,
    );

    const sum_1_3_4 = order_amount + vat_amount + include_cost;
    const sum_2_5 = discount_amount + Number(formData.minvc_rnamt || 0);

    const total_amount = sum_1_3_4 - sum_2_5;

    const payable_amount =
      formData.minvc_vatpy === 1 ? total_amount : total_amount - vat_amount;

    const paid_amount = formDataPaymentList.reduce(
      (sum, item) => sum + (Number(item.paybl_dbamt) || 0),
      0,
    );

    const due_amount = payable_amount - (paid_amount || 0);

    handleChange("minvc_odamt", Number(order_amount).toFixed(2));
    handleChange("minvc_dsamt", Number(discount_amount).toFixed(2));
    handleChange("minvc_vtamt", Number(vat_amount).toFixed(2));
    handleChange("minvc_incst", Number(include_cost).toFixed(2));
    handleChange("minvc_excst", Number(exclude_cost).toFixed(2));
    handleChange("minvc_ttamt", Number(total_amount).toFixed(2));
    handleChange("minvc_pyamt", Number(payable_amount).toFixed(2));
    handleChange("minvc_pdamt", Number(paid_amount).toFixed(2));
    handleChange("minvc_duamt", Number(Math.round(due_amount)).toFixed(2));
  }, [
    formData.minvc_vatpy,
    formData.minvc_rnamt,
    formDataItemList,
    formDataPaymentList,
    formDataExpensesList,
  ]);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const handleShowCancelDlg = () => {
    const hasCancelableItems = formDataItemList.some(
      (item) => item.cinvc_pnqty > 0,
    );
    if (hasCancelableItems) {
      setShowCancelDialog(true);
    }
  };
  const handleHideCancelDlg = () => {
    setShowCancelDialog(false);
  };
  const handleShowIncludeCost = () => {
    setShowDialog(true);
    setDialogName("Including Expenses");
  };
  const handleShowExcludeCost = () => {
    setShowDialog(true);
    setDialogName("Excluding Expenses");
  };
  const handleShowPayment = () => {
    setShowDialog(true);
    setDialogName("Payment");
  };

  const handleShowPrint = () => {
    setShowDialog(true);
    setDialogName("Print");
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const dialogFooter = (
    <div className="flex justify-content-end gap-2 no-print">
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => setShowDialog(false)}
        severity="secondary"
      />
      {dialogName === "Print" && (
        <Button
          label="Print"
          icon="pi pi-print"
          onClick={() => handlePrintPdf()}
          severity="primary"
          raised
        />
      )}
    </div>
  );

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
        onShowIncludeCost={handleShowIncludeCost}
        onShowExcludeCost={handleShowExcludeCost}
        onShowPayment={handleShowPayment}
        formDataPaymentList={formDataPaymentList}
        setFormDataPaymentList={setFormDataPaymentList}
      />
      <div className="flex justify-content-end">
        <ButtonGroup>
          <Button
            type="button"
            label="Back"
            icon="pi pi-arrow-left"
            size="small"
            severity="help"
            onClick={handleCancel}
            disabled={!formData.id}
          />
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
            onClick={handleShowPrint}
            disabled={!formData.id}
          />
          <Button
            type="button"
            label={
              formData.id
                ? "Update"
                : formData.minvc_ispst
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
        header={dialogName}
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        closable={true}
        style={{ width: "50vw" }}
        footer={dialogFooter}
      >
        <>
          {dialogName === "Including Expenses" && (
            <ExpensesDlg
              formData={formData}
              formDataExpensesList={formDataExpensesList}
              setFormDataExpensesList={setFormDataExpensesList}
              dialogName={dialogName}
            />
          )}
          {dialogName === "Excluding Expenses" && (
            <ExpensesDlg
              formData={formData}
              formDataExpensesList={formDataExpensesList}
              setFormDataExpensesList={setFormDataExpensesList}
              dialogName={dialogName}
            />
          )}
          {dialogName === "Payment" && (
            <PaymentDlg
              formData={formData}
              formDataPaymentList={formDataPaymentList}
              setFormDataPaymentList={setFormDataPaymentList}
            />
          )}

          {dialogName === "Print" && (
            <PrintComp
              formData={formData}
              formDataItemList={formDataItemList}
              formDataPaymentList={formDataPaymentList}
            />
          )}
        </>
      </Dialog>

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
