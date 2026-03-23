import { useLedger } from "@/hooks/accounts/useLedger";
import LedgerListComp from "./LedgerListComp";
import LedgerFormComp from "./LedgerFormComp";
import TransferFormComp from "./TransferFormComp";
import AdviceEntryComp from "./AdviceEntryComp";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import AdviceListComp from "./AdviceListComp";

const LedgerPage = () => {
  const {
    isBusy,
    dataList,
    currentView,
    errors,
    formData,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleRefresh,
    handleSave,
    handleViewAdvice,
    //payment advice
    handleAddNewAdvice,
    formDataPaymentAdvice,
    handleChangePaymentAdvice,
    handleFindAdvice,
    paymentAdviceList,
    paymentAdviceSelectedList,
    handleAddPaymentAdvice,
    handleRemovePaymentAdvice,
    handleSavePaymentAdvice,
    //options
    handleAddNewTransfer,
    handleSaveTransfer,
    handleChangeTransfer,
  } = useLedger();

  const getHeader = () => {
    const isList = currentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          {isList ? "Ledger List" : formData.id ? "Edit Ledger" : "New Ledger"}
        </h3>

        <div className="flex gap-2">
          <ButtonGroup>
            <Button
              label="Refresh"
              icon="pi pi-refresh"
              size="small"
              severity="secondary"
              onClick={handleRefresh}
              disabled={!isList}
            />
            <Button
              label="New"
              icon="pi pi-plus"
              size="small"
              severity="info"
              onClick={handleAddNew}
              disabled={!isList}
            />
            <Button
              label="New Advice"
              icon="pi pi-plus"
              size="small"
              severity="warning"
              onClick={handleAddNewAdvice}
              disabled={!isList}
            />
            <Button
              label="Transfer"
              icon="pi pi-send"
              size="small"
              severity="success"
              onClick={handleAddNewTransfer}
              disabled={!isList}
            />
            <Button
              label="Back"
              icon="pi pi-arrow-left"
              size="small"
              severity="help"
              onClick={handleCancel}
              disabled={isList}
            />
          </ButtonGroup>
        </div>
      </div>
    );
  };

  return (
    <>
      <Card header={getHeader()} className="bg-dark-200 border-round p-3">
        {currentView === "list" ? (
          <LedgerListComp
            dataList={dataList}
            onViewAdvice={handleViewAdvice}
            onDelete={handleDelete}
          />
        ) : currentView === "transfer" ? (
          <TransferFormComp
            isBusy={isBusy}
            errors={errors}
            formData={formData}
            onChange={handleChangeTransfer}
            onSave={handleSaveTransfer}
          />
        ) : currentView === "advice-entry" ? (
          <AdviceEntryComp
            isBusy={isBusy}
            errors={errors}
            formData={formDataPaymentAdvice}
            onChange={handleChangePaymentAdvice}
            onFindAdvice={handleFindAdvice}
            dataList={paymentAdviceList}
            dataListSelected={paymentAdviceSelectedList}
            onAddPaymentAdvice={handleAddPaymentAdvice}
            onRemovePaymentAdvice={handleRemovePaymentAdvice}
            onSave={handleSavePaymentAdvice}
          />
        ) : currentView === "advice-list" ? (
          <AdviceListComp dataList={paymentAdviceList} />
        ) : (
          <LedgerFormComp
            isBusy={isBusy}
            errors={errors}
            formData={formData}
            onChange={handleChange}
            onSave={handleSave}
            //options
          />
        )}
      </Card>
    </>
  );
};

export default LedgerPage;
