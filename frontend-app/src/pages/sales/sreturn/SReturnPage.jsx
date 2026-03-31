import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useSreturn } from "@/hooks/sales/useSreturn";
import EntryComp from "./EntryComp";

const SReturnPage = () => {
  const {
    isBusy,
    currentView,
    dataList,
    errors,
    formData,
    handleChange,
    formDataItemList,
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
  return (
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
      />
    </Card>
  );
};
export default SReturnPage;
