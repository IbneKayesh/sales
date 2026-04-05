import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import { useBusiness } from "@/hooks/setup/useBusiness";
import BusinessListComp from "./BusinessListComp";
import BusinessFormComp from "./BusinessFormComp";

const LevelsPage = () => {
  const {
    isBusy,
    dataList,
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
  } = useBusiness();

  const getHeader = () => {
    const isList = currentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          {isList
            ? "Business List"
            : formData.id
              ? "Edit Business"
              : "Add Business"}
        </h3>

        <div className="flex gap-2">
          <ButtonGroup>
            <Button
              label="Refresh"
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
      <Card header={getHeader()} className="bg-dark-200 border-round p-3">
        {currentView === "list" ? (
          <BusinessListComp
            dataList={dataList}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <BusinessFormComp
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

export default LevelsPage;
