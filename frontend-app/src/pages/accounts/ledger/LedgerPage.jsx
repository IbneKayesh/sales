import { useLedger } from "@/hooks/accounts/useLedger";
import LedgerListComp from "./LedgerListComp";
import LedgerFormComp from "./LedgerFormComp";
import TransferFormComp from "./TransferFormComp";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";

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
    handleSaveTransfer,
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

        <div className="flex gap-2">
          <ButtonGroup>
            <Button
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
