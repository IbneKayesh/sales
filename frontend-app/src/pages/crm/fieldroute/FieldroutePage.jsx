import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import RouteListComp from "./RouteListComp";
import RouteFormComp from "./RouteFormComp";
import { useFieldroute } from "@/hooks/crm/useFieldroute";

const FieldroutePage = () => {
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
  } = useFieldroute();

  const getHeader = () => {
    const isList = currentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          {isList
            ? "Field Route"
            : formData.id
            ? "Edit Field Route"
            : "Add New Field Route"}
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
      <Card header={getHeader()} className="bg-dark-200 border-round p-3">
        {currentView === "list" ? (
          <RouteListComp
            dataList={dataList}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <RouteFormComp
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

export default FieldroutePage;
