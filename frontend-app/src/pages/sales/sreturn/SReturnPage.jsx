import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useSreturn } from "@/hooks/sales/useSreturn";
import EntryComp from "./EntryComp";
import { Dialog } from "primereact/dialog";
import ExpensesDlg from "./ExpensesDlg";
import PaymentDlg from "./PaymentDlg";

const SReturnPage = () => {
  const {
    isBusy,
    currentView,
    dataList,
    errors,
    formData,
    handleChange,
    handleSave,
    //options
    formDataItemList,
    formDataExpensesList,
    formDataPaymentList,
    setFormDataItemList,
    setFormDataExpensesList,
    setFormDataPaymentList,
  } = useSreturn();

  const [showDialog, setShowDialog] = useState(false);
  const [dialogName, setDialogName] = useState("payment");
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

  const handlePrintPdf = () => {
    window.print();
  };

  const getHeader = () => {
    const isList = currentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          {isList ? "Return List" : formData.id ? "Edit Return" : "New Return"}
        </h3>
        <div className="flex gap-2"></div>
      </div>
    );
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


  
  useEffect(() => {
    const order_amount = formDataItemList.reduce(
      (sum, item) =>
        sum + (Number(item.cretn_itqty) || 0) * (Number(item.cretn_itrat) || 0),
      0,
    );
    const discount_amount = formDataItemList.reduce(
      (sum, item) => sum + (Number(item.cretn_dsamt) || 0),
      0,
    );
    const vat_amount = formDataItemList.reduce(
      (sum, item) => sum + (Number(item.cretn_vtamt) || 0),
      0,
    );

    const include_cost = formDataExpensesList.reduce(
      (sum, item) =>
        !!item.expns_inexc ? sum + (Number(item.expns_xpamt) || 0) : sum,
      0,
    );

    const exclude_cost = formDataExpensesList.reduce(
      (sum, item) =>
        !item.expns_inexc ? sum + (Number(item.expns_xpamt) || 0) : sum,
      0,
    );

    const sum_1_3_4 = order_amount + vat_amount + include_cost;
    const sum_2_5 = discount_amount + Number(formData.mretn_rnamt || 0);

    const total_amount = sum_1_3_4 - sum_2_5;

    const payable_amount =
      !!formData.mretn_vatpy ? total_amount : total_amount - vat_amount;

    const paid_amount = formDataPaymentList.reduce(
      (sum, item) => sum + (Number(item.rcvbl_dbamt) || 0),
      0,
    );

    const due_amount = payable_amount - (paid_amount || 0);

    handleChange("mretn_odamt", Number(order_amount).toFixed(2));
    handleChange("mretn_dsamt", Number(discount_amount).toFixed(2));
    handleChange("mretn_vtamt", Number(vat_amount).toFixed(2));
    handleChange("mretn_incst", Number(include_cost).toFixed(2));
    handleChange("mretn_excst", Number(exclude_cost).toFixed(2));
    handleChange("mretn_ttamt", Number(total_amount).toFixed(2));
    handleChange("mretn_pyamt", Number(payable_amount).toFixed(2));
    handleChange("mretn_pdamt", Number(paid_amount).toFixed(2));
    handleChange("mretn_duamt", Number(Math.round(due_amount)).toFixed(2));
  }, [
    formData.mretn_vatpy,
    formData.mretn_rnamt,
    formDataItemList,
    formDataPaymentList,
    formDataExpensesList,
  ]);

  return (
    <>
      <Card header={getHeader()} className="p-3">
        <EntryComp
          isBusy={isBusy}
          errors={errors}
          formData={formData}
          formDataItemList={formDataItemList}
          handleChange={handleChange}
          onShowIncludeCost={handleShowIncludeCost}
          onShowExcludeCost={handleShowExcludeCost}
          onShowPayment={handleShowPayment}
          handleSubmit={handleSave}
        />
      </Card>

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
        </>
      </Dialog>
    </>
  );
};
export default SReturnPage;
