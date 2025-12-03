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
    userList,
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
    handleRefresh,
    handleSaveUser,
    roleOptions,
  } = useUsers();

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
            ? "Users List"
            : formDataUser.user_id
            ? "Edit User"
            : "Add New User"}
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
              label="New User"
              icon="pi pi-plus"
              size="small"
              onClick={handleAddNew}
            />
          </div>
        ) : (
          <Button
            label="Users List"
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
          <UsersListComponent
            dataList={userList}
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
            roleOptions={roleOptions}
          />
        )}
      </Card>
    </>
  );
};

export default UsersPage;
