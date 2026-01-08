import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useUsers } from "@/hooks/auth/useUsers";
import UsersListComp from "./UsersListComp";
import UsersFormComp from "./UsersFormComp";

const UsersPage = () => {
  const {
    dataList,
    isBusy,
    currentView,
    errors,
    formData,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditUser,
    handleDeleteUser,
    handleRefresh,
    handleSaveUser,
    roleOptions,
    businessOptions,
  } = useUsers();

  const getHeader = () => {
    const isList = currentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          {isList
            ? "User List"
            : formData.id
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
      <Card header={getHeader()} className="bg-dark-200 border-round p-3">
        {currentView === "list" ? (
          <UsersListComp
            dataList={dataList}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        ) : (
          <UsersFormComp
            isBusy={isBusy}
            errors={errors}
            formData={formData}
            onChange={handleChange}
            onSave={handleSaveUser}
            roleOptions={roleOptions}
            businessOptions={businessOptions}
          />
        )}
      </Card>
    </>
  );
};

export default UsersPage;
