import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import OrderRouteListComp from "./OrderRouteListComp";
import OrderRouteFormComp from "./OrderRouteFormComp";
import OrderRouteOutletsComp from "./OrderRouteOutletsComp";
import { useOrderRoute } from "@/hooks/crm/useOrderRoute";

const OrderRoutePage = () => {
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
    //outlets
    selectedRoute,
    routeOutlets,
    outletFormData,
    setOutletFormData,
    handleChangeRoute,
    handleRouteOutlets,
    handleDeleteRouteOutlet,
    handleSaveRouteOutlet,
  } = useOrderRoute();

  const getHeader = () => {
    const isList = currentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          {isList
            ? "Order Route"
            : formData.id
              ? "Edit Order Route"
              : "New Order Route"}
        </h3>

        <div className="flex gap-2">
          <ButtonGroup>
            <Button
              icon="pi pi-refresh"
              size="small"
              severity="secondary"
              onClick={handleRefresh}
              disabled={!isList}
            />
            <Button
              label="New"
              icon="pi pi-plus"
              size="small"
              severity="info"
              onClick={handleAddNew}
              disabled={!isList}
            />
            <Button
              label="Back"
              icon="pi pi-arrow-left"
              size="small"
              severity="help"
              onClick={handleCancel}
              disabled={isList}
            />
          </ButtonGroup>
        </div>
      </div>
    );
  };

  return (
    <>
      <Card header={getHeader()} className="border-round p-3">
        {currentView === "list" ? (
          <OrderRouteListComp
            dataList={dataList}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onOutlets={handleRouteOutlets}
          />
        ) : currentView === "form" ? (
          <OrderRouteFormComp
            isBusy={isBusy}
            errors={errors}
            formData={formData}
            onChange={handleChange}
            onSave={handleSave}
          />
        ) : currentView === "outlets" ? (
          <OrderRouteOutletsComp
            dataList={routeOutlets}
            onDelete={handleDeleteRouteOutlet}
            selectedRoute={selectedRoute}
            outletFormData={outletFormData}
            setOutletFormData={setOutletFormData}
            onChange={handleChangeRoute}
            errors={errors}
            onSave={handleSaveRouteOutlet}
          />
        ) : null}
      </Card>
    </>
  );
};

export default OrderRoutePage;
