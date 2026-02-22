import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import TAreaListComp from "./TAreaListComp";
import TAreaFormComp from "./TAreaFormComp";
import { useTArea } from "@/hooks/crm/useTArea";

const TAreaPage = () => {
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
  } = useTArea();

  const getHeader = () => {
    const isList = currentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          {isList
            ? "Thana/Area"
            : formData.id
            ? "Edit Thana/Area"
            : "New Thana/Area"}
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
          <TAreaListComp
            dataList={dataList}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <TAreaFormComp
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

export default TAreaPage;
