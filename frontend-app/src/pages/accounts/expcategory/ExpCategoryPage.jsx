import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import { useExpCategory } from "@/hooks/accounts/useExpCategory";
import ExpCategoryListComp from "./ExpCategoryListComp";
import ExpCategoryFormComp from "./ExpCategoryFormComp";

const ExpCategoryPage = () => {
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
  } = useExpCategory();

  const getHeader = () => {
    const isList = currentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          {isList
            ? "Category List"
            : formData.id
            ? "Edit Category"
            : "New Category"}
        </h3>

        <div className="flex gap-2">
          <ButtonGroup>
            <Button label="Refresh" icon="pi pi-refresh" size="small" severity="secondary" onClick={handleRefresh} disabled={!isList}/>
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
          <ExpCategoryListComp
            dataList={dataList}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <ExpCategoryFormComp
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

export default ExpCategoryPage;