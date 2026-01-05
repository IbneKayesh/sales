import { useRef, useEffect } from "react";
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
    fromData,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditUser,
    handleDeleteUser,
    handleRefresh,
    handleSaveUser,
    roleOptions,
    shopOptions,
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
            ? "User List"
            : fromData.user_id
            ? "Edit User"
            : "Add New User"}
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
              label="New User"
              icon="pi pi-plus"
              size="small"
              onClick={handleAddNew}
            />
          </div>
        ) : (
          <Button
            label="User List"
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
            formData={fromData}
            onChange={handleChange}
            onSave={handleSaveUser}
            roleOptions={roleOptions}
            shopOptions={shopOptions}
          />
        )}
      </Card>
    </>
  );
};

export default UsersPage;
