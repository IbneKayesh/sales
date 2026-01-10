import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useAccountsHeads } from "@/hooks/accounts/useAccountsHeads";
import HeadsListComp from "./HeadsListComp";
import HeadsFormComp from "./HeadsFormComp";

const HeadsPage = () => {
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
  } = useAccountsHeads();

  const getHeader = () => {
    const isList = currentView === "list";
    return (
      <div className="flex align-items-center justify-content-between">
      <h3 className="m-0">
          {isList
            ? "Heads List"
            : formData.id
            ? "Edit Head"
            : "Add New Head"}
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
              label="New Head"
              icon="pi pi-plus"
              size="small"
              onClick={handleAddNew}
              disabled={true}
            />
          </div>
        ) : (
          <Button
            label="Head List"
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
          <HeadsListComp
            dataList={dataList}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <HeadsFormComp
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

export default HeadsPage;
