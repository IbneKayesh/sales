import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import DeliveryVanListComp from "./DeliveryVanListComp";
import DeliveryVanFormComp from "./DeliveryVanFormComp";
import { useDeliveryVan } from "@/hooks/crm/useDeliveryVan";

const DeliveryVanPage = () => {
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
  } = useDeliveryVan();

  const getHeader = () => {
    const isList = currentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          {isList
            ? "Delivery Van"
            : formData.id
            ? "Edit Delivery Van"
            : "New Delivery Van"}
        </h3>

        <div className="flex gap-2">
          <ButtonGroup>
            <Button icon="pi pi-refresh" size="small" severity="secondary" onClick={handleRefresh} disabled={!isList}/>
            <Button label="New" icon="pi pi-plus" size="small" severity="info" onClick={handleAddNew} disabled={!isList}/>
            <Button label="Back" icon="pi pi-arrow-left" size="small" severity="help" onClick={handleCancel} disabled={isList}/>
          </ButtonGroup>
        </div>
      </div>
    );
  };

  return (
    <>
      <Card header={getHeader()} className="border-round p-3">
        {currentView === "list" ? (
          <DeliveryVanListComp
            dataList={dataList}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <DeliveryVanFormComp
            isBusy={isBusy}
            errors={errors}
            formData={formData}
            onChange={handleChange}
            onSave={handleSave}
          />
        )}
      </Card>
    </>
  );
};

export default DeliveryVanPage;
