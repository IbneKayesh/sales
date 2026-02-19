import { useState, useEffect } from "react";
import HeaderComp from "./HeaderComp";
import ItemsComp from "./ItemsComp";
import PaymentComp from "./PaymentComp";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import PrintComp from "./PrintComp";
import { Dialog } from "primereact/dialog";
import ExpensesDlg from "./ExpensesDlg";

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
    if (hasProducts || formData.edit_stop) {
      //console.log("disable");
      setDisableSubmit(true);
    } else {
      setDisableSubmit(false);
    }
    //console.log(hasCreditLimit);
  }, [formDataItemList]);

  useEffect(() => {
    const order_amount = formDataItemList.reduce(
      (sum, item) =>
        sum + (Number(item.ctrsf_itqty) || 0) * (Number(item.ctrsf_itrat) || 0),
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

    const total_amount = order_amount + exclude_cost;

    //console.log("total_amount", total_amount);

    handleChange("mtrsf_odamt", Number(order_amount).toFixed(2));
    handleChange("mtrsf_excst", Number(exclude_cost).toFixed(2));
    handleChange("mtrsf_ttamt", Number(total_amount).toFixed(2));
  }, [formDataItemList, formDataExpensesList]);

  const handleShowExcludeCost = () => {
    setShowDialog(true);
    setDialogName("Excluding Expenses");
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
        formData={formData}
        handleChange={handleChange}
        onShowExcludeCost={handleShowExcludeCost}
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
                : formData.mtrsf_ispst
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

          {dialogName === "Print" && (
            <PrintComp
              formData={formData}
              formDataItemList={formDataItemList}
              formDataPaymentList={formDataPaymentList}
            />
          )}
        </>
      </Dialog>
    </div>
  );
};

export default EntryComp;
