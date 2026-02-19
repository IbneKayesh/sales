import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import ContactListComp from "./ContactListComp";
import ContactFormComp from "./ContactFormComp";
import { useContacts } from "@/hooks/crm/useContacts";

const ContactPage = () => {
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
    cntct_sorceOptions,
    cntct_cntryOptions,
    //ledger
    handleShowContactLedger,
    ledgerDataList,
    handleFilterDataList
  } = useContacts();

  const getHeader = () => {
    const isList = currentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          {isList
            ? "Contact"
            : formData.id
            ? "Edit Contact"
            : "Add New Contact"}
        </h3>

        <div className="flex gap-2">
          <ButtonGroup>
            <Button icon="pi pi-refresh" size="small" severity="secondary" onClick={handleRefresh} disabled={!isList}/>
            <Button label="New" icon="pi pi-plus" size="small" severity="info" onClick={handleAddNew} disabled={!isList}/>
            <Button label="Back" icon="pi pi-arrow-left" size="small" severity="help" onClick={handleCancel} disabled={isList}/>
          </ButtonGroup>
        </div>
      </div>
    );
  };

  return (
    <>
      <Card header={getHeader()} className="bg-dark-200 border-round p-3">
        {currentView === "list" ? (
          <ContactListComp
            dataList={dataList}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onShowContactLedger={handleShowContactLedger}
            ledgerDataList={ledgerDataList}
            onFilterDataList={handleFilterDataList}
          />
        ) : (
          <ContactFormComp
            isBusy={isBusy}
            errors={errors}
            formData={formData}
            onChange={handleChange}
            onSave={handleSave}
            cntct_sorceOptions={cntct_sorceOptions}
            cntct_cntryOptions={cntct_cntryOptions}
          />
        )}
      </Card>
    </>
  );
};

export default ContactPage;
