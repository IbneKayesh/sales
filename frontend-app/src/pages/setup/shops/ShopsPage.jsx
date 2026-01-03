import { useRef, useEffect } from "react";
import { useShops } from "@/hooks/setup/useShops";
import ShopsListComponent from "./ShopsListComponent";
import ShopsFormComponent from "./ShopsFormComponent";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const ShopsPage = () => {
  const toast = useRef(null);
  const {
    shopList,
    toastBox,
    isBusy,
    currentView,
    errors,
    fromData,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditShop,
    handleDeleteShop,
    handleRefresh,
    handleSaveShop,
  } = useShops();

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
            ? "Shops List"
            : fromData.shop_id
            ? "Edit Shop"
            : "Add New Shop"}
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
              label="New Shop"
              icon="pi pi-plus"
              size="small"
              className="hidden"
              onClick={handleAddNew}
            />
          </div>
        ) : (
          <Button
            label="Shops List"
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
          <ShopsListComponent
            dataList={shopList}
            onEdit={handleEditShop}
            onDelete={handleDeleteShop}
          />
        ) : (
          <ShopsFormComponent
            isBusy={isBusy}
            errors={errors}
            formData={fromData}
            onChange={handleChange}
            onSave={handleSaveShop}
          />
        )}
      </Card>
    </>
  );
};

export default ShopsPage;