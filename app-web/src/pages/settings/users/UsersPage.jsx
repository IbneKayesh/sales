import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import useUsers from "@/hooks/settings/useUsers";
import UsersFormComp from "./UsersFormComp";
import UsersListComp from "./UsersListComp";
import UsersMenuComp from "./UsersMenuComp";

const UsersPage = () => {
  const {
    //hooks
    pageAuth,
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    //other states
    dataListMenus,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleBackClick,
    handleSearchClick,
    handleRefreshClick,
    handleAddNewClick,
    handleSubmitClick,
    //other functions
    handleMenuPermission,
    handleAddEditMenu,
  } = useUsers();

  const isList = crView === "list" && true;
  const isForm = crView === "form" && true;

  const cardTitle = () => {
    return (
      <div className="flex align-items-center justify-content-between">
        <span className="page-title-text">{crTitle}</span>
        <div className="flex gap-2">
          <ButtonGroup>
            {(isForm || crView === "menus") && (
              <Button
                label="Back"
                icon="pi pi-arrow-left"
                size="small"
                severity="secondary"
                onClick={handleBackClick}
              />
            )}
            {isList && (
              <Button
                label="Find"
                icon="pi pi-search"
                size="small"
                severity="info"
                onClick={handleSearchClick}
              />
            )}
            {isList && (
              <Button
                label="Refresh"
                icon="pi pi-refresh"
                size="small"
                severity="warning"
                onClick={handleRefreshClick}
              />
            )}
            {(isList || isForm) && (
              <Button
                label="New"
                icon="pi pi-plus"
                size="small"
                severity="help"
                onClick={handleAddNewClick}
              />
            )}
            {isForm && (
              <Button
                label="Submit"
                icon="pi pi-save"
                size="small"
                severity="success"
                onClick={handleSubmitClick}
              />
            )}
          </ButtonGroup>
        </div>
      </div>
    );
  };

  return (
    <Card title={cardTitle} className="shadow-2 border-round p-2">
      {/* {JSON.stringify(dataListMenus)} */}
      {isList && (
        <UsersListComp
          pageAuth={pageAuth}
          dataList={dataList}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMenuPermission={handleMenuPermission}
        />
      )}
      {isForm && (
        <UsersFormComp
          formData={formData}
          errors={errors}
          onChange={handleChange}
          dzone_cntry_Options={dzone_cntry_Options}
        />
      )}

      {crView === "menus" && (
        <UsersMenuComp
          pageAuth={pageAuth}
          dataList={dataListMenus}
          onEdit={handleAddEditMenu}
          formData={formData}
        />
      )}
    </Card>
  );
};

export default UsersPage;
