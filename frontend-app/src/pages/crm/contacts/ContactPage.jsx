import { Card } from "primereact/card";
import { Button } from "primereact/button";
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
    cntct_ctypeOptions,
    cntct_sorceOptions,
    cntct_cntryOptions,
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

        {isList ? (
          <div className="flex gap-2">
            <Button
              icon="pi pi-refresh"
              size="small"
              severity="secondary"
              onClick={handleRefresh}
            />
            <Button
              label="New Contact"
              icon="pi pi-plus"
              size="small"
              onClick={handleAddNew}
            />
          </div>
        ) : (
          <Button
            label="Contact List"
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
          <ContactListComp
            dataList={dataList}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <ContactFormComp
            isBusy={isBusy}
            errors={errors}
            formData={formData}
            onChange={handleChange}
            onSave={handleSave}
            cntct_ctypeOptions={cntct_ctypeOptions}
            cntct_sorceOptions={cntct_sorceOptions}
            cntct_cntryOptions={cntct_cntryOptions}
          />
        )}
      </Card>
    </>
  );
};

export default ContactPage;
