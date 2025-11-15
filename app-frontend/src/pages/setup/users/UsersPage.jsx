import React, { useState, useRef, useEffect } from "react";
import { useUsers } from "@/hooks/setup/useUsers";
import UsersListComponent from "./UsersListComponent";
import UsersFormComponent from "./UsersFormComponent";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const UsersPage = () => {
  const toast = useRef(null);
  const {
    users,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataUser,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditUser,
    handleDeleteUser,
    handleSaveUser,
  } = useUsers();

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
        {isList ? "Users List" : formDataUser.user_id ? "Edit User" : "Add New User"}
      </h2>

      {isList ? (
        <Button
          label="New User"
          icon="pi pi-plus"
          className="p-button-primary"
          onClick={handleAddNew}
        />
      ) : (
        <Button
          type="button"
          label="Users List"
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
          <UsersListComponent
            dataList={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        ) : (
          <UsersFormComponent
            isBusy={isBusy}
            errors={errors}
            formData={formDataUser}
            onChange={handleChange}
            onSave={handleSaveUser}
          />
        )}
      </Card>
    </>
  );
};

export default UsersPage;
