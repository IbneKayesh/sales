import React, { useState, useRef, useEffect } from "react";
import { useContacts } from "@/hooks/setup/useContacts";
import ContactListComponent from "./ContactListComponent";
import ContactFormComponent from "./ContactFormComponent";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const ContactPage = () => {
  const toast = useRef(null);
  const {
    contactList,
    contactTypeOptions,
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
    handleRefresh,
    handleSaveContact,
    handleLedger,
    contactsLedger,
  } = useContacts();

  useEffect(() => {
    if (toastBox && toast.current) {
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
        <h3 className="m-0">
          {isList
            ? "Contacts"
            : formDataContact.contact_id
            ? "Edit Contact"
            : "Add New Contact"}
        </h3>

        {isList ? (
          <div className="flex gap-2">
            <Button
              label="Refresh"
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
            label="Contacts List"
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
      <Toast ref={toast} />
      <Card header={getHeader()} className="bg-dark-200 border-round p-3">
        {currentView === "list" ? (
          <ContactListComponent
            dataList={contactList}
            onEdit={handleEditContact}
            onDelete={handleDeleteContact}
            onLedger={handleLedger}
            contactsLedger={contactsLedger}
          />
        ) : (
          <ContactFormComponent
            isBusy={isBusy}
            errors={errors}
            formData={formDataContact}
            onChange={handleChange}
            onSave={handleSaveContact}
            contactTypeOptions={contactTypeOptions}
          />
        )}
      </Card>
    </>
  );
};

export default ContactPage;
