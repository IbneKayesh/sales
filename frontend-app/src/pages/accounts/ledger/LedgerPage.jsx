import { useLedger } from "@/hooks/accounts/useLedger";
import LedgerListComp from "./LedgerListComp";
import LedgerFormComp from "./LedgerFormComp";
import TransferFormComp from "./TransferFormComp";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

const LedgerPage = () => {
  const {
    dataList,
    isBusy,
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
    //options
    selectedHead,
    setSelectedHead,
    //transfer
    handleAddNewTransfer,
    handleSaveTransfer
  } = useLedger();

  const getHeader = () => {
    const isList = currentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          {isList
            ? "Ledger List"
            : formData.id
            ? "Edit Ledger"
            : "Add New Ledger"}
        </h3>

        {isList ? (
          <div className="flex gap-2">
            <Button
              icon="pi pi-refresh"
              size="small"
              severity="secondary"
              onClick={handleRefresh}
            />
            <Button
              label="New Ledger"
              icon="pi pi-plus"
              size="small"
              onClick={handleAddNew}
            />
            <Button
              label="New Transfer"
              icon="pi pi-send"
              size="small"
              onClick={handleAddNewTransfer}
            />
          </div>
        ) : (
          <Button
            label="Ledger List"
            icon="pi pi-arrow-left"
            size="small"
            onClick={handleCancel}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <Card header={getHeader()} className="bg-dark-200 border-round p-3">
        {currentView === "list" ? (
          <LedgerListComp
            dataList={dataList}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : currentView === "transfer" ? (
          <TransferFormComp
            isBusy={isBusy}
            errors={errors}
            formData={formData}
            onChange={handleChange}
            onSave={handleSaveTransfer}
          />
        ) : (
          <LedgerFormComp
            isBusy={isBusy}
            errors={errors}
            formData={formData}
            onChange={handleChange}
            onSave={handleSave}
            //options
            selectedHead={selectedHead}
            setSelectedHead={setSelectedHead}
          />
        )}
      </Card>
    </>
  );
};

export default LedgerPage;
