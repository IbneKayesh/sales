import React, { useState, useRef, useEffect } from "react";
import { useContacts } from "@/hooks/setup/useContacts";
import ContactsListComponent from "./ContactsListComponent";
import ContactsFormComponent from "./ContactsFormComponent";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const ContactsPage = () => {
  const toast = useRef(null);
  const {
    contacts,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataContact,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditContact,
    handleDeleteContact,
    handleSaveContact,
  } = useContacts();

  useEffect(() => {
    if (toastBox) {
      toast.current.show({
        severity: toastBox.severity,
        summary: toastBox.summary,
        detail: toastBox.detail,
        life: 3000,
      });
    }
  }, [toastBox]);

 const getHeader = () => {
  const isList = currentView === "list";

  return (
    <div className="flex align-items-center justify-content-between">
      <h2 className="m-0">
        {isList ? "Contacts List" : formDataContact.contact_id ? "Edit Contact" : "Add New Contact"}
      </h2>

      {isList ? (
        <Button
          label="New Contact"
          icon="pi pi-plus"
          className="p-button-primary"
          onClick={handleAddNew}
        />
      ) : (
        <Button
          type="button"
          label="Contacts List"
          icon="pi pi-arrow-left"
          onClick={handleCancel}
        />
      )}
    </div>
  );
};


  return (
    <>
      <Toast ref={toast} />
      <Card header={getHeader()} className="bg-dark-200 border-round p-3">
        {currentView === "list" ? (
          <ContactsListComponent
            dataList={contacts}
            onEdit={handleEditContact}
            onDelete={handleDeleteContact}
          />
        ) : (
          <ContactsFormComponent
            isBusy={isBusy}
            errors={errors}
            formData={formDataContact}
            onChange={handleChange}
            onSave={handleSaveContact}
          />
        )}
      </Card>
    </>
  );
};

export default ContactsPage;
